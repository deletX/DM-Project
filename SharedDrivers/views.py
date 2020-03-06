from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from .models import Event
import logging
from sharing_calc.tasks import mock_algorithm_task
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin


class EventListView(ListView):
    model = Event

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context['event_list'] = Event.objects.all().order_by('-date_time')
        context['range'] = {'Joinable': 1, 'Computing': 2, 'Computed': 3}
        return context


class EventDetailView(LoginRequiredMixin, DetailView):
    model = Event

    @property
    def pk(self):
        return self.kwargs['pk']

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        context['event'] = Event.objects.get(id=self.pk)
        context['user'] = self.request.user
        return context


@login_required
def run_event_calc(request, pk):
    logging.warning("Running mock_algorithm_task")
    event = Event.objects.get(id=pk)
    event.status = Event.EventStatusChoices.COMPUTING
    event.save()
    mock_algorithm_task.delay(pk)
    return redirect('event-detail', pk=pk)
