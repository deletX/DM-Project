import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'init_test.settings')

celery_app = Celery('init_test')
celery_app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
celery_app.autodiscover_tasks()
