from celery import shared_task
import logging
from SharedDrivers.models import Participant, Event, Car, Profile
from django.contrib.gis.db.models import Q
from django.contrib.gis.geos import Point
from geopy.distance import distance


# tobermoved
@shared_task()
def test_background_task():
    test = Algorithm(1)
    test.driver_selection()


class Algorithm():
    class Participant:
        def __init__(self, id, car, starting_pos):
            self.id = id
            self.car = car
            self.starting_pos = starting_pos
            self.pickup_index = -1
            self.expense = 0
            self.score = 0

        def save(self):
            real_participant = Participant.objects.get(self.id)
            real_participant.car = self.car.id
            real_participant.pickup_index = self.pickup_index
            real_participant.expense = self.expense
            real_participant.save()

    def get_data(self):
        return [self.Participant(participant.id, participant.car_id, participant.starting_pos) for participant in
                Participant.objects.filter(event_id=self.event_id)]

    def __init__(self, event_id):
        self.event_id = event_id
        self.destination = Event.objects.get(id=event_id).destination
        self.participant_groups = [self.get_data() for i in range(0, 3)]
        self.groups_score = [0] * 3

        logging.info(
            "Algorithm.__init__  event_id: {}  destination: {}  participant_groups: {}  groups_score: {}".format(
                event_id, self.destination, self.participant_groups, self.groups_score))

    def get_drivers(self, data):
        drivers = []
        logging.info("get_drivers - data:{}".format(data))
        for participant in data:
            if participant.car is not None:
                drivers.append(participant)
        return drivers

    def get_passengers(self, data):
        drivers = []
        for participant in data:
            if participant.car is None:
                drivers.append(participant)
        return drivers

    def set_drivers_passengers_distance_score(self, data):
        drivers = self.get_drivers(data)
        passengers = self.get_passengers(data)
        drivers_score = [[driver, 0] for driver in drivers]
        for driver_score in drivers_score:
            for passenger in passengers:
                driver_score[1] += distance(passenger.starting_pos, driver_score[0].starting_pos).kilometers

        scores = [score[1] for score in drivers_score]

        max_ = max(scores)
        min_ = min(scores)

        if max_ != 0:
            for driver, score in drivers_score:
                driver.score += (score - min_) / max_

    def set_drivers_destination_distance_score(self, data):
        drivers = self.get_drivers(data)
        drivers_score = [[driver, 0] for driver in drivers]
        for driver_score in drivers_score:
            driver_score[1] = distance(driver_score[0].starting_pos, self.destination).kilometers

        scores = [score[1] for score in drivers_score]

        max_ = max(scores)
        min_ = min(scores)

        if max_ != 0:
            for driver, score in drivers_score:
                driver.score += (score - min_) / max_

    def set_enviromental_impact_score(self, data):
        drivers = self.get_drivers(data)
        drivers_score = [[driver, 0] for driver in drivers]

        for driver_score in drivers_score:
            car_fuel = Car.objects.get(id=driver_score[0].car).fuel
            if car_fuel == 1:
                driver_score[1] = 0.5
            elif car_fuel == 2:
                driver_score[1] = 0.2
            elif car_fuel == 3:
                driver_score[1] = 0.7
            elif car_fuel == 4:
                driver_score[1] = 10
            else:
                driver_score[1] = 0.1

        scores = [score[1] for score in drivers_score]

        max_ = max(scores)
        min_ = min(scores)

        if max_ != 0:
            for driver, score in drivers_score:
                driver.score += (score - min_) / max_

    def set_habit_data(self, data):
        drivers = self.get_drivers(data)
        drivers_score = [[driver, 0] for driver in drivers]
        for driver_score in drivers_score:
            user = Participant.objects.get(id=driver_score[0].id).user
            habit = Profile.objects.get(user=user).score
            driver_score[1] += habit

        scores = [score[1] for score in drivers_score]

        max_ = max(scores)
        min_ = min(scores)

        if max_ != 0:
            for driver, score in drivers_score:
                driver.score += (score - min_) / max_

    def set_number_of_seats_score(self, data):
        drivers = self.get_drivers(data)
        drivers_score = [[driver, 0] for driver in drivers]
        for driver_score in drivers_score:
            driver_score[1] = Car.objects.get(id=driver_score[0].car).tot_avail_seats

        scores = [score[1] for score in drivers_score]

        max_ = max(scores)
        min_ = min(scores)

        if max_ != 0:
            for driver, score in drivers_score:
                driver.score += (score - min_) / max_

    def pick_participants(self, data):
        n_of_participants = len(data)
        for participant in data:
            if participant.car is not None:
                if n_of_participants > 0:
                    n_of_participants = n_of_participants - Car.objects.get(id=participant.car).tot_avail_seats
                else:
                    participant.car = None

    def first_group(self):
        data = self.participant_groups[0]
        self.set_drivers_passengers_distance_score(data)
        self.set_drivers_destination_distance_score(data)
        self.set_enviromental_impact_score(data)
        self.set_habit_data(data)
        self.set_number_of_seats_score(data)
        data.sort(key=lambda x: x.score, reverse=True)

        self.pick_participants(data)

    def second_and_third_group(self):
        data_1 = self.participant_groups[1]
        data_2 = self.participant_groups[2]

        drivers = self.get_drivers(data_1)
        drivers_score = [[driver, 0] for driver in drivers]
        for driver_score in drivers_score:
            for driver in drivers:
                driver_score[1] += distance(driver_score[0].starting_pos, driver.starting_pos).kilometers

        scores = [score[1] for score in drivers_score]

        max_ = max(scores)

        for i in range(0, len(drivers_score)):
            data_1[i].score = drivers_score[i][1] / max_ * 5
            data_2[i].score = 5 - data_1[i].score
            data_1[i].score += self.participant_groups[0][i].score
            data_2[i].score += self.participant_groups[0][i].score

        self.pick_participants(data_1)
        self.pick_participants(data_2)

    def driver_selection(self):
        self.first_group()
        self.second_and_third_group()