from django.contrib import admin
from .models import Profile, Event, Participant, Car


class ParticipantInline(admin.StackedInline):
    model = Participant
    fields = ['user', 'car', 'starting_pos']
    extra = 3


class EventAdmin(admin.ModelAdmin):
    inlines = [ParticipantInline]
    fields = ['name', 'description', 'destination', 'date_time', 'owner']
    list_filter = ['date_time']
    search_fields = ['name']


class CarInline(admin.StackedInline):
    model = Car
    fields = ['name', 'tot_avail_seats', 'consumption', 'fuel']
    extra = 2


class ProfileAdmin(admin.ModelAdmin):
    fields = ['score']
    inlines = [CarInline]


admin.site.register(Event, EventAdmin)

admin.site.register(Profile, ProfileAdmin)

# Register your models here.
