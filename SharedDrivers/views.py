from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from .models import Event


class EventListView(ListView):
    model = Event


class EventDetailView(DetailView):
    model = Event
