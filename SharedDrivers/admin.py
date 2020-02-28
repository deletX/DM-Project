from django.contrib import admin
from .models import Profile, Event, Participant, Car

admin.site.register(Event)
admin.site.register(Car)
admin.site.register(Profile)
admin.site.register(Participant)

# Register your models here.
