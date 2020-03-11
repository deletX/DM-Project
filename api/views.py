from django.shortcuts import render
from django.shortcuts import get_object_or_404
from SharedDrivers.models import Event, Profile, User, Participant
from rest_framework import viewsets, mixins
from .serializers import EventSerializerShallow, EventSerializerDeep, ProfileSerializer, UserSerializer, \
    ParticipantSerializer
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_social_oauth2.authentication import SocialAuthentication


class EventViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin):
    serializer_class = EventSerializerShallow
    queryset = Event.objects.all().order_by('-date_time')

    def get_queryset(self):
        joined = self.queryset.filter(participant__user__user_id=self.request.user.id)
        joinable = self.queryset.filter(status=Event.EventStatusChoices.JOINABLE)
        return joined | joinable

    # authentication_classes = [SocialAuthentication, ]
    # permission_classes = [IsAuthenticated, ]

    @authentication_classes(SocialAuthentication)
    @permission_classes(IsAuthenticated)
    def retrieve(self, request, pk=None):
        if not self.queryset.get(id=pk).participant_set.filter(user__user_id=request.user.id).exists():
            raise PermissionDenied()
        data = get_object_or_404(self.queryset, pk=pk)

        serializer = EventSerializerDeep(data)
        return Response(serializer.data)

    @authentication_classes(SocialAuthentication)
    @permission_classes(IsAuthenticated)
    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        owner = Profile.objects.get(user_id=request.user.id)
        event = serializer.save()
        event.owner = Profile.objects.get(user_id=request.user.id)
        # TODO add conversion address -> destination
        event.save()
        return Response(serializer.data)

    @authentication_classes(SocialAuthentication)
    @permission_classes(IsAuthenticated)
    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if request.user.id != serializer.validated_data['owner']:
            raise PermissionDenied()

        # TODO add conversion address -> destination
        serializer.save()
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        return self.update(request)

    @authentication_classes(SocialAuthentication)
    @permission_classes(IsAuthenticated)
    def destroy(self, request, *args, **kwargs):
        event = self.get_object()
        if event.owner != request.user.id:
            raise PermissionDenied()
        event.delete()
        return Response("deleted")


class EventDetailGetSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
    queryset = Event.objects.all()
    serializer_class = EventSerializerDeep
    authentication_classes = [SocialAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def check_object_permissions(self, request, event):
        if not event.participant_set.filter(user__user_id=request.user.id).exists():
            raise PermissionDenied()


class ParticipantView(viewsets.GenericViewSet,
                      mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    serializer_class = ParticipantSerializer
    queryset = Participant.objects.all()
    authentication_classes = [SocialAuthentication, ]
    permission_classes = [IsAuthenticated, ]

    def check_object_permissions(self, request, participant):
        if self.request.user.id != participant.user_id:
            raise PermissionDenied()

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        participant = serializer.save()
        participant.user = Profile.objects.get(user_id=request.user.id)
        participant.save()
        return Response(serializer.data)

# Create your views here.
