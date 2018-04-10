#!/usr/bin/env python3

from scores import *
from yelp import YelpClient

class ScoreYelpFetcher:

    def __init__(self, scores_filename):
        self.scores_reader = ScoresReader(scores_filename)
        self.yelp_client = YelpClient()

    def fetch(self, start_score_id, num_restaurants):
        """Reads num_restaurants restaurants from the inspection dataset
        starting from restaurant with ID start_score_id."""

        results = {}

        ids = self.scores_reader.get_ids(start_score_id, num_restaurants)
        print('Ids', ids)

        for business_id in ids:
            row = self.scores_reader.get_row(business_id)
            data = self.yelp_client.search_business(
                    row['name'],
                    row['address'],
                    row['zip_code'])
            results[business_id] = data

        return results


if __name__ == '__main__':
    fetcher = ScoreYelpFetcher('restaurant_scores.csv')
    from pprint import pprint
    pprint(fetcher.fetch(0, 2))

