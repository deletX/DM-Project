from django.shortcuts import render
from .tasks import test_background_task


def run_test_view(request):
    test_background_task.delay()
    return render(request, template_name='sharing_calc/test_template.html')

# Create your views here .
