from django.core.exceptions import ValidationError
from django.shortcuts import render
from oauth2_provider.contrib.rest_framework import OAuth2Authentication
from rest_framework import viewsets, mixins, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_social_oauth2.views import ConvertTokenView

from .serializers import *


class EventViewSet(viewsets.ModelViewSet):
    """
    CRUD viewset for events

    /events?joinable=True&joined=True&owned=False
    /events/<pk>?joinable=True&joined=True&owned=False
    """

    def get_object(self):
        queryset = self.queryset
        return queryset.get(id=self.kwargs["pk"])

    def get_queryset(self):
        queryset = Event.objects.all()
        joinable = self.request.query_params.get('joinable', 'true')
        joined = self.request.query_params.get('joined', 'true')
        owned = self.request.query_params.get('owned', 'false')
        # print(joinable, joined, owned)
        merged = Event.objects.none()
        joined_queryset = queryset.filter(participant__profile__user=self.request.user)
        joinable_queryset = queryset.filter(status=Event.EventStatusChoices.JOINABLE)
        joinable_queryset = joinable_queryset.difference(joined_queryset)

        owned_queryset = queryset.filter(owner__user=self.request.user)

        if joinable == 'true':
            merged = merged.union(joinable_queryset)
        if joined == 'true':
            merged = merged.union(joined_queryset)
        if owned == 'true':
            merged = merged.union(owned_queryset)
        return merged.order_by('-date_time')

    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [OAuth2Authentication]
    queryset = Event.objects.all()

    def destroy(self, request, pk=None, *args, **kwargs):
        event = Event.objects.get(id=pk)
        if event.owner.user != request.user:
            raise PermissionDenied("Cannot delete an event you're not an owner of")
        return super(EventViewSet, self).destroy(request, *args, **kwargs)


class EventRunAPI(viewsets.GenericViewSet, mixins.ListModelMixin):
    """
    ViewSet to start event execution

    /events/<pk>/run
    """
    queryset = Event.objects.all()
    permission_classes = [IsAuthenticated]
    authentication_classes = [OAuth2Authentication]

    def list(self, request, event_pk=None, *args, **kwargs):
        event = Event.objects.get(id=event_pk)
        if event is None: return Response({"detail": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
        if request.user != event.owner.user: raise PermissionDenied("Cannot run an event you're not an owner of")
        try:
            event.run()
        except ValidationError:
            return Response({'detail': "not enough seats"}, status=status.HTTP_412_PRECONDITION_FAILED)
        return Response({'detail': "started"}, status=status.HTTP_202_ACCEPTED)


class ParticipantViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin,
                         mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    """
    Participant CRUD viewset

    /events/<pk>/participants
    /events/<pk>/participants/<pk>
    """
    permission_classes = [IsAuthenticated, ]

    def get_queryset(self):
        return Participant.objects.filter(event=self.kwargs['event_pk'])

    def get_serializer_class(self):
        return ParticipantCreateEditSerializer if (
                self.request.method == 'POST' or self.request.method == 'PUT') else ParticipantSerializer

    def destroy(self, request, event_pk=None, pk=None, *args, **kwargs):
        participant = Participant.objects.get(event_id=event_pk, id=pk)
        if participant.profile.user != request.user:
            raise PermissionDenied("Cannot delete an event you're not an owner of")
        return super(ParticipantViewSet, self).destroy(request, *args, **kwargs)


class CurrentProfileViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.UpdateModelMixin):
    """
    User profile viewset: get and put allowed
    /current-profile
    """
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsAuthenticated, ]

    def get_object(self):
        # return Profile.objects.get(user=User.objects.get(id=1))
        return Profile.objects.get(user=self.request.user)


class CreateNewUserView(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin,
                        mixins.DestroyModelMixin):
    """
    Signup Viewset: post, put and delete
    /signup
    """
    queryset = User.objects.all()

    def get_serializer_class(self):
        return UserCreateSerializer if self.request.method == 'POST' else UserEditSerializer

    def get_object(self):
        return self.request.user


class ProfileViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
    """
    ViewSet that handles ``get`` on other profile data
    /profiles/<pk>
    """
    serializer_class = ProfileSerializerOther
    queryset = Profile.objects.all()
    permission_classes = [IsAuthenticated, ]


class CarViewSet(viewsets.ModelViewSet):
    """
    Car CRUD viewset

    /profiles/<pk>/cars
    /profiles/<pk>/cars/<pk>
    """
    serializer_class = CarSerializer
    permission_classes = [IsAuthenticated, ]

    def get_queryset(self):
        return Car.objects.filter(owner_id=self.kwargs["profile_pk"])

    def update(self, request, profile_pk=None, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        if int(profile_pk) != profile.pk:
            raise PermissionDenied("Cannot change another user's car")
        return super(CarViewSet, self).update(request, *args, **kwargs)

    def create(self, request, profile_pk=None, *args, **kwargs):
        profile = Profile.objects.get(user=request.user)
        if int(profile_pk) != profile.pk:
            raise PermissionDenied("Cannot create a car for another user")
        return super(CarViewSet, self).create(request, *args, **kwargs)

    def destroy(self, request, profile_pk=None, pk=None, *args, **kwargs):
        car = Car.objects.get(owner=Profile.objects.get(pk=profile_pk), id=pk)
        if car.owner.user != request.user:
            raise PermissionDenied("Cannot delete a car you're not an owner of")
        return super(CarViewSet, self).destroy(request, *args, **kwargs)


class FeedbackViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.DestroyModelMixin,
                      mixins.UpdateModelMixin):
    """
    Create, delete update feedback view set

    /events/<pk>/participants/<pk>/feedback/<pk>
    """
    serializer_class = FeedbackEditSerializer
    permission_classes = [IsAuthenticated, ]

    def get_queryset(self):
        return Feedback.objects.filter(event=self.kwargs['event_pk'], receiver=self.kwargs['participant_pk'])


class NotificationViewSet(viewsets.GenericViewSet, mixins.UpdateModelMixin, mixins.ListModelMixin):
    """
    Notification viewset. Enable get(list) and update

    /current-profile/notifications
    /current-profile/notifications/<pk>
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, ]

    def get_queryset(self):
        return Notification.objects.filter(profile__user=self.request.user)


class SocialView(ConvertTokenView):
    def post(self, request, *args, **kwargs):
        response = super(SocialView, self).post(request, *args, **kwargs)
        # response.data['user'] = AccessToken.objects.get(token=response.data['access_token']).user_id
        return response


def custom_page_not_found_view(request, exception):
    return render(request, "index.html", {})
