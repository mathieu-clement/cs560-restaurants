#!/usr/bin/env python3

import distance
from scores import *

class ScoreYelpCombiner:

    def __init__(self, scores_filename):
        self.scores_reader = ScoresReader(scores_filename)
        
        self.abbrev = {
                'ave': 'avenue',
                'ct': 'court',
                'st': 'street',
                'blvd': 'boulevard',
                'dr': 'drive',
                'wy': 'way',
                'ln': 'lane',
                'rd': 'road',
                'terr': 'terrace',
                'pl': 'place',
                'pkwy': 'parkway',
                'hwy': 'highway',
                'cl': 'close'
                }
        # TODO Same with 1st vs First, 2nd vs Second, etc.

    def match(self, yelp, restaurant):
        name_y = yelp['name'].lower()
        name_r = restaurant.name.lower()

        # consider new place at the same address
        if yelp['distance'] < 20 and distance.levenshtein(name_y, name_r) < 10:
            return True
        
        street_y = yelp['location']['address1'].lower().replace('.', '')
        street_r = restaurant.street.lower().replace('.', '')

        # Consider "033 Market St" to be the same as "33 Market St"
        if street_r[0] == '0' and len(street_r) > 1:
            street_r = street_r[1:]
        if street_y[0] == '0' and len(street_y) > 1:
            street_y = street_y[1:]

        # Exact same address
        if street_y == street_r:
            return True

        # check address is the same besides abbreviation of the street if applicable
        street_y_splitted = street_y.split()
        if len(street_y_splitted) == 3:
            street_r_splitted = street_r.split()
            if len(street_r_splitted) == 3:
                street_y_no, street_y_name, street_y_type = street_y_splitted
                street_r_no, street_r_name, street_r_type = street_r_splitted

                if street_y_no != street_r_no or street_y_name != street_r_name:
                    return False

                if street_y_type in self.abbrev:
                    type_y = self.abbrev[street_y_type]
                    type_r = street_r_type
                    if type_r in self.abbrev:
                        type_r = self.abbrev[type_r]
                    if type_y == type_r:
                        return True
                
        return distance.levenshtein(name_y, name_r) < 5

    def combine(self, results):
        # results is typically the output from YelpBunkCombiner.fetch()
        restaurants =  self.scores_reader.get_restaurants_dict()
        to_delete = []

        for business_id, yelp_data in results.items():
            restaurant = restaurants[str(business_id)]
            if not self.match(yelp_data, restaurant):
                to_delete.append(business_id)
                continue
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

        for business_id in to_delete:
            del results[business_id]

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
        print('Number of entries, total:', len(combined))


        with YelpDataWriter(open('combined.json', 'w', encoding='utf8') )as writer:
            for business_id, data in combined.items():
                writer.write(str(business_id), data)

