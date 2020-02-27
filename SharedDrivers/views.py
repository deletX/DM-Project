from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return HttpResponse("Bella cretino")

# Create your views here.
