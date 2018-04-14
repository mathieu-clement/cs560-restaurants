#!/usr/bin/env python3

from scores import *

class ScoreYelpCombiner:

    def __init__(self, scores_filename):
        self.scores_reader = ScoresReader(scores_filename)

    def combine(self, results):
        # results is typically the output from YelpBunkCombiner.fetch()
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
                    'date': insp.date.strftime('%Y-%m-%d'),
                    'score': insp.score,
                    'violations': violations
                    })
            yelp_data['inspections'] = inspections

        return results


if __name__ == '__main__':
    import json
    from pprint import pprint
    from writers import YelpDataWriter

    combiner = ScoreYelpCombiner('restaurant_scores.csv')

    with open('yelp.json', 'r', encoding='utf8') as f:
        yelp_data = json.load(f) 
        combined = combiner.combine(yelp_data)
        pprint(combined)

        with YelpDataWriter(open('combined.json', 'w', encoding='utf8') )as writer:
            for business_id, data in combined.items():
                writer.write(str(business_id), data)

