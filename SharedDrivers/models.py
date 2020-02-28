from django.contrib.gis.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from django.utils import timezone


class Car(models.Model):
    class FuelChoices(models.IntegerChoices):
        PETROL = 1
        DIESEL = 2
        GAS = 3
        ELECTRIC = 4

    name = models.CharField(max_length=50)
    tot_avail_seats = models.IntegerField(validators=[MinValueValidator(2), MaxValueValidator(9)])
    consumption = models.FloatField(default=10.0)  # l/100km
    fuel = models.SmallIntegerField(choices=FuelChoices.choices, default=1)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    score = models.FloatField(default=0)


class Event(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=2000)
    destination = models.PointField()
    date_time = models.DateTimeField(default=timezone.now)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)


class Participant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    car = models.ForeignKey(Car, on_delete=models.CASCADE, null=True, blank=True)
    starting_pos = models.PointField()
    pickup_index = models.SmallIntegerField(default=-1)
    expense = models.FloatField(default=-1)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

# Create your models here.
