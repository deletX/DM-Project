from django.contrib.auth.models import User
import logging
import os

from .models import *
from rest_framework.test import APITestCase
from django.urls import reverse
import json
from django.utils import timezone, dateformat
import subprocess
from unittest import skip


class EventViewSetAPITestCase(APITestCase):
    """
    Class for testing get, post, put and delete with events
    """

    def setUp(self):
        self.username = "test_usr"
        self.email = "test_email"
        self.password = "test_password"
        self.user = User.objects.create_user(self.username, self.email, self.password)
        self.client.force_authenticate(user=self.user)

        self.name = "evento_simpaitco"
        self.description = "description"
        self.address = "qui"
        self.destination = "SRID=4326;POINT (44.6291598 10.9744844)"
        self.owner = Profile.objects.get(user=self.user)

        self.event = Event.objects.create(name=self.name, description=self.description, address=self.address,
                                          destination=self.destination,
                                          owner=self.owner)

    def test_list_events(self):
        url = reverse("api:events-list")
        response = self.client.get(url)
        self.assertEqual(len(response.data), Event.objects.count())
        self.assertEqual(response.data[0]["name"], self.name)
        # Create your tests here.

    def test_post_events(self):
        url = reverse("api:events-list")

        data = {"name": "other_name", "description": self.description, "address": self.address,
                "destination": self.destination}
        data = json.dumps(data)
        response = self.client.post(url, data=data,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Event.objects.count(), 2)

    def test_post_event_with_same_name(self):
        url = reverse("api:events-list")

        data = {"name": self.name, "description": self.description, "address": "other_addr"}
        data = json.dumps(data)
        response = self.client.post(url, data=data,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_post_event_with_same_date_and_destination(self):
        now = dateformat.format(timezone.now(), "Y-m-d H:i")
        url = reverse("api:events-list")
        data = {"name": "other_name", "description": self.description, "address": self.address,
                "destination": self.destination,
                "date_time": now}
        data = json.dumps(data)
        response = self.client.post(url, data=data,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201, msg=response.json())
        data = {"name": "other_name_2", "description": self.description, "address": self.address,
                "date_time": now}
        data = json.dumps(data)
        response = self.client.post(url, data=data,
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_get_event_detail(self):
        url = reverse("api:events-detail", kwargs={'pk': self.event.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], self.name)

    # @skip("Check why on first run fails and on succeeding ones it does")
    def test_get_event_detail_non_existing(self):
        url = reverse("api:events-detail", kwargs={'pk': 666})
        with self.assertRaises(Event.DoesNotExist):
            response = self.client.get(url)

    def test_delete_event(self):
        url = reverse("api:events-detail", kwargs={'pk': self.event.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Event.objects.count(), 0)

    def test_put_event(self):
        url = reverse("api:events-detail", kwargs={'pk': self.event.pk})
        name_edited = self.name + "_edited"
        data = {'name': name_edited, 'description': self.description, 'address': self.address,
                'destination': self.destination}
        response = self.client.put(url, json.dumps(data), content_type="application/json")
        self.assertEqual(response.status_code, 200, msg=response.json())
        event = Event.objects.get(id=self.event.id)
        self.assertEqual(event.name, name_edited)

    def test_put_event_other_user(self):
        other_user = User.objects.create_user(username="second_user", password="second_pass")
        other_prof = Profile.objects.get(user=other_user)
        cur_event = Event.objects.create(name="other_nam", description=self.description, address=self.address,
                                         destination=self.destination,
                                         owner=other_prof)
        url = reverse("api:events-detail", kwargs={'pk': cur_event.pk})
        name_edited = self.name + "_edited"
        data = {'name': name_edited, 'description': self.description, 'address': self.address}

        response = self.client.put(url, json.dumps(data), content_type="application/json")

        self.assertEqual(response.status_code, 400)
        self.event.refresh_from_db()
        self.assertEqual(self.event.name, self.name)

    def test_delete_event_other_user(self):
        other_user = User.objects.create_user(username="second_user", password="second_pass")
        other_prof = Profile.objects.get(user=other_user)
        cur_event = Event.objects.create(name="other_nam", description=self.description, address=self.address,
                                         owner=other_prof, destination=self.destination)
        url = reverse("api:events-detail", kwargs={'pk': cur_event.pk})

        response = self.client.delete(url)

        self.assertEqual(response.status_code, 403)
        self.assertEqual(Event.objects.count(), 2)


@skip("I don't want to start redis-server and celery worker now")
class EventRunAPIAPITestCase(APITestCase):
    """
    Class for testing run of events
    Don't Forget to start celery and redis
    """

    def setUp(self):
        self.username = "test_usr"
        self.email = "test_email"
        self.password = "test_password"
        self.user = User.objects.create_user(self.username, self.email, self.password)
        self.client.force_authenticate(user=self.user)

        self.profile = Profile.objects.get(user=self.user)

        self.car_name = "car_name"
        self.car_avail_seats = 4
        self.car = Car.objects.create(name=self.car_name, tot_avail_seats=self.car_avail_seats, owner=self.profile)

        self.name = "evento_simpaitco"
        self.description = "description"
        self.address = "qui"
        self.owner = Profile.objects.get(user=self.user)

        self.event = Event.objects.create(name=self.name, description=self.description, address=self.address,
                                          owner=self.owner)
        self.participant = Participant.objects.create(profile=self.profile, event=self.event, car=self.car,
                                                      starting_address=self.address)

    def test_successful_run(self):
        url = reverse('api:run-list', kwargs={'event_pk': self.event.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 202)
        event = Event.objects.get(id=self.event.id)
        self.assertEqual(event.status, Event.EventStatusChoices.COMPUTING)

    def test_run_unexisting_event(self):
        url = reverse('api:run-list', kwargs={'event_pk': 5})
        with self.assertRaises(Event.DoesNotExist):
            self.client.get(url)

    def test_run_event_of_other_user(self):
        url = reverse('api:run-list', kwargs={'event_pk': self.event.pk})

        new_user = User.objects.create(username="new_user", password="new_password")
        new_profile = Profile.objects.get(user=new_user)

        self.event.owner = new_profile
        self.event.save()

        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)

    def test_run_event_without_enough_cars(self):
        url = reverse('api:run-list', kwargs={'event_pk': self.event.pk})
        self.participant.car = None
        self.participant.save()

        response = self.client.get(url)

        self.assertEqual(response.status_code, 412)


class ParticipantViewSetAPITestCase(APITestCase):
    """
    Class for testing get, post, put and delete of partecipants of an event
    """

    def setUp(self):
        self.username = "test_usr"
        self.email = "test_email"
        self.password = "test_password"
        self.user = User.objects.create_user(self.username, self.email, self.password)
        self.client.force_authenticate(user=self.user)
        self.profile = Profile.objects.get(user=self.user)

        self.car_name = "car_name"
        self.car_avail_seats = 4
        self.car = Car.objects.create(name=self.car_name, tot_avail_seats=self.car_avail_seats, owner=self.profile)

        self.name = "evento_simpaitco"
        self.description = "description"
        self.address = "qui"
        self.owner = Profile.objects.get(user=self.user)
        self.destionation = "SRID=4326;POINT (44.6291598 10.9744844)"
        self.event = Event.objects.create(name=self.name, description=self.description, address=self.address,
                                          destination=self.destionation,
                                          owner=self.owner)

        self.second_user = User.objects.create_user("second_username", password="second_pass")

        self.starting_pos = "SRID=4326;POINT (44.6291598 10.9744844)"
        self.participant = Participant.objects.create(profile=Profile.objects.get(user=self.second_user),
                                                      event=self.event,
                                                      starting_address=self.address,
                                                      starting_pos=self.starting_pos)

    def test_get_participants(self):
        url = reverse("api:participants-list", kwargs={'event_pk': self.event.pk})
        response = self.client.get(url)
        self.assertEqual(len(response.data), 1)

    def test_get_participant(self):
        url = reverse("api:participants-detail", kwargs={'event_pk': self.event.pk, 'pk': self.participant.pk})

        response = self.client.get(url)
        self.assertEqual(response.status_code, 405)

    def test_post_participant(self):
        url = reverse("api:participants-list", kwargs={'event_pk': self.event.pk})

        data = {'starting_address': self.address, 'starting_pos': self.starting_pos, 'car': None}
        response = self.client.post(url, json.dumps(data), content_type="application/json")
        self.assertEqual(response.status_code, 201, msg=response.json())

    def test_post_participant_without_required_param(self):
        url = reverse("api:participants-list", kwargs={'event_pk': self.event.pk})

        data = {'starting_address': self.address}
        response = self.client.post(url, json.dumps(data), content_type="application/json")
        self.assertEqual(response.status_code, 400)

    def test_put_participant_not_owner(self):
        url = reverse("api:participants-detail", kwargs={'event_pk': self.event.pk, 'pk': self.participant.pk})
        data = {'starting_address': self.address + "_edited", 'car': None}
        response = self.client.put(url, data=json.dumps(data), content_type="application/json")
        self.participant.refresh_from_db()
        self.assertEqual(self.participant.starting_address, self.address)
        self.assertEqual(response.status_code, 400)

    def test_put_participant(self):
        cur_participant = Participant.objects.create(profile=self.profile, event=self.event,
                                                     starting_pos=self.starting_pos,
                                                     starting_address=self.address)

        data = {'starting_address': self.address + "_edited", 'starting_pos': "SRID=4326;POINT (44.5786321 10.4569878)",
                'car': None}
        url = reverse("api:participants-detail", kwargs={'event_pk': self.event.pk, 'pk': cur_participant.pk})
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200, msg=response.json())
        self.assertEqual(response.data["starting_address"], self.address + "_edited")

    def test_delete_participant_not_self(self):
        url = reverse("api:participants-detail", kwargs={'event_pk': self.event.pk, 'pk': self.participant.pk})
        response = self.client.delete(url)
        self.event.refresh_from_db()
        self.assertEqual(self.event.participant_count(), 1)
        self.assertEqual(response.status_code, 403)

    def test_delete_participant(self):
        cur_participant = Participant.objects.create(profile=self.profile, event=self.event,
                                                     starting_pos=self.starting_pos,
                                                     starting_address=self.address)
        url = reverse("api:participants-detail", kwargs={'event_pk': self.event.pk, 'pk': cur_participant.pk})
        response = self.client.delete(url)
        self.event.refresh_from_db()
        self.assertEqual(response.status_code, 204)
        self.assertEqual(self.event.participant_count(), 1)


class CurrentProfileViewSetAPITestCase(APITestCase):
    """
    Class for testing get and put of current profile info
    """
    url = reverse("api:cur-prof")

    def setUp(self):
        self.username = "test_usr"
        self.email = "test_email"
        self.password = "test_password"
        self.user = User.objects.create_user(self.username, self.email, self.password)
        self.client.force_authenticate(user=self.user)
        self.profile = Profile.objects.get(user=self.user)

    # get
    def test_get_current_profile(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], self.profile.id)

    # put
    def test_put_current_profile(self):
        data = {'picture': open(
            os.path.join(os.path.join(os.path.dirname(__file__), os.pardir), 'media', 'default-profile.jpg'), 'rb')}
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["id"], self.profile.id)

    def test_illegal_methods(self):
        data = {'random_data': "should not care"}

        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 405)


class CreateNewUserViewAPITestCase(APITestCase):
    """
    Class for testing creation of new users
    """
    url = reverse("api:signup")

    def setUp(self):
        self.username = "test_usr"
        self.email = "testf@mail.com"
        self.password = "test_password"

    def create_user_and_auth(self):
        user = User.objects.create_user(username=self.username, password=self.password, email=self.email)
        self.client.force_authenticate(user=user)
        return user

        # post put delete

    def test_illegal_methods(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)

    def test_post_user(self):
        data = {"username": self.username, "password": self.password, "email": self.email}
        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["username"], self.username)
        self.assertNotIn("password", response.data)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(Profile.objects.count(), 1)

    def test_post_user_missing_params(self):
        data = {"password": self.password, "email": self.email}
        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(Profile.objects.count(), 0)

        data = {"username": self.username, "email": self.email}
        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(Profile.objects.count(), 0)

        data = {"username": self.username, "email": self.email}
        response = self.client.post(self.url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(Profile.objects.count(), 0)

    def test_put_user(self):
        user = self.create_user_and_auth()
        data = {"email": "nuovaemail@mail.com"}
        response = self.client.put(self.url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["email"], "nuovaemail@mail.com")
        self.assertEqual(User.objects.get(id=user.id).email, "nuovaemail@mail.com")

    def test_delete_user(self):
        user = self.create_user_and_auth()
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(Profile.objects.count(), 0)


class ProfileViewSetApiTestCase(APITestCase):
    """
    Class for testing profile data
    """

    def setUp(self):
        self.username = "test_usr"
        self.email = "test_email"
        self.password = "test_password"
        self.user = User.objects.create_user(self.username, self.email, self.password)
        self.client.force_authenticate(user=self.user)
        self.profile = Profile.objects.get(user=self.user)

    def test_get_profile_data(self):
        url = reverse("api:profiles-detail", kwargs={'pk': self.profile.pk})

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertNotIn("notifications", response.data)
        self.assertEqual(self.profile.user.username, response.data["user"]["username"])

    def test_illegal_methods(self):
        data = {'fake': 'data'}
        data = json.dumps(data)

        url = reverse("api:profiles-detail", kwargs={'pk': self.profile.pk})
        response = self.client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 405)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, 405)


class CarViewSetAPITestCase(APITestCase):
    """
    Class for testing get, post, put and delete over car details
    """
    def setUp(self):
        self.username = "test_usr"
        self.email = "test_email"
        self.password = "test_password"
        self.user = User.objects.create_user(self.username, self.email, self.password)
        self.client.force_authenticate(user=self.user)
        self.profile = Profile.objects.get(user=self.user)

        self.car_name = "car_name"
        self.car_avail_seats = 4
        self.car = Car.objects.create(name=self.car_name, tot_avail_seats=self.car_avail_seats, owner=self.profile)

        self.other_username = "2nd_usr"
        self.other_email = "2nd_email"
        self.other_password = "2nd_password"
        self.other_user = User.objects.create_user(self.other_username, self.other_email, self.other_password)
        self.other_profile = Profile.objects.get(user=self.other_user)

        self.other_car_name = "car_name"
        self.other_car_avail_seats = 4
        self.other_car = Car.objects.create(name=self.other_car_name, tot_avail_seats=self.other_car_avail_seats,
                                            owner=self.other_profile)

    # post get(list) get(detail) put delete
    def test_post(self):
        url = reverse("api:cars-list", kwargs={'profile_pk': self.profile.pk})

        data = {'name': self.car_name, 'tot_avail_seats': self.car_avail_seats}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Car.objects.filter(owner=self.profile).count(), 2)

    def test_post_other_user(self):
        url = reverse("api:cars-list", kwargs={'profile_pk': self.other_profile.pk})

        data = {'name': self.car_name, 'tot_avail_seats': self.car_avail_seats}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_get_list(self):
        url = reverse("api:cars-list", kwargs={'profile_pk': self.profile.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_get_detail(self):
        url = reverse("api:cars-detail", kwargs={'profile_pk': self.profile.pk, 'pk': self.car.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.car.id, response.data["id"])

    def test_get_detail_non_existing_profile(self):
        url = reverse("api:cars-detail", kwargs={'profile_pk': 666, 'pk': self.car.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_get_detail_non_existing_car(self):
        url = reverse("api:cars-detail", kwargs={'profile_pk': self.profile.pk, 'pk': 666})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_put_detail(self):
        url = reverse("api:cars-detail", kwargs={'profile_pk': self.profile.pk, 'pk': self.car.pk})
        data = {'name': "new_name", "tot_avail_seats": 3}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.car.refresh_from_db()
        self.assertEqual(self.car.name, "new_name")
        self.assertEqual(self.car.tot_avail_seats, 3)
        self.assertEqual(self.profile.car_set.count(), 1)

    def test_put_other_user(self):
        url = reverse("api:cars-detail", kwargs={'profile_pk': self.other_profile.pk, 'pk': self.other_car.pk})
        data = {'name': 'new_name'}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_delete(self):
        url = reverse("api:cars-detail", kwargs={'profile_pk': self.profile.pk, 'pk': self.car.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Car.objects.filter(owner=self.profile).count(), 0)

    def test_delete_other_user(self):
        url = reverse("api:cars-detail", kwargs={'profile_pk': self.other_profile.pk, 'pk': self.other_car.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)


class FeedbackViewSetAPITestCase(APITestCase):
    """
    Class for testing get, post, put and delete for feedbacks
    """
    def setUp(self):
        self.username = "test_usr"
        self.email = "test_email"
        self.password = "test_password"
        self.user = User.objects.create_user(self.username, self.email, self.password)
        self.client.force_authenticate(user=self.user)
        self.profile = Profile.objects.get(user=self.user)

        self.car_name = "car_name"
        self.car_avail_seats = 4
        self.car = Car.objects.create(name=self.car_name, tot_avail_seats=self.car_avail_seats, owner=self.profile)

        self.other_username = "2nd_usr"
        self.other_email = "2nd_email"
        self.other_password = "2nd_password"
        self.other_user = User.objects.create_user(self.other_username, self.other_email, self.other_password)
        self.other_profile = Profile.objects.get(user=self.other_user)

        self.name = "event_name"
        self.description = "description"
        self.destination = "SRID=4326;POINT (44.6291598 10.9744844)"
        self.address = "addresss"
        self.event = Event.objects.create(name=self.name, description=self.description, address=self.address,
                                          destination=self.destination,
                                          owner=self.profile)

        self.starting_pos = "SRID=4326;POINT (44.6291598 10.9744844)"
        self.participant = Participant.objects.create(profile=self.profile,
                                                      event=self.event,
                                                      starting_address=self.address,
                                                      starting_pos=self.starting_pos,
                                                      car=self.car)
        self.other_participant = Participant.objects.create(profile=self.other_profile,
                                                            event=self.event,
                                                            starting_address=self.address,
                                                            starting_pos=self.starting_pos)

        self.other_participant.car = self.car
        self.other_participant.save()

    def test_post(self):
        url = reverse("api:feedback-list",
                      kwargs={'event_pk': self.event.id, 'participant_pk': self.other_profile.id})
        data = {'comment': "comment", 'vote': 4.1, 'receiver': self.other_profile.id, 'event': self.event.id}
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201, msg=response.json())
        self.assertEqual(Feedback.objects.count(), 1)
        self.assertEqual(Notification.objects.count(), 1)

    def test_put(self):
        feedback = Feedback.objects.create(giver=self.profile, receiver=self.other_profile, event=self.event,
                                           comment="comment", vote=4.1)

        url = reverse("api:feedback-detail", kwargs={'event_pk': self.event.id, 'participant_pk': self.other_profile.id,
                                                     'pk': feedback.id})

        data = {'comment': "comment_edited", 'vote': 4.1, 'receiver': self.other_profile.id, 'event': self.event.id}
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200, msg=response.json())
        feedback.refresh_from_db()
        self.assertEqual(feedback.comment, "comment_edited")

    def test_delete(self):
        feedback = Feedback.objects.create(giver=self.profile, receiver=self.other_profile, event=self.event,
                                           comment="comment", vote=4.1)

        url = reverse("api:feedback-detail", kwargs={'event_pk': self.event.pk, 'participant_pk': self.other_profile.pk,
                                                     'pk': feedback.id})

        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Feedback.objects.count(), 0)


class NotificationViewSetAPITestCase(APITestCase):
    """
    Class for testing get and put of notifications
    """
    def setUp(self):
        self.username = "test_usr"
        self.email = "test_email"
        self.password = "test_password"
        self.user = User.objects.create_user(self.username, self.email, self.password)
        self.client.force_authenticate(user=self.user)
        self.profile = Profile.objects.get(user=self.user)

        self.name = "event_name"
        self.description = "description"
        self.destination = "SRID=4326;POINT (44.6291598 10.9744844)"
        self.address = "addresss"
        self.event = Event.objects.create(name=self.name, description=self.description, address=self.address,
                                          destination=self.destination,
                                          owner=self.profile)

        self.notification = Notification.objects.create(profile=self.profile, title="test_notification",
                                                        content="test_content", related_event=self.event)

    def test_get_list(self):
        url = reverse("api:notifications")

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_put(self):
        url = reverse("api:notifications-update", kwargs={'pk': self.notification.pk})
        data = {"read": True}
        response = self.client.put(url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 200)

        self.notification.refresh_from_db()
        self.assertEqual(self.notification.read, True)
