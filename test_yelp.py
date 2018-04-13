#!/usr/bin/env python3

import unittest
from yelp import YelpClient, BusinessNotFoundException

class TestYelpClient(unittest.TestCase):

    def test_ks_kitchen(self):
        data = YelpClient().search_business("K's Kitchen", '757 Monterey Blvd', '94127')

        self.assertEqual(data['name'], "K's Kitchen")
        self.assertEqual(data['phone'], '+14153338500')
        self.assertEqual(data['location']['address1'], '757 Monterey Blvd')
        self.assertEqual(data['location']['zip_code'], '94127')
        self.assertEqual(data['price'], '$$')
        self.assertTrue(data['rating'] >= 1.0 and data['rating'] <= 5.0)

        categories = list(map(lambda c: c['title'], data['categories']))
        self.assertTrue('Japanese' in categories)
        self.assertTrue('Sushi Bars' in categories)

    def test_not_found(self):
        with self.assertRaises(BusinessNotFoundException) as context:
            YelpClient().search_business('asdfaosdifja', 'asdfasdfj', '94112')

if __name__ == '__main__':
    unittest.main()
