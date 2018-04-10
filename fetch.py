#!/usr/bin/env python3

from scores import *
from yelp import YelpClient

class ScoreYelpFetcher:

    def __init__(self, scores_filename):
        self.scores_reader = ScoresReader(filename)
        self.yelp_client = YelpClient()

    def fetch(self, start_score_id, num_restaurants):
        """Reads num_restaurants restaurants from the inspection dataset
        starting from restaurant with ID start_score_id."""

        ids = self.scores_reader.get_ids(start_score_id, num_restaurants)

        for business_id in ids:
            data = self.yelp_client.search_business(
                    row['business_name'],
                    row['business_address'],
                    row['business_postal_code'])
