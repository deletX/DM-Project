import copy
import datetime
import logging
import random
import sys
import time
from collections import OrderedDict

import numpy as np
from celery import shared_task
from geopy.distance import distance

from .models import Participant, Event, Car, Profile


@shared_task
def mock_algorithm_task(event_id):
    algorithm = Algorithm(event_id)
    algorithm.mock_drivers_manager_algorithm()


@shared_task
def algorithm_task(event_id):
    algorithm = Algorithm(event_id)
    algorithm.drivers_manager_algorithm()


class Algorithm:
    """
    Class to compute routes and costs for picking up all the partecipants sharing the same car
    """

    class Participant:
        def __init__(self, id, car, starting_pos):
            self.id = id
            self.car = car
            self.starting_pos = starting_pos
            self.pickup_index = -1
            self.expense = 0
            self.score = 0
            if car:
                self.remaining_seats = Car.objects.get(id=self.car).tot_avail_seats
            else:
                self.remaining_seats = 0
            self.picked_passengers = []
            # self.is_passenger = False

        def save(self):
            real_participant = Participant.objects.get(id=self.id)
            real_participant.car = Car.objects.get(id=self.car)
            real_participant.pickup_index = self.pickup_index
            real_participant.expense = self.expense
            real_participant.save()

        def __str__(self):
            return "Participant({}), car: {}, pickup index: {}, expense: {}".format(self.id, self.car,
                                                                                    self.pickup_index, self.expense)

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
        return "event_id: {}  destination: {}  participant_groups: {}  groups_score: {}".format(self.event_id,
                                                                                                self.destination,
                                                                                                self.participant_groups,
                                                                                                self.groups_score)

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
            profile = Participant.objects.get(id=driver_score[0].id).profile
            habit = Profile.objects.get(id=profile.id).score
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

        # a tutti i partecipanti metto lo score = all'id così sono tutti diversi, mentre l'expense dipende dalla
        # macchina così sarà uguale per ogni macchina ma diverso tra le macchine inizializzo i guidatori con
        # pickup_index a 0

        for participant in self.participant_groups[0]:
            participant.score = participant.id
            if participant.car is not None:
                participant.pickup_index = 0
                consumption = Car.objects.get(id=participant.car).consumption
                participant.expense = consumption * 4.2

        # scorrendo i guidatori metto riempio le macchine rispettando la disponibilità di posti, i passeggeri sono
        # presi in ordine (il primo guidatore avrà i primi passeggeri fino ad esaurimento posti, il secondo avrà i
        # successivi e così via)

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

        # metto score diversi in ogni gruppo
        # metto i dati come servono
        # salvo un gruppo
        # expense uguali per ogni macchina ma diversi tra loro

        pass

    def get_time_cost(self, pos1, pos2):
        return 1

    # when attractiveness is calculated between a driver and a passenger (or the destination), part1 is the driver and part2 is the index of passenger in passengers
    # when it is calculated between two passengers (or destination), part1 and part2 are both indexes
    def get_attractiveness(self, part1, part2, destination_index, distance_passengers_matrix, first_is_driver):
        inverted_att = 0
        if first_is_driver:
            if part2 == destination_index:
                inverted_att = 2 * part1.distance_array[destination_index]
            else:
                inverted_att = part1.distance_array[part2] + distance_passengers_matrix[part2, destination_index] + (
                        distance_passengers_matrix[part2, destination_index] - part1.distance_array[destination_index])
        else:
            if part2 == destination_index:
                inverted_att = 2 * distance_passengers_matrix[part1, destination_index]
            else:
                inverted_att = distance_passengers_matrix[part1, part2] + distance_passengers_matrix[
                    part2, destination_index] + (distance_passengers_matrix[part2, destination_index] -
                                                 distance_passengers_matrix[part1, destination_index])
        return 1 / inverted_att

    def get_cumulative_sum_from_dictionary(self, ordered_dict):
        cumulative_sum = []
        sum = 1
        prev = 0
        for value in ordered_dict.values():
            sum -= prev
            cumulative_sum.append(sum)
            prev = value
        return cumulative_sum

    def random_selection_in_cumulative_sum(self, cumulative_sum):
        if len(cumulative_sum) == 1:
            return 0
        r = random.uniform(0, 1)

        p = 1
        for counter, val in enumerate(cumulative_sum):
            if counter == 0:
                continue
            if val < r < p:
                return counter - 1
            p = val

    # modified
    def get_dict_element_key_from_index(self, dict_ind, ordered_dict):
        counter = 0
        last_key = 0
        for key, value in ordered_dict.items():
            if counter == dict_ind:
                return key
            counter += 1
            last_key = key
        return key

    # destination has to be added, modified
    def get_total_value(self, passengers, ph_array, att_array):
        total_value = 0
        # alpha and beta represents the relative importance of pheromone and attractiveness
        alpha, beta = 1, 1
        for index, passenger in enumerate(passengers):
            if passenger.pickup_index == -1:
                # if the passenger has already been taken it will not influence the value
                total_value += pow(ph_array[index], alpha) * \
                               pow(att_array[index], beta)
        # destination
        total_value += pow(ph_array[len(passengers)], alpha) * pow(att_array[len(passengers)], beta)
        return total_value

    def get_probability_dict_from_arrays(self, passengers, ph_array, att_array, total_value, destination_index):
        # the dictionary will have as key the index of passenger in passengers, and as value the probability of passenger
        probabilities_dict = {}
        alpha, beta = 1, 1
        for index, passenger in enumerate(passengers):
            passenger.probability = passenger.probability * (
                    pow(ph_array[index], alpha) * pow(att_array[index], beta) / total_value)
            if passenger.probability > 0:
                # probabilities_dict will contain each probability > 0
                probabilities_dict[index] = passenger.probability
        probabilities_dict[destination_index] = (
                    pow(ph_array[destination_index], alpha) * pow(att_array[destination_index], beta) / total_value)
        return probabilities_dict

    def get_driver_total_value(self, driver, passengers):
        # the total value is the denominator for the probability of the first passenger for each driver
        return self.get_total_value(passengers, driver.pheromone_array, driver.attractiveness_array)

    def get_passenger_total_value(self, starting_passenger_index, passengers, pheromone_passengers_matrix,
                                  attractiveness_passengers_matrix):
        # the total value is the denominator for the probability of the next passenger
        return self.get_total_value(
            passengers,
            pheromone_passengers_matrix[starting_passenger_index],
            attractiveness_passengers_matrix[starting_passenger_index]
        )

    def get_first_passenger_probability_dict(self, driver, passengers, destination_index):
        total_value = self.get_driver_total_value(driver, passengers)
        return self.get_probability_dict_from_arrays(passengers, driver.pheromone_array, driver.attractiveness_array,
                                                     total_value, destination_index)

    def get_passenger_to_passenger_probability_dict(self, passengers, starting_passenger_index, destination_index,
                                                    pheromone_passengers_matrix, attractiveness_passengers_matrix):
        total_value = self.get_passenger_total_value(
            starting_passenger_index,
            passengers,
            pheromone_passengers_matrix,
            attractiveness_passengers_matrix)
        pheromone_passenger_array = pheromone_passengers_matrix[starting_passenger_index]
        attractiveness_passenger_array = attractiveness_passengers_matrix[starting_passenger_index]
        return self.get_probability_dict_from_arrays(
            passengers,
            pheromone_passenger_array,
            attractiveness_passenger_array,
            total_value,
            destination_index)

    def get_travel_cost(self, total_km, driver, participants_number):
        # evaluate cost from car's fuel type and fuel consumption
        car = Car.objects.get(id=driver.car)
        fuel_type = car.fuel
        consumption = car.consumption

        fuel_cost = 1.5
        if fuel_type == 2:
            fuel_cost = 1.2
        if fuel_type == 3:
            fuel_cost = .8
        if fuel_type == 4:
            fuel_cost = .3

        cost = total_km * (consumption / 100 * fuel_cost) / participants_number
        return round(cost, 2)

    def initialize_passengers(self, passengers):
        for passenger in passengers:
            passenger.pheromone_array = None
            passenger.attractiveness_array = None
            passenger.distance_array = None
        return passengers

    def initialize_drivers(self, drivers, passengers, destination, distance_passengers_matrix):
        destination_index = len(passengers)
        for driver in drivers:
            driver.pickup_index = 0
            driver.remaining_seats -= 1
            # pheromone_array initialization
            driver.pheromone_array = np.ones(shape=(len(passengers) + 1), dtype=float)

            # attractiveness_array initialization
            driver.attractiveness_array = np.zeros(shape=(len(passengers) + 1), dtype=float)

            # distance_array initialization
            driver.distance_array = np.ones(shape=(len(passengers) + 1), dtype=float)
            for counter, passenger in enumerate(passengers):
                driver.distance_array[counter] = distance(driver.starting_pos, passenger.starting_pos).kilometers
            driver.distance_array[destination_index] = distance(driver.starting_pos, destination).kilometers

            for counter, passenger in enumerate(passengers):
                driver.attractiveness_array[counter] = self.get_attractiveness(driver, counter, destination_index,
                                                                               distance_passengers_matrix, True)
            driver.attractiveness_array[destination_index] = self.get_attractiveness(driver, destination_index,
                                                                                     destination_index,
                                                                                     distance_passengers_matrix, True)

        return drivers

    def roulette_wheel(self, probabilities_dict):
        # the dictionary will have as key the index of passenger in passengers, and as value the probability of passenger
        # roulette wheel, check ACO implementation - from probabilities_dict to the chosen index
        # The dictionary will be ordered by value, in order to have the highest probabilities first
        probabilities_dict = OrderedDict(sorted(probabilities_dict.items(), key=lambda t: t[1], reverse=True))
        # cumulative_sum will contain values from 1 to the minimum probability contained in probabilities_dict
        # cumulative_sum[i] is associated to probabilities_dict[i]
        cumulative_sum = self.get_cumulative_sum_from_dictionary(probabilities_dict)
        # values in cumulative_sum will define the range of probabilities
        ind = self.random_selection_in_cumulative_sum(cumulative_sum)
        # now ind is the position in the ordered dictionary corresponding to the right probability
        # in order to obtain the passenger, we select the probability from the dictionary
        return self.get_dict_element_key_from_index(ind, probabilities_dict)

    # index is appended instead of id modified
    def driver_picks_passenger(self, driver, passengers, passenger_index):
        tot_avail_seats = Car.objects.get(id=driver.car).tot_avail_seats
        # pickup index i determined from the available seats and the remaining seats
        for index, passenger in enumerate(passengers):
            if index == passenger_index:
                passenger.pickup_index = tot_avail_seats - driver.remaining_seats
                passenger.probability = 0
                passenger.car = driver.car
                driver.picked_passengers.append(index)
                driver.remaining_seats -= 1
                return

    # use this at the beginning of every iteration: to empty the cars, and set the passengers pickup_index
    # se to zero the calculated costs
    def clear(self, passengers, drivers):
        for passenger in passengers:
            passenger.pickup_index = -1
            passenger.car = None
        for driver in drivers:
            tot_avail_seats = Car.objects.get(id=driver.car).tot_avail_seats
            driver.remaining_seats = tot_avail_seats - 1
            driver.picked_passengers = []

    # modified
    def evaluate_objective_function(self, passengers, drivers, distance_passengers_matrix):
        destination_index = len(passengers)
        # evaluate number of picked passengers
        matched_passengers = 0
        for passenger in passengers:
            if passenger.car is not None:
                matched_passengers += 1
        matched_passengers_max_value = len(passengers)
        # the same value can be calculated from driver.picked_passengers, driver.remaining_seats

        # seat usage rate
        seat_usage_rate = 0
        total_available_seats = 0
        for driver in drivers:
            tot_avail_seats = Car.objects.get(id=driver.car).tot_avail_seats
            seat_usage_rate = seat_usage_rate + ((tot_avail_seats - driver.remaining_seats) / tot_avail_seats)
            total_available_seats += tot_avail_seats
        seat_usage_rate_max_value = (len(drivers) + len(passengers)) / total_available_seats

        # distance cost
        # distance cost - successfully served person per kilometers

        # sum of the distance from destination of every driver
        drivers_destination_distance_sum = 0
        served_participants_number_max_value = len(drivers) + len(passengers)
        for driver in drivers:
            drivers_destination_distance_sum += driver.distance_array[destination_index]
        # for row in range(len(passengers) + 1):
        #    destination_distance_sum += distance_passengers_matrix[row][destination_index]
        persons_per_kilometers_max_value = served_participants_number_max_value / drivers_destination_distance_sum

        # real trip distance sum is the total length of all the paths that drivers do
        real_trip_distance_sum = 0
        served_participants_number = len(drivers) + matched_passengers
        for driver in drivers:
            if len(driver.picked_passengers) == 0:
                real_trip_distance_sum += driver.distance_array[destination_index]
                continue
            for index, p_p in enumerate(driver.picked_passengers):
                if index == 0:
                    real_trip_distance_sum += driver.distance_array[driver.picked_passengers[index]]
                else:
                    real_trip_distance_sum += distance_passengers_matrix[driver.picked_passengers[index - 1]][p_p]
        persons_per_kilometers = served_participants_number / real_trip_distance_sum

        # normalizing
        norm_matched_passengers = matched_passengers / matched_passengers_max_value
        norm_seat_usage_rate = seat_usage_rate / seat_usage_rate_max_value
        norm_persons_per_kilometers = persons_per_kilometers / persons_per_kilometers_max_value
        return matched_passengers + seat_usage_rate + norm_persons_per_kilometers

    # modified picked_passengers is now controlled, removed -1 checking, evaporation has to be reduced
    def update_pheromone_values(self, objective_function_value, pheromone_passengers_matrix, drivers,
                                destination_index):
        # depending on the value of the objective function, the updating trail delta is calculated
        # Q is the learning rate
        q = 1
        delta_tau = 1 - (q / objective_function_value)
        # update pheromone structures
        # each value in the matrix will evaporate
        # rho is the deposition rate, while eva_rho is the pheromone evaporation
        rho = 0.9
        eva_rho = 0.999
        pheromone_passengers_matrix = pheromone_passengers_matrix * eva_rho
        # pheromone arrays will evaporate, while each path that has been followed will be reinforced
        for driver in drivers:
            # each value in the arrays will evaporate
            driver.pheromone_array = driver.pheromone_array * eva_rho
            # each path selected is reinforced
            if len(driver.picked_passengers) == 0:
                driver.pheromone_array[destination_index] += (rho * delta_tau)
                # test
                # driver.pheromone_array /= np.amax(driver.pheromone_array)
                continue
            # the first path for each driver is reinforced

            for index in range(len(driver.picked_passengers) + 1):
                if index == 0:
                    driver.pheromone_array[driver.picked_passengers[0]] += (rho * delta_tau)
                    # test
                    # driver.pheromone_array /= np.amax(driver.pheromone_array)
                    continue
                # if destination is reached
                if index == len(driver.picked_passengers):
                    pheromone_passengers_matrix[driver.picked_passengers[index - 1]][destination_index] += (
                                rho * delta_tau)
                    break
                pheromone_passengers_matrix[driver.picked_passengers[index - 1]][driver.picked_passengers[index]] += (
                        rho * delta_tau)
                # pheromone_passengers_matrix[driver.picked_passengers[index]][driver.picked_passengers[index - 1]] = \
                # pheromone_passengers_matrix[driver.picked_passengers[index - 1]][driver.picked_passengers[index]]
        # test
        # pheromone_passengers_matrix /= np.amax(pheromone_passengers_matrix)
        return pheromone_passengers_matrix

    def set_pheromone_passengers_matrix(self, rows, cols):
        pheromone_passengers_matrix = np.ones(shape=(rows, cols), dtype=float)
        return pheromone_passengers_matrix

    # indexes modified and last column check added
    def set_attractiveness_passengers_matrix(self, passengers, rows, cols, distance_passengers_matrix):
        attractiveness_passengers_matrix = np.zeros(shape=(rows, cols), dtype=float)
        destination_index = len(passengers)
        for r in range(rows):
            for c in range(cols):
                if r == c:
                    pass
                else:
                    # attractiveness with dest
                    if c == cols - 1:
                        attractiveness_passengers_matrix[r][c] = self.get_attractiveness(r, destination_index,
                                                                                         destination_index,
                                                                                         distance_passengers_matrix,
                                                                                         False)
                    else:
                        attractiveness_passengers_matrix[r][c] = self.get_attractiveness(r, c, destination_index,
                                                                                         distance_passengers_matrix,
                                                                                         False)
        return attractiveness_passengers_matrix

    def set_time_passengers_matrix(self, passengers, rows, cols):
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
        return time_passengers_matrix

    # added modified
    def set_distance_passengers_matrix(self, passengers, rows, cols, destination):
        distance_passengers_matrix = np.zeros(shape=(rows, cols), dtype=float)
        for r in range(rows):
            for c in range(cols):
                if r == c:
                    pass
                else:
                    if r > c:
                        pass
                    else:
                        if c == cols - 1:
                            distance_passengers_matrix[r][c] = distance(passengers[r].starting_pos,
                                                                        destination).kilometers
                        else:
                            distance_passengers_matrix[r][c] = distance(passengers[r].starting_pos,
                                                                        passengers[c].starting_pos).kilometers
                            distance_passengers_matrix[c][r] = distance_passengers_matrix[r][c]
        return distance_passengers_matrix

    def set_probability_passengers(self, passengers):
        # this will set to 0 the probability of taken passengers, to 1 the probability of non-taken passengers
        # to be called at the beginning of each ACO decision
        for passenger in passengers:
            if passenger.pickup_index != -1:
                passenger.probability = 0
            if passenger.pickup_index == -1:
                passenger.probability = 1
        return

    def APCA(self, participant_group):
        drivers = []
        passengers = []
        destination = self.destination

        drivers = self.get_drivers(participant_group)
        passengers = self.get_passengers(participant_group)

        # Initialization phase
        passengers = self.initialize_passengers(passengers)

        rows = len(passengers)
        cols = rows + 1
        destination_index = len(passengers)

        distance_passengers_matrix = self.set_distance_passengers_matrix(passengers, rows, cols, destination)

        drivers = self.initialize_drivers(drivers, passengers, destination, distance_passengers_matrix)

        rows = len(passengers)
        cols = rows + 1
        destination_index = len(passengers)

        # pheromone matrix
        pheromone_passengers_matrix = self.set_pheromone_passengers_matrix(rows, cols)

        # distance matrix
        distance_passengers_matrix = self.set_distance_passengers_matrix(passengers, rows, cols, destination)

        # attractiveness matrix
        attractiveness_passengers_matrix = self.set_attractiveness_passengers_matrix(passengers, rows, cols,
                                                                                     distance_passengers_matrix)
        # time matrix
        # time_passengers_matrix = set_time_passengers_matrix(passengers, rows, cols)

        # end initialization

        # begin iteration
        solution_changes = 0
        selected_iteration = 0
        selected_drivers_solution = copy.deepcopy(drivers)
        selected_passengers_solution = copy.deepcopy(passengers)
        selected_objective_function_value = 0

        for iteration in range(1000):

            random.shuffle(drivers)
            for driver in drivers:
                # calculate probabilities for the first passenger
                # there will be a number of probabilities equal to the number of passengers.
                self.set_probability_passengers(passengers)
                # a dictionary will keep the value of the probability associated to the index of the passenger in
                # passengers
                probabilities_dict = self.get_first_passenger_probability_dict(driver, passengers, destination_index)
                # roulette wheel, check ACO implementation - from probabilities_dict to the chosen index
                picked_index = self.roulette_wheel(probabilities_dict)
                # now picked_index contains the index of the passenger in passengers that has to be picked
                if picked_index == destination_index:
                    continue
                self.driver_picks_passenger(driver, passengers, picked_index)
                while driver.remaining_seats > 0 and picked_index != destination_index:
                    # the driver picked up the passenger in passengers that has index picked_index, so this will be
                    # the starting position for the next passengers
                    self.set_probability_passengers(passengers)
                    probabilities_dict = self.get_passenger_to_passenger_probability_dict(passengers, picked_index,
                                                                                          destination_index,
                                                                                          pheromone_passengers_matrix,
                                                                                          attractiveness_passengers_matrix)
                    picked_index = self.roulette_wheel(probabilities_dict)
                    # now picked_index contains the index of the passenger in passengers that has to be picked
                    if picked_index == destination_index:
                        # -1 is appended to picked_passengers in order to end the array
                        # driver.picked_passengers.append(-1)
                        break
                    self.driver_picks_passenger(driver, passengers, picked_index)

            # now passengers and drivers contain the solution of the problem: in each driver we have the list of
            # picked passengers and each passenger i assigned to a car we have to evaluate objective_function_value
            # objective function
            objective_function_value = self.evaluate_objective_function(passengers, drivers, distance_passengers_matrix)
            pheromone_passengers_matrix = self.update_pheromone_values(objective_function_value,
                                                                       pheromone_passengers_matrix, drivers,
                                                                       destination_index)
            # if the new solution is better than the best we ever found, we change the selected solution
            if objective_function_value > selected_objective_function_value:
                solution_changes += 1
                selected_iteration = iteration
                selected_objective_function_value = objective_function_value
                selected_drivers_solution = copy.deepcopy(drivers)
                selected_passengers_solution = copy.deepcopy(passengers)

            self.clear(passengers, drivers)

        logging.log(level=logging.INFO,
                    msg="Solution selected at iteration: {}. The solution has been changed {} times".format(
                        selected_iteration, solution_changes))
        # evaluate costs for passengers and drivers and update scores

        for driver in selected_drivers_solution:
            total_km = 0
            if len(driver.picked_passengers) == 0:
                total_km = driver.distance_array[destination_index]
                cost = self.get_travel_cost(total_km, driver, 1)
            else:
                driver.picked_passengers.append(destination_index)
                # distance with the first passenger
                total_km = driver.distance_array[driver.picked_passengers[0]]
                for index, pp in enumerate(driver.picked_passengers):
                    if index == 0:
                        continue
                    total_km += distance_passengers_matrix[driver.picked_passengers[index - 1], pp]
                driver.picked_passengers.pop()
                cost = self.get_travel_cost(total_km, driver, len(driver.picked_passengers) + 1)
            driver.expense = cost
            driver.score -= cost
            for pp in driver.picked_passengers:
                selected_passengers_solution[pp].expense = cost
                selected_passengers_solution[pp].score += cost
                selected_passengers_solution[pp].car = driver.car
        # solution is a tuple containing the solution information
        solution = (selected_objective_function_value, selected_drivers_solution + selected_passengers_solution)
        return solution

    def drivers_manager_algorithm(self):
        event = Event.objects.get(id=self.event_id)
        event.status = Event.EventStatusChoices.COMPUTING
        event.save()

        logging.info("Starting Driver Selection")
        self.driver_selection()
        # apca_solutions will contain the tuples of the APCA solutions.
        # tuple:= (objective_function_value, participants)
        apca_solutions = []
        # collecting solutions for each group
        logging.info("Found {} groups".format(len(self.participant_groups)))

        for i in range(len(self.participant_groups)):
            logging.info("running APCA for group #{}".format(i))
            apca_solutions.append(self.APCA(self.participant_groups[i]))

        # choosing the highest objective function value, the selected group
        sel = 0

        logging.info("Computing max objective function value")
        # first objective function value
        ofv = apca_solutions[0][0]
        for i in range(len(apca_solutions)):
            if apca_solutions[i][0] >= ofv:
                ofv = apca_solutions[i][0]
                sel = i
        logging.info("Max found: {}".format(ofv))

        # now sel[1] contains the participants of the selected group, with the right data

        logging.info("Saving participants")
        for participant in apca_solutions[sel][1]:
            participant.save()

        logging.info("Updating event status")
        event.status = Event.EventStatusChoices.COMPUTED
        event.save()

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
