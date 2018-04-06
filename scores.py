#!/usr/bin/env python3

import csv
import datetime

class Restaurant:
    def __init__(self, rest_id, name, street, zip_code):
        self.id = rest_id
        self.name = name
        self.street = street
        self.zip_code = zip_code
        self._inspections = []

    @property
    def inspections(self):
        return sorted(self._inspections)

    def add_inspection(self, inspection):
        self._inspections.append(inspection)

    def __repr__(self):
        return 'Restaurant(%s, %s, San Francisco, CA %s, id=%s, inspections=%s' % \
        (self.name, self.street, self.zip_code, self.id, sorted(self.inspections))


class Inspection:
    def __init__(self, date, score):
        self.date = date
        self.score = score
        self._violations = []

    @property
    def violations(self):
        return sorted(self._violations)

    def add_violation(self, violation):
        self._violations.append(violation)

    def __repr__(self):
        return 'Inspection(date=%s, score=%s, violations=%s' % (self.date, self.score, self.violations)

    def __eq__(self, other):
        return self.date == other.date

    def __lt__(self, other):
        return self.date < other.date


class Violation:
    def __init__(self, description, risk):
        self.description = description
        self.risk = risk
        
    def __repr__(self):
        return '(%s) %s' % (self.risk, self.description)

    def __eq__(self, other):
        return self.description == other.description

    def __lt__(self, other):
        if self.risk == other.risk:
            return self.description < other.description
        else:
            return self.risk_value < other.risk_value
        return self.description < other.description

    @property
    def risk_value(self):
        return {'Low Risk': 1, 'Moderate Risk': 2, 'High Risk': 3}.get(self.risk, 0)

class ScoresReader:

    def __init__(self, filename):
        self.filename = filename

    # Columns
    # -------
    # business_id
    # business_name
    # business_address
    # business_city
    # business_state
    # business_postal_code
    # business_latitude
    # business_longitude
    # business_location
    # business_phone_number
    # inspection_id
    # inspection_date
    # inspection_score
    # inspection_type
    # violation_id
    # violation_description
    # risk_category

    def get_rows(self):
        rows = []
        with open(self.filename, 'r') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for row in csv_reader:
                # Only consider unscheduled inspections
                if 'Unscheduled' not in row['inspection_type']:
                    continue
                # Ignore if inspection score is missing
                if not row['inspection_score']:
                    continue
                # Ignore if ZIP code is missing or incorrect ("CA")
                if not row['business_postal_code']:
                    continue
                try:
                    int(row['business_postal_code'])
                except ValueError:
                    continue
                rows.append({
                    'id': row['business_id'],
                    'name': row['business_name'],
                    'street': row['business_address'],
                    'zip_code': int(row['business_postal_code']),
                    'inspection_date': row['inspection_date'],
                    'inspection_score': int(row['inspection_score']),
                    'inspection_type': row['inspection_type'],
                    'violation': row['violation_description'],
                    'risk': row['risk_category']
                })
        
        return rows

    def get_restaurants(self):
        restaurants = []
        rows = self.get_rows()
        # Sort by restaurant ID
        rows = sorted(rows, key=lambda k: k['id'])

        dict_rows = {} # key is restaurant id, value is list of rows for that restaurant

        for row in rows:
            if row['id'] not in dict_rows:
                dict_rows[row['id']] = []
            dict_rows[row['id']].append(row)

        for rest_id, rest_rows in dict_rows.items():
            dict_inspections = {} # key is inspection date, value is list 
                                  # of rows for that restaurant and that inspection
            r = rest_rows[0]
            restaurant = Restaurant(r['id'], r['name'], r['street'], r['zip_code'])

            for row in rest_rows:
                date = row['inspection_date']
                if date not in dict_inspections:
                    dict_inspections[date] = []
                dict_inspections[date].append(row)

            for date, insp_rows in dict_inspections.items():
                score = insp_rows[0]['inspection_score']
                python_date = datetime.datetime.strptime(date.split()[0], '%m/%d/%Y').date()
                inspection = Inspection(python_date, score)
                for insp_row in insp_rows:
                    inspection.add_violation(Violation(insp_row['violation'], insp_row['risk']))
                restaurant.add_inspection(inspection)

            restaurants.append(restaurant)

        return restaurants


if __name__ == '__main__':
    reader = ScoresReader('restaurant_scores.csv')
    from pprint import pprint
    pprint(reader.get_restaurants())
