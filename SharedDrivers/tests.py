from django.test import TestCase
from .models import Participant
from django.core.exceptions import ValidationError


class ParticipantTestCase(TestCase):

    def test_participant_car_is_one_of_theirs(self):
        participant = Participant()
        self.assertRaises(ValidationError, participant.clean_fields())
# Create your tests here.
