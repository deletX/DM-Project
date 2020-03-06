from django.shortcuts import render
from django.shortcuts import get_object_or_404
from SharedDrivers.models import Event, Profile, User, Participant
from rest_framework import viewsets, mixins
from .serializers import EventSerializerShallow, EventSerializerDeep, ProfileSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied


class EventViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin):
    serializer_class = EventSerializerShallow
    queryset = Event.objects.all().order_by('-date_time')

    def get_queryset(self):
        def get_queryset(self):
            joined = self.queryset.filter(participant__user__user_id=self.request.user.id)
            joinable = self.queryset.filter(status=1)
            return joined | joinable

    def retrieve(self, request, pk=None):
        if not Participant.objects.filter(event_id=pk, user__user_id=request.user.id).exists():
            raise PermissionDenied()
        data = get_object_or_404(self.queryset, pk=pk)

        serializer = EventSerializerDeep(data)
        return Response(serializer.data)


class EventDetailGetSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
    queryset = Event.objects.all()
    serializer_class = EventSerializerDeep

# class EventWorkingView
# class ProfileViewSet(viewsets.ModelViewSet):
#     queryset = Profile.objects.all().order_by('event', 'user__username')
#     serializer_class = ProfileSerializer
#     # permission =


# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     # permission =
# Create your views here.
