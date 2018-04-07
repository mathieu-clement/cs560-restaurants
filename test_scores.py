#!/usr/bin/env python3

import datetime
import unittest

from yelp import YelpClient
from scores import *

class TestScoresReader(unittest.TestCase):

    def setUp(self):
        self.restaurants = ScoresReader('restaurant_scores.csv').get_restaurants()
        self.kitchen = list(filter(lambda r: r.id == '10', self.restaurants))[0]

    def test_restaurant_data(self):
        self.assertEqual(self.kitchen.name, 'Tiramisu Kitchen')
        self.assertEqual(self.kitchen.street, '033 Belden Pl')
        self.assertEqual(self.kitchen.zip_code, 94104)

    def test_inspection_count(self):
        self.assertEqual(len(self.kitchen.inspections), 3)

    def test_inspection_sorted_and_dates(self):
        self.assertEqual(sorted(self.kitchen.inspections), self.kitchen.inspections)
        expected_dates = (
                (2014, 1, 14),
                (2014, 7, 29),
                (2016, 5, 3)
        )

        for i, date in enumerate(expected_dates):
            self.assertEqual(self.kitchen.inspections[i].date, datetime.date(\
                    date[0], date[1], date[2]))

    def test_inspection_scores(self):
        scores = {
            datetime.date(2014, 1, 14): 92,
            datetime.date(2014, 7, 29): 94,
            datetime.date(2016, 5,  3): 82
        }

        for date, score in scores.items():
            # do not rely on sorting here
            inspection = list(filter(
                lambda ins: ins.date == date, self.kitchen.inspections))[0]
            self.assertEqual(inspection.score, score)


if __name__ == '__main__':
    unittest.main()
