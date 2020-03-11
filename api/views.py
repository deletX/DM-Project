from django.shortcuts import render
from django.shortcuts import get_object_or_404
from SharedDrivers.models import Event, Profile, User, Participant
from rest_framework import viewsets, mixins
from .serializers import EventSerializerShallow, EventSerializerDeep, ProfileSerializer, UserSerializer, \
    ParticipantSerializer
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_social_oauth2.authentication import SocialAuthentication


class EventViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin):
    serializer_class = EventSerializerShallow
    queryset = Event.objects.all().order_by('-date_time')

    def get_queryset(self):
        def get_queryset(self):
            joined = self.queryset.filter(participant__user__user_id=self.request.user.id)
            joinable = self.queryset.filter(status=1)
            return joined | joinable

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
        request.data.update()
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        event = serializer.save()
        event.owner = Profile.objects.get(user_id=request.user.id)
        # TODO add conversion address -> destination
        event.save()

    # TODO def update()
    # TODO def partial_update() maybe
    # TODO def destroy


class EventDetailGetSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
    queryset = Event.objects.all()
    serializer_class = EventSerializerDeep
    # TODO authentication_classes and permission_classes


class ParticipantUpdateDelete(viewsets.GenericViewSet,
                              mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    # TODO authentication_classes and permission_classes
    serializer_class = ParticipantSerializer
    queryset = Participant.objects.all()

    def perform_update(self, serializer):
        if self.request.user.id != serializer.validated_data.user:
            raise PermissionDenied()

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     # permission =
# Create your views here.
