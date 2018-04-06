#!/usr/bin/env python3

import unittest
from yelp import YelpClient

class TestYelpClient(unittest.TestCase):

    def test_ks_kitchen(self):
        data = YelpClient().search_business("K's kitchen", '757 Monterey Blvd', '94127')

        self.assertEqual(data['phone'], '+14153338500')
        self.assertEqual(data['location']['address1'], '757 Monterey Blvd')

        categories = list(map(lambda c: c['title'], data['categories']))
        self.assertTrue('Japanese' in categories)
        self.assertTrue('Sushi Bars' in categories)

if __name__ == '__main__':
    unittest.main()
