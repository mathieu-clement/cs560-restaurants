#!/usr/bin/env python3

from scores import *
from yelp import YelpClient, BusinessNotFoundException

class YelpBunkFetcher:

    def __init__(self, scores_filename):
        self.scores_reader = ScoresReader(scores_filename)
        self.yelp_client = YelpClient()

    def fetch(self, start_score_id, num_restaurants):
        """Reads num_restaurants restaurants from the inspection dataset
        starting from restaurant with ID start_score_id."""

        results = {}

        ids = self.scores_reader.get_ids(start_score_id, num_restaurants)
        num_ids = len(ids)
        print('Number of restaurants to fetch:', num_ids) # total is 5407
        count = 1

        for business_id in ids:
            row = self.scores_reader.get_row(str(business_id))
            try:
                print('Fetching', count, '/', num_ids, '  id:', row['id'], 'name:', row['name'])
                count += 1
                data = self.yelp_client.search_business(
                        row['name'],
                        row['street'],
                        row['zip_code'])
                results[business_id] = data
            except BusinessNotFoundException as e:
                print("ID: ", business_id, e)

        return results

    def combine(self, results):
        restaurants =  self.scores_reader.get_restaurants_dict()

        for business_id, yelp_data in results.items():
            restaurant = restaurants[str(business_id)]
            search = {
                    'name': restaurant.name,
                    'street': restaurant.street,
                    'zip_code': restaurant.zip_code
                    }
            yelp_data['search'] = search
            
            inspections = []
            for insp in restaurant.inspections:
                violations = []
                for viol in insp.violations:
                    violations.append({
                        'description': viol.description,
                        'risk': viol.risk
                        })
                inspections.append({
                    'date': insp.date,
                    'score': insp.score,
                    'violations': violations
                    })
            yelp_data['inspections'] = inspections

        return results


if __name__ == '__main__':
    fetcher = YelpBunkFetcher('restaurant_scores.csv')
    from pprint import pprint
    fetched = fetcher.fetch(18767, 1000)
    pprint(fetched)

    from writers import YelpDataWriter
    with YelpDataWriter(open('yelp.json', 'w', encoding='utf8') )as writer:
        for business_id, data in fetched.items():
            writer.write(str(business_id), data)


