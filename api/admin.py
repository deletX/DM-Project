from django.contrib import admin

from .models import Profile, Event, Participant, Car, Feedback, Notification


class ParticipantInline(admin.StackedInline):
    model = Participant
    fields = ['profile', 'car', 'starting_pos']
    extra = 3


class FeedBacksInline(admin.StackedInline):
    model = Feedback
    fk_name = 'receiver'
    fields = ['giver', 'comment', 'vote', 'event']
    extra = 2


class NotificationInline(admin.StackedInline):
    model = Notification
    fk_name = 'profile'
    fields = ['date_time', 'title', 'content', 'url', 'read']


class EventAdmin(admin.ModelAdmin):
    inlines = [ParticipantInline]
    fields = ['picture', 'name', 'status', 'description', 'address', 'destination', 'date_time', 'owner']
    list_filter = ['date_time', 'status']
    search_fields = ['name']


class CarInline(admin.StackedInline):
    model = Car
    fields = ['name', 'tot_avail_seats', 'consumption', 'fuel']
    extra = 2


class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'score', 'average_vote']
    fields = ['picture', 'score', 'user']
    readonly_fields = ['average_vote', ]
    inlines = [CarInline, FeedBacksInline, NotificationInline]


admin.site.register(Event, EventAdmin)

admin.site.register(Profile, ProfileAdmin)
