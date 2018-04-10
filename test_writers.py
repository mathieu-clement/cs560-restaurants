#!/usr/bin/env python3

import json
from pathlib import Path
import tempfile
import unittest

from writers import YelpDataWriter

class YelpDataWriterTest(unittest.TestCase):

    def setUp(self):
        self.file = tempfile.NamedTemporaryFile(mode='w', encoding='utf8', delete=False)

    def tearDown(self):
        Path(self.file.name).unlink() # delete file

    def test_write_tiramisu(self):
        yelp_data = {
                'alias': 'ks-kitchen-san-francisco',
                'categories': [{'alias': 'japanese', 'title': 'Japanese'},
                               {'alias': 'sushi', 'title': 'Sushi Bars'}],
                'coordinates': {'latitude': 37.731489, 'longitude': -122.452381},
                'display_phone': '(415) 333-8500',
                'distance': 15.63020468703693,
                'id': 'S98G1Fcqo24kTZVuR643cg',
                'image_url': 'https://s3-media3.fl.yelpcdn.com/bphoto/8u0USLHrcp77hk9hkegyXg/o.jpg',
                'is_closed': False,
                'location': {'address1': '757 Monterey Blvd',
                             'address2': '',
                             'address3': '',
                             'city': 'San Francisco',
                             'country': 'US',
                             'display_address': ['757 Monterey Blvd',
                                                 'San Francisco, CA 94127'],
                             'state': 'CA',
                             'zip_code': '94127'},
                'name': "K's Kitchen",
                'phone': '+14153338500',
                'price': '$$',
                'rating': 4.0,
                'review_count': 384,
                'transactions': [],
                'url': 'https://www.yelp.com/biz/ks-kitchen-san-francisco?adjust_creative=bs0Nt1SUQSRjLm6j3N3CNA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=bs0Nt1SUQSRjLm6j3N3CNA'
             }

        with YelpDataWriter(self.file) as writer:
            writer.write('10', yelp_data)

        with open(self.file.name, 'r', encoding='utf8') as f:
            output_json = json.load(f) 
            expected_output = {'10': yelp_data}
            self.assertEqual(output_json, expected_output)


if __name__ == '__main__':
    unittest.main()
