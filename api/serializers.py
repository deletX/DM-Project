from .models import User, Profile, Car, Event, Participant, Feedback, Notification
from rest_framework import serializers
from django.db.utils import IntegrityError
from drf_extra_fields.geo_fields import PointField
from django.contrib.gis.geos.point import Point
from django.utils import timezone


def get_kwargs_request(request):
    return request._request.resolver_match.kwargs


class EventRelatedField(serializers.RelatedField):
    # See https://naveenlabs.com/2018/12/25/custom-serializer-related-field-using-django-rest-framework/
    def get_queryset(self):
        return Event.objects.all()

    def to_internal_value(self, data):
        try:
            try:
                event_id = data
                return Event.objects.get(id=event_id)
            except KeyError:
                raise serializers.ValidationError(
                    'id is a required field.'
                )
            except ValueError:
                raise serializers.ValidationError(
                    'id must be an integer.'
                )
        except Event.DoesNotExist:
            raise serializers.ValidationError(
                'Obj does not exist.'
            )

    def to_representation(self, value):
        event = Event.objects.filter(pk=value.pk).first()
        name = event.name
        date_time = event.date_time

        return {'id': value.pk, 'name': name, 'date_time': date_time}


class ProfileRelatedField(serializers.RelatedField):
    # See https://naveenlabs.com/2018/12/25/custom-serializer-related-field-using-django-rest-framework/
    def get_queryset(self):
        return Profile.objects.all()

    def to_internal_value(self, data):
        try:
            try:
                profile_id = data
                return Profile.objects.get(id=profile_id)
            except KeyError:
                raise serializers.ValidationError(
                    'id is a required field.'
                )
            except ValueError:
                raise serializers.ValidationError(
                    'id must be an integer.'
                )
        except Profile.DoesNotExist:
            raise serializers.ValidationError(
                'Obj does not exist.'
            )

    def to_representation(self, value):
        profile = Profile.objects.filter(id=value.id).first()
        first_name = profile.user.first_name
        last_name = profile.user.last_name
        username = profile.user.username
        email = profile.user.email
        picture = None
        average_vote = profile.average_vote()
        request = self.context.get('request', None)
        if profile.user.profile.picture:
            url = profile.user.profile.picture.url
            if request is not None:
                picture = request.build_absolute_uri(url)
        return {'id': value.pk, 'first_name': first_name, 'last_name': last_name, 'username': username, 'email': email,
                'picture': picture, 'average_vote': average_vote}


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email',)


class UserEditSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=128, write_only=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'password')

    def update(self, instance, validated_data):
        instance = self.context['request'].user
        password = validated_data.get("password", None)
        if password is not None:
            instance.set_password(password)
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.email = validated_data.get("email", instance.email)
        instance.save()
        return instance


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=128, write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = ['id', 'name', 'tot_avail_seats', 'fuel', 'consumption']

    def create(self, validated_data):
        current_user = self.context['request'].user.id
        owner_profile = Profile.objects.get(user=current_user)
        car = Car.objects.create(**validated_data, owner=owner_profile)
        return car

    def update(self, instance, validated_data):
        current_user = self.context['request'].user
        if current_user == instance.owner.user:
            instance.name = validated_data.get("name", instance.name)
            instance.tot_avail_seats = validated_data.get("tot_avail_seats", instance.tot_avail_seats)
            instance.fuel = validated_data.get("fuel", instance.fuel)
            instance.consumption = validated_data.get("consumption", instance.consumption)
            instance.save()
            return instance
        raise serializers.ValidationError('You aren\'t allowed to update someone else\'s car')


class NotificationSerializer(serializers.ModelSerializer):
    date_time = serializers.ReadOnlyField()
    content = serializers.ReadOnlyField()
    title = serializers.ReadOnlyField()
    url = serializers.ReadOnlyField()

    class Meta:
        model = Notification
        fields = ['id', 'date_time', 'title', 'content', 'read', 'url']

    def create(self, validated_data):
        raise serializers.ValidationError('You shouldn\'t create Notifications')

    def update(self, instance, validated_data):
        instance.read = validated_data.get("read", instance.read)
        instance.save()
        return instance

        # Only used for gets


class FeedbackSerializer(serializers.ModelSerializer):
    giver = ProfileRelatedField(read_only=True, required=False)
    event = EventRelatedField(read_only=True)
    receiver = ProfileRelatedField(read_only=True, required=False)

    class Meta:
        model = Feedback
        fields = ['id', 'giver', 'receiver', 'event', 'comment', 'vote']


class FeedbackEditSerializer(serializers.ModelSerializer):
    giver = ProfileRelatedField(read_only=True, required=False)
    receiver = serializers.PrimaryKeyRelatedField(required=True, queryset=Profile.objects.all())
    event = serializers.PrimaryKeyRelatedField(required=True, queryset=Event.objects.all(), allow_null=False)

    class Meta:
        model = Feedback
        fields = ['id', 'giver', 'receiver', 'event', 'comment', 'vote']

    def create(self, validated_data):
        current_user = self.context['request'].user
        owner_profile = Profile.objects.get(user=current_user)
        event = validated_data.get("event")
        receiver = validated_data.get("receiver")
        if receiver.id == owner_profile.id:
            raise serializers.ValidationError('You cannot post a feedback for yourself')

        if not event.participant_set.filter(profile=owner_profile).exists():
            raise serializers.ValidationError('You cannot post a feedback for an event you haven\'t attended')

        if not event.participant_set.filter(profile=receiver).exists():
            raise serializers.ValidationError('You cannot post a feedback for an user that hasn\'t attended the event')

        if event.date_time > timezone.now():
            raise serializers.ValidationError('You cannot post a feedback for an event that has yet to occur')

        if event.participant_set.filter(profile=receiver).first().car != event.participant_set.filter(
                profile=owner_profile).first().car:
            raise serializers.ValidationError('You cannot post a feedback for an user in another car')

        instance = Feedback.objects.create(**validated_data, giver=owner_profile)
        return instance

    def update(self, instance, validated_data):
        current_user = self.context['request'].user
        owner_profile = Profile.objects.get(user=current_user)
        event = validated_data.get("event", instance.event)
        receiver = validated_data.get("receiver", instance.receiver)
        if owner_profile != instance.giver:
            raise serializers.ValidationError('You cannot change another user feedback')
        if event != instance.event:
            raise serializers.ValidationError('You cannot change the event of the feedback')
        if receiver != instance.receiver:
            raise serializers.ValidationError('You cannot change the subject of this feedback')
        instance.vote = validated_data.get("vote", instance.vote)
        instance.comment = validated_data.get("comment", instance.comment)
        instance.save()
        return instance


class ProfileSerializerOther(serializers.ModelSerializer):
    car_set = CarSerializer(many=True)
    user = UserSerializer()
    received_feedback = FeedbackSerializer(many=True, read_only=True)
    picture = serializers.ImageField(allow_null=True)

    class Meta:
        model = Profile
        fields = ['id', 'user', 'score', 'picture', 'car_set', 'average_vote', 'received_feedback']


class ProfileSerializer(serializers.ModelSerializer):
    car_set = CarSerializer(many=True, read_only=True)
    user = UserSerializer(required=False, read_only=True)
    received_feedback = FeedbackSerializer(many=True, read_only=True)
    given_feedback = FeedbackSerializer(many=True, read_only=True)
    # notifications = NotificationSerializer(many=True, read_only=True)
    score = serializers.ReadOnlyField()
    picture = serializers.ImageField(allow_null=True)

    class Meta:
        model = Profile
        fields = ['id', 'user', 'picture', 'score', 'car_set', 'average_vote', 'received_feedback', 'given_feedback']


class ParticipantCreateEditSerializer(serializers.ModelSerializer):
    profile = serializers.PrimaryKeyRelatedField(required=False, read_only=True,
                                                 label='Profile id')
    event = serializers.PrimaryKeyRelatedField(required=False, read_only=True,
                                               label='Event id')
    car = serializers.PrimaryKeyRelatedField(required=True, queryset=Car.objects.all(), label='Car id', allow_null=True)

    class Meta:
        model = Participant
        fields = ['id', 'profile', 'starting_address', 'starting_pos', 'car', 'event']

    def create(self, validated_data):
        current_user = self.context['request'].user
        owner_profile = Profile.objects.get(user=current_user)
        _id = get_kwargs_request(self.context["request"])["event_pk"]
        event = Event.objects.get(id=_id)
        _car = validated_data.get("car")

        if event is None: raise serializers.ValidationError('Event doesn\'t exist')
        if event.status != Event.EventStatusChoices.JOINABLE: raise serializers.ValidationError('Event non joinable')
        try:
            participant = Participant.objects.create(**validated_data, event=event, profile=owner_profile)
        except IntegrityError:
            raise serializers.ValidationError('You are already taking part in this event')

        return participant

    def update(self, instance, validated_data):
        current_user = self.context['request'].user
        owner_profile = Profile.objects.get(user=current_user)
        event = validated_data.get("event", instance.event)
        car = validated_data.get("car", instance.car)
        if event != instance.event:
            raise serializers.ValidationError('You cannot change event')
        if current_user != instance.profile.user: raise serializers.ValidationError(
            'You cannot change another user\'s participation')
        instance.starting_address = validated_data.get("starting_address", instance.starting_address)
        instance.starting_pos = validated_data.get("starting_pos", instance.starting_pos)
        instance.car = car
        instance.save()
        return instance


class ParticipantSerializer(serializers.ModelSerializer):
    profile = ProfileRelatedField(read_only=True, required=False, many=False)
    car = CarSerializer()
    starting_pos = serializers.CharField()
    pickup_index = serializers.ReadOnlyField()
    expense = serializers.ReadOnlyField()
    isDriver = serializers.ReadOnlyField()

    class Meta:
        model = Participant
        fields = ['id', 'profile', 'starting_address', 'starting_pos', 'pickup_index', 'expense', 'car',
                  'isDriver']


class EventSerializer(serializers.ModelSerializer):
    owner = ProfileRelatedField(read_only=True, required=False)
    status = serializers.ChoiceField(choices=[0, 1, 2], default=0, read_only=True)
    participant_set = ParticipantSerializer(many=True, read_only=True, required=False)
    # default="SRID=4326;POINT (44.629418 10.948245)"
    destination = serializers.CharField()

    class Meta:
        model = Event
        fields = ['id', 'name', 'picture', 'description', 'address', 'destination', 'date_time', 'status', 'owner',
                  'participant_set']

    def create(self, validated_data):
        current_user = self.context['request'].user
        owner_profile = Profile.objects.get(user=current_user)
        event = Event.objects.create(**validated_data, owner=owner_profile)
        return event

    def update(self, instance, validated_data):
        current_user = self.context['request'].user
        owner_profile = Profile.objects.get(user=current_user)
        if current_user != instance.owner.user:
            raise serializers.ValidationError('You aren\'t allowed to update someone else\'s event')
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.address = validated_data.get("address", instance.address)
        instance.destination = validated_data.get("destination", instance.destination)
        instance.date_time = validated_data.get("date_time", instance.date_time)
        instance.status = validated_data.get("status", instance.status)
        instance.save()
        return instance
