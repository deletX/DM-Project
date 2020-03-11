from django.urls import include, path
from rest_framework import routers
from .views import EventViewSet, EventDetailGetSet, ParticipantUpdateDelete

router = routers.DefaultRouter()
# router.register(r'profiles', ProfileViewSet)
router.register(r'events', EventViewSet)
router.register(r'events', EventDetailGetSet, basename='events')
router.register(r'participants', ParticipantUpdateDelete)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('auth', include(('rest_framework_social_oauth2.urls', 'appname'), namespace='rest-auth')),
]
