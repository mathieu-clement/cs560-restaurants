#!/usr/bin/env python3

import json

from scores import Restaurant, Inspection, Violation
from yelp import YelpClient

class YelpDataWriter:
    """After data for restaurants has been fetched from Yelp,
    this writer will write that data to a JSON file on the disk."""

    def __init__(self, filename):
        self.__init__(open(filename, 'w', encoding='utf8'))

    def __init__(self, file):
        self.file = file
        # key is restaurant ID from health score dataset
        # value is JSON from Yelp
        self.businesses = {}

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.__write_file()
        self.file.close()

    def write(self, score_id, json):
        # run ./yelp.py to see sample output for argument json
        self.businesses[score_id] = json

    def __write_file(self):
        json.dump(self.businesses, self.file) # Beware, can be called only once per fp
