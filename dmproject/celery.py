import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dmproject.settings')

celery_app = Celery('dmproject')
celery_app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
celery_app.autodiscover_tasks()
