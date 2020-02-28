from django.contrib import admin
from .models import Profile, Event, Participant, Car


class EventAdmin(admin.ModelAdmin):
    fields = ['name', 'description', 'destination', 'date_time', 'owner']
    list_filter = ['date_time']
    search_fields = ['name']


class CarAdmin(admin.ModelAdmin):
    fields = ['name', 'tot_avail_seats', 'consumption', 'fuel']
    list_filter = ['fuel', 'tot_avail_seats']


class ProfileAdmin(admin.ModelAdmin):
    fields = ['score']


class ParticipantAdmin(admin.ModelAdmin):
    fields = ['car', 'starting_pos', 'event']
    search_fields = ['event', 'user']


admin.site.register(Event, EventAdmin)
admin.site.register(Car, CarAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Participant, ParticipantAdmin)

# Register your models here.
