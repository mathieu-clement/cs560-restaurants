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

    def test_violations_parsed_and_without_duplicates(self):
        date = datetime.date(2016, 5, 3)
        # do not rely on sorting
        inspection = list(filter(
            lambda ins: ins.date == date, self.kitchen.inspections))[0]
        violations = [
            ('High Risk', 'High risk vermin infestation'),
            ('Low Risk', 'No thermometers or uncalibrated thermometers'),
            ('Low Risk', 'Unapproved or unmaintained equipment or utensils'),
            ('High Risk', 'High risk food holding temperature') # duplicated in dataset
        ]
        self.assertEqual(len(inspection.violations), len(violations))
        for v in violations:
            # do not rely on ordering
            matches = list(filter(lambda i: i.description == v[1], inspection.violations))
            self.assertEqual(len(matches), 1)
            actual = matches[0]
            self.assertEqual(actual.risk, v[0])

    def test_violations_sorted_and_eq(self):
        date = datetime.date(2016, 5, 3)
        # do not rely on sorting of inspections
        inspection = list(filter(
            lambda ins: ins.date == date, self.kitchen.inspections))[0]
        # High risk should come last, otherwise use alphabetical order
        violations = [
            ('Low Risk', 'No thermometers or uncalibrated thermometers'),
            ('Low Risk', 'Unapproved or unmaintained equipment or utensils'),
            ('High Risk', 'High risk food holding temperature'), # duplicated in dataset
            ('High Risk', 'High risk vermin infestation'),
        ]
        for i, v in enumerate(violations):
            self.assertEqual(inspection.violations[i], Violation(v[1], v[0]))


if __name__ == '__main__':
    unittest.main()
