from .models import Profile
from django.contrib.auth.models import User
from django.db.models.signals import post_save


def create_profile(sender, **kwargs):
    user = kwargs["instance"]
    if kwargs["created"]:
        profile = Profile.objects.create(user=user, score=0)


post_save.connect(create_profile, sender=User)
