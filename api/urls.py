from django.urls import include, path
from rest_framework import routers
from .views import EventViewSet, EventDetailGetSet, ParticipantView, ProfileView, SocialView, RunView

router = routers.DefaultRouter()
# router.register(r'profiles', ProfileViewSet)
router.register(r'events', EventViewSet)
router.register(r'events', EventDetailGetSet, basename='events')
router.register(r'participants', ParticipantView)
router.register(r'profile', ProfileView)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('events/<int:pk>/run', RunView.as_view()),
    path('auth/convert-token', SocialView.as_view()),
    path('auth/', include(('rest_framework_social_oauth2.urls', 'appname'), namespace='rest-auth')),
]
