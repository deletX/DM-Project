from django.contrib.gis.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from django.db.models import Avg, Sum
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from django.contrib.gis.geos import Point
from django.db.models.signals import post_save
from dmproject import settings


def validate_date_not_in_past(date):
    if date.date() < timezone.now().date():
        raise ValidationError("Date cannot be in the past")


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    score = models.FloatField(default=0)
    picture = models.ImageField(upload_to='profile_pictures', blank=True)

    def average_vote(self):
        return self.received_feedback.aggregate(Avg('vote'))['vote__avg']

    def __str__(self):
        return self.user.username


class Car(models.Model):
    class FuelChoices:
        PETROL = 1
        DIESEL = 2
        GAS = 3
        ELECTRIC = 4
        choices = [
            (PETROL, 'Petrol'),
            (DIESEL, 'Diesel'),
            (GAS, 'Gas'),
            (ELECTRIC, 'Electric')
        ]

    name = models.CharField(max_length=50)
    tot_avail_seats = models.IntegerField(validators=[MinValueValidator(2), MaxValueValidator(9)])
    consumption = models.FloatField(default=10.0, validators=[MinValueValidator(0)])
    # l/100km
    fuel = models.SmallIntegerField(choices=FuelChoices.choices, default=1)
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Event(models.Model):
    class EventStatusChoices:
        JOINABLE = 0
        COMPUTING = 1
        COMPUTED = 2

    EVENT_STATUS_CHOICES = [
        (EventStatusChoices.JOINABLE, 'Joinable'),
        (EventStatusChoices.COMPUTING, 'Computing'),
        (EventStatusChoices.COMPUTED, 'Computed'),
    ]
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(max_length=2000)
    address = models.CharField(max_length=100)
    destination = models.PointField()
    date_time = models.DateTimeField(default=timezone.now, validators=[validate_date_not_in_past])
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE)
    status = models.SmallIntegerField(choices=EVENT_STATUS_CHOICES, default=0)
    picture = models.ImageField(default='default-event.jpg', upload_to='event_pictures')

    class Meta:
        unique_together = ['date_time', 'destination']

    def participant_count(self):
        return self.participant_set.count()

    def run(self):
        from api.tasks import mock_algorithm_task
        participants = self.participant_count()
        avail_seats = self.participant_set.filter(car__isnull=False).aggregate(
            avail_seats=Sum('car__tot_avail_seats'))['avail_seats']
        if avail_seats is None or avail_seats < participants:
            raise ValidationError("More cars are needed")
        if self.status == self.EventStatusChoices.JOINABLE:
            self.status = self.EventStatusChoices.COMPUTING
            self.save()
            for participant in self.participant_set.all():
                Notification.objects.create(profile=participant.profile, title=self.name + " started computing",
                                            content="The computation for the event has started",
                                            url="/events/" + str(self.id))
            if settings.DEBUG:
                mock_algorithm_task.delay(self.id)
            else:
                # TODO change this thing
                raise ValidationError("REAL TASK YET NOT DEFINED")
        else:
            raise ValidationError("Cannot run an event that is not joinable")

    def __str__(self):
        return self.name


class Participant(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    car = models.ForeignKey(Car, on_delete=models.CASCADE, null=True, blank=True, default=None)
    starting_address = models.CharField(max_length=100, blank=True)
    starting_pos = models.PointField()
    pickup_index = models.SmallIntegerField(default=-1)
    expense = models.FloatField(default=-1)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    is_driver = models.BooleanField(default=False)

    def has_given_feedback(self):
        return Feedback.objects.filter(giver=self.id).exists()

    class Meta:
        unique_together = ['profile', 'event']

    def clean_fields(self, exclude=None):
        if self.car:
            if not self.profile.car_set.filter(pk=self.car.id).exists():
                raise ValidationError(_('Car should be one of the user\'s'))

    def __str__(self):
        return self.profile.user.username


class Feedback(models.Model):
    giver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='given_feedback')
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='received_feedback')
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    comment = models.TextField(default="", max_length=500)
    vote = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)])

    class Meta:
        unique_together = ['giver', 'receiver', 'event']

    def __str__(self):
        return "FEEDBACK from {} to {} for {}: {}".format(self.giver, self.receiver, self.event, self.vote)


class Notification(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='notifications')
    date_time = models.DateTimeField(default=timezone.now)
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=200)
    read = models.BooleanField(default=False)
    url = models.URLField(default="", blank=True)


def create_profile(sender, **kwargs):
    user = kwargs["instance"]

    if kwargs["created"]:
        profile = Profile.objects.create(user=user, score=0)


post_save.connect(create_profile, sender=User)


def create_notification_for_feedback(sender, **kwargs):
    feedback = kwargs["instance"]

    if kwargs["created"]:
        notification = Notification.objects.create(profile=feedback.receiver, title="New feedback",
                                                   content="User {} gave you a {} star rating".format(
                                                       feedback.giver.user.username, feedback.vote))


post_save.connect(create_notification_for_feedback, sender=Feedback)
