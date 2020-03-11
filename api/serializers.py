from SharedDrivers.models import User, Profile, Car, Event, Participant
from rest_framework import serializers


class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = '__all__'


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'


class EventSerializerShallow(serializers.ModelSerializer):
    participant_count = serializers.IntegerField(read_only=True, required=False)
    owner = serializers.PrimaryKeyRelatedField(required=False, queryset=Profile.objects.all())
    destination = serializers.ReadOnlyField(required=False)

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'address', 'destination', 'date_time', 'status', 'owner',
                  'participant_count']


class EventSerializerDeep(serializers.ModelSerializer):
    participant_set = ParticipantSerializer(many=True, read_only=True)
    owner = serializers.PrimaryKeyRelatedField(required=False, queryset=Profile.objects.all())
    destination = serializers.ReadOnlyField(required=False)
    
    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'address', 'destination', 'date_time', 'status', 'owner',
                  'participant_set']


class ProfileSerializer(serializers.ModelSerializer):
    car_set = CarSerializer(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = ['user', 'score', 'car_set']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'profile']
