from django.urls import path
from .views import run_test_view

urlpatterns = [
    path('', run_test_view),
]
