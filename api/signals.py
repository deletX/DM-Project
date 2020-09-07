from .models import Profile, Notification
from django.contrib.auth.models import User
from django.db.models.signals import post_save


def create_profile(sender, **kwargs):
    """
    Create a new profile when a user is created
    """
    user = kwargs["instance"]
    if kwargs["created"]:
        profile = Profile.objects.create(user=user, score=0)


post_save.connect(create_profile, sender=User)


def create_notification_for_feedback(sender, **kwargs):
    """
    Create a new notification when a feedback has been given
    """
    feedback = kwargs["instance"]

    if kwargs["created"]:
        notification = Notification.objects.create(
            profile=feedback.receiver,
            title="New feedback",
            content="User {} gave you a {} star rating".format(feedback.giver.user, feedback.vote))


post_save.connect(create_notification_for_feedback, sender=Feedback)
