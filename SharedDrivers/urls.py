from django.urls import path
from django.urls import include
from .views import EventListView, EventDetailView, run_event_calc

urlpatterns = [
    path('', EventListView.as_view(), name='event-list'),
    path('<int:pk>', EventDetailView.as_view(), name='event-detail'),
    path('<int:pk>/run', run_event_calc, name='calc-event'),
]
