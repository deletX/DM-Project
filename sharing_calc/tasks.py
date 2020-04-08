from itertools import count
from celery import shared_task
import logging
import datetime
import time
from SharedDrivers.models import Participant, Event, Car, Profile
from django.contrib.gis.db import models
from django.contrib.gis.db.models import Q
from django.contrib.gis.geos import Point
from geopy.distance import distance
import sys
import copy
import numpy as np


# tobermoved
@shared_task()
def test_background_task():
    test = Algorithm(1)
    test.driver_selection()


@shared_task
def mock_algorithm_task(event_id):
    event = Event.objects.get(id=event_id)
    # if event.status == Event.EventStatusChoices.JOINABLE:
    algorithm = Algorithm(event_id)
    algorithm.mock_drivers_manager_algorithm()


class Algorithm:
    class Participant:
        # APCA drivers data
        pheromone_array = []
        distance_array = []
        time_array = []

        def __init__(self, id, car, starting_pos):
            self.id = id
            self.car = car
            self.starting_pos = starting_pos
            self.pickup_index = -1
            self.expense = 0
            self.score = 0
            # self.is_passenger = False

        def save(self):
            real_participant = Participant.objects.get(id=self.id)
            real_participant.car = Car.objects.get(id=self.car)
            real_participant.pickup_index = self.pickup_index
            real_participant.expense = self.expense
            real_participant.save()

        def __str__(self):
            return "Participant({}), car:{}".format(self.id, self.car)

    def get_data(self):
        return [self.Participant(participant.id, participant.car_id, participant.starting_pos) for participant in
                Participant.objects.filter(event_id=self.event_id)]

    def __init__(self, event_id):
        self.event_id = event_id
        self.destination = Event.objects.get(id=event_id).destination
        self.participant_groups = [self.get_data() for i in range(0, 3)]  # [[p1,p2,...][p1,p2,...][p1,p2,...]]
        self.groups_score = [0] * 3

        # debug
        logging.info(
            "Algorithm.__init__  event_id: {}  destination: {}  participant_groups: {}  groups_score: {}".format(
                event_id, self.destination, self.participant_groups, self.groups_score))

    def __str__(self):
        return "event_id: {}  destination: {}  participant_groups: {}  groups_score: {}".format(
            self.event_id, self.destination, self.participant_groups, self.groups_score)

    def get_drivers(self, data):
        drivers = []
        # logging.info("get_drivers - data:{}".format(data))
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

    def get_time_cost(self, pos1, pos2):
        return 1

    def set_drivers_passengers_distance_score(self, data):

        drivers = self.get_drivers(data)
        passengers = self.get_passengers(data)

        drivers_score = [[driver, 0] for driver in drivers]

        for driver_score in drivers_score:
            for passenger in passengers:
                driver_score[1] += distance(passenger.starting_pos, driver_score[0].starting_pos).kilometers

        scores = [score[1] for score in drivers_score]

        max_ = max(scores) + sys.float_info.epsilon
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

        max_ = max(scores) + sys.float_info.epsilon
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
                driver.score += (score - min_) / (max_ + sys.float_info.epsilon)

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
                driver.score += (score - min_) / (max_ + sys.float_info.epsilon)

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
                driver.score += (score - min_) / (max_ + sys.float_info.epsilon)

    def pick_participants(self, data):

        n_of_participants = len(data)

        for participant in data:
            if participant.car is not None:
                if n_of_participants > 0:
                    car = Car.objects.get(id=participant.car)
                    n_of_participants = n_of_participants - car.tot_avail_seats

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
            data_1[i].score = drivers_score[i][1] / (max_ * 5 + sys.float_info.epsilon)
            data_2[i].score = 5 - data_1[i].score
            data_1[i].score += self.participant_groups[0][i].score
            data_2[i].score += self.participant_groups[0][i].score

        data_1.sort(key=lambda x: x.score, reverse=True)
        data_2.sort(key=lambda x: x.score, reverse=True)

        self.pick_participants(data_1)
        self.pick_participants(data_2)

    def driver_selection(self):
        self.first_group()
        self.second_and_third_group()

    def mock_APCA(self):

        time1 = datetime.datetime.now()

        drivers = self.get_drivers(self.participant_groups[0])

        # a tutti i partecipanti metto lo score = all'id così sono tutti diversi, mentre l'expense dipende dalla macchina così sarà uguale per ogni macchina ma diverso tra le macchine
        # inizializzo i guidatori con pickup_index a 0
        for participant in self.participant_groups[0]:
            participant.score = participant.id
            if participant.car is not None:
                participant.pickup_index = 0
                consumption = Car.objects.get(id=participant.car).consumption
                participant.expense = consumption * 4.2
        # scorrendo i guidatori metto riempio le macchine rispettando la disponibilità di posti, i passeggeri sono presi in ordine
        # (il primo guidatore avrà i primi passeggeri fino ad esaurimento posti, il secondo avrà i successivi e così via)
        for driver in drivers:
            tot_avail_seats = Car.objects.get(id=driver.car).tot_avail_seats
            for i in range(tot_avail_seats - 1):
                for participant in self.participant_groups[0]:
                    if participant.car is None:
                        participant.car = driver.car
                        participant.expense = driver.expense
                        participant.pickup_index = i + 1
                        break

        time2 = datetime.datetime.now()
        timedelta = time2 - time1
        if timedelta.seconds < 120:
            time.sleep(30 - timedelta.seconds)
        pass

    def APCA(self, participants):
        drivers = self.get_drivers(participants)
        passengers = self.get_passengers(participants)
        # Initialization phase
        rows = len(passengers)
        cols = rows + 1
        # pheromone arrays and pheromone matrix
        for passenger in passengers:
            passenger.pheromone_array = None
        for driver in drivers:
            driver.pheromone_array = np.ones(shape=(len(passengers) + 1), dtype=float)

        pheromone_passengers_matrix = np.ones(shape=(rows, cols), dtype=float)

        # distance arrays and distance matrix
        for passenger in passengers:
            passenger.distance_array = None
        for driver in drivers:
            driver.distance_array = np.zeros(shape=(len(passengers) + 1), dtype=float)
            for counter, passenger in enumerate(passengers):
                driver.distance_array[counter] = distance(driver.starting_pos, passenger.starting_pos)
            driver.distance_array[len(passengers) + 1] = distance(driver.starting_pos, self.destination)

        distance_passengers_matrix = np.zeros(shape=(rows, cols), dtype=float)
        for r in range(rows):
            for c in range(cols):
                if r == c:
                    pass
                else:
                    if r > c:
                        pass
                    else:
                        if r < c:
                            distance_passengers_matrix[r][c] = distance(passengers[r].starting_pos,
                                                                        passengers[c].starting_pos)
                            distance_passengers_matrix[c][r] = distance_passengers_matrix[r][c]

        # time arrays and time matrix
        for passenger in passengers:
            passenger.distance_array = None
        for driver in drivers:
            driver.time_array = np.ones(shape=(len(passengers) + 1), dtype=float)
        #            for counter, passenger in enumerate(passengers):
        #                driver.time_array[counter] = self.get_time_cost(driver.starting_pos, passenger.starting_pos)
        #            driver.distance_array[len(passengers) + 1] = self.get_time_cost(driver.starting_pos, self.destination)

        time_passengers_matrix = np.ones(shape=(rows, cols), dtype=float)

    #        for r in range(rows):
    #            for c in range(cols):
    #                if r == c:
    #                    pass
    #                else:
    #                    if r > c:
    #                        pass
    #                    else:
    #                        if r < c:
    #                            time_passengers_matrix[r][c] = self.get_time_cost(passengers[r].starting_pos,
    #                                                                              passengers[c].starting_pos)
    #                            time_passengers_matrix[c][r] = distance_passengers_matrix[r][c]

    # end initialization
    
    def drivers_manager_algorithm(self):
        self.driver_selection()
        self.APCA()

    def mock_drivers_manager_algorithm(self):
        event = Event.objects.get(id=self.event_id)
        event.status = Event.EventStatusChoices.COMPUTING
        event.save()

        logging.info("Starting Driver Selection")
        self.driver_selection()

        logging.info("Starting Mock APCA")
        self.mock_APCA()

        logging.info("Saving result into DB")
        for participant in self.participant_groups[0]:
            participant.save()

        event.status = Event.EventStatusChoices.COMPUTED
        event.save()
