from django.urls import include, path
from rest_framework_nested import routers
from .views import *

router = routers.SimpleRouter()
router.register(r'events', EventViewSet, basename='events')
router.register(r'profiles', ProfileViewSet, basename='profiles')

profile_router = routers.NestedSimpleRouter(router, r'profiles', lookup='profile')
profile_router.register(r'cars', CarViewSet, basename='cars')

events_router = routers.NestedSimpleRouter(router, r'events', lookup='event')
events_router.register(r'participants', ParticipantViewSet, basename='participants')
events_router.register(r'run', EventRunAPI, basename='run')

participant_router = routers.NestedSimpleRouter(events_router, r'participants', lookup='participant')
participant_router.register(r'feedback', FeedbackViewSet, basename='feedback')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(events_router.urls)),
    path('', include(participant_router.urls)),
    path('', include(profile_router.urls)),
    path('current-profile/',
         CurrentProfileViewSet.as_view({'get': 'retrieve', 'put': 'update'}),
         name='cur-prof'),
    path('current-profile/notifications/', NotificationViewSet.as_view({'get': 'list'}), name='notifications'),
    path('current-profile/notifications/<pk>', NotificationViewSet.as_view({'put': 'update'}),
         name='notifications-update'),
    path('signup/', CreateNewUserView.as_view({'post': 'create', 'put': 'update', 'delete': 'destroy'}), name='signup'),
    path('auth/', include(('rest_framework_social_oauth2.urls', 'appname'), namespace='rest-auth')),
]
