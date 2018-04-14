#!/usr/bin/env python3

import unittest
from combine import *

class TestScoreYelpCombiner(unittest.TestCase):

    def setUp(self):
        self.combiner = ScoreYelpCombiner('restaurant_scores.csv')
        self.id = 0

    def make_yelp(self, name, street, distance):
        return {
            'name': name,
            'location': {'address1': street},
            'distance': distance
        }

    def make_restaurant(self, name, street):
        self.id += 1
        return Restaurant(self.id, name, street, '94117')

    def assert_match(self, name_y, name_r, street_y, street_r, distance_y=90):
        self.assertTrue(self.combiner.match(
            self.make_yelp(name_y, street_y, distance_y),
            self.make_restaurant(name_r, street_r)
            )
        )

    def test_match(self):
        self.assert_match('Chang Kitchen', "Chang's kitchen", 'GGB', 'GGB')
        self.assert_match('ABC', 'ABC', '033 Belair ave.', '33 Belair Avenue')
        self.assert_match('ABC', 'ABCDE', '4841 Masonic Avenue', '4841 Masonic ave.')
        self.assert_match('afjao', 'didididid', '123 Fulton St', '4281 3rd  Street', 3)


if __name__ == '__main__':
    unittest.main()

