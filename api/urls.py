from django.urls import include, path
from rest_framework import routers
from .views import EventViewSet, EventDetailGetSet

router = routers.DefaultRouter()
# router.register(r'profiles', ProfileViewSet)
router.register(r'events', EventViewSet)
router.register(r'events', EventDetailGetSet, basename='events')
# router.register(r'users', UserViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
]
