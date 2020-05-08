"""dmproject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, re_path
from django.conf.urls.static import static
from django.conf import settings
from django.urls import include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v0.1/', include(('api.urls', 'api'), namespace='api')),
    path('social/', include('social_django.urls', namespace='social')),
    path('', TemplateView.as_view(template_name="index.html")),
    path('home', TemplateView.as_view(template_name="index.html")),
    path('login', TemplateView.as_view(template_name="index.html")),
    path('signup', TemplateView.as_view(template_name="index.html")),
    path('home', TemplateView.as_view(template_name="index.html")),
    path('add', TemplateView.as_view(template_name="index.html")),
    path('my-profile', TemplateView.as_view(template_name="index.html")),
    path('profiles/<int:num>/', TemplateView.as_view(template_name="index.html")),
    path('profiles/', TemplateView.as_view(template_name="index.html")),
    path('events/<int:num>/', TemplateView.as_view(template_name="index.html")),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# urlpatterns += static('/', document_root=settings.STATIC_ROOT)

handler404 = 'api.views.custom_page_not_found_view'
