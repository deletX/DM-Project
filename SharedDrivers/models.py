from django.contrib.gis.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from django.contrib.gis.geos import Point
from django.db.models.signals import post_save


def validate_date_not_in_past(date):
    if date.date() < timezone.now().date():
        raise ValidationError("Date cannot be in the past")


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    score = models.FloatField(default=0)

    def __str__(self):
        return self.user.username


class Car(models.Model):
    class FuelChoices(models.IntegerChoices):
        PETROL = 1
        DIESEL = 2
        GAS = 3
        ELECTRIC = 4

    name = models.CharField(max_length=50)
    tot_avail_seats = models.IntegerField(validators=[MinValueValidator(2), MaxValueValidator(9)])
    consumption = models.FloatField(default=10.0, validators=[MinValueValidator(0)])
    # l/100km
    fuel = models.SmallIntegerField(choices=FuelChoices.choices, default=1)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Event(models.Model):
    class EventStatusChoices(models.IntegerChoices):
        JOINABLE = 1
        COMPUTING = 2
        COMPUTED = 3

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(max_length=2000)
    address = models.CharField(max_length=100)
    destination = models.PointField(default=Point(44.629418, 10.948245))
    date_time = models.DateTimeField(default=timezone.now, validators=[validate_date_not_in_past])
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE)
    status = models.SmallIntegerField(choices=EventStatusChoices.choices, default=1)

    class Meta:
        unique_together = ['date_time', 'destination']

    def participant_count(self):
        return self.participant_set.count()

    def __str__(self):
        return self.name


class Participant(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    car = models.ForeignKey(Car, on_delete=models.CASCADE, null=True, blank=True, default=None)
    starting_address = models.CharField(max_length=100, blank=True)
    starting_pos = models.PointField()
    pickup_index = models.SmallIntegerField(default=-1)
    expense = models.FloatField(default=-1)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['user', 'event']

    def clean_fields(self, exclude=None):
        # print(self.car_id)
        # print(self.car.pk)
        if self.car:
            if not self.user.car_set.filter(pk=self.car.id).exists():
                raise ValidationError(_('Car should be one of the user\'s'))

    def __str__(self):
        return self.user.user.username


def create_profile(sender, **kwargs):
    user = kwargs["instance"]
    if kwargs["created"]:
        profile = Profile.objects.create(user=user, score=0)


post_save.connect(create_profile, sender=User)
