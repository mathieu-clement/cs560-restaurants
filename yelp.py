#!/usr/bin/env python3

import requests

class YelpClient:

    def __init__(self):
        self.api_key = self.get_api_key()
        self.headers = {'Authorization': 'Bearer ' + self.api_key}


    def search_business(self, name, street, zip_code, **kwargs):
        endpoint='https://api.yelp.com/v3/businesses/search'
        params={
            'term': name,
            'location': street + ', San Francisco, ' + str(zip_code),
            'sort_by': 'distance',
            'limit': 1
        }
        for key in kwargs:
            params[key] = kwargs[key]
        response = requests.get(endpoint, params=params, headers=self.headers)
        json = response.json()

        if 'total' not in json or 'businesses' not in json or len(json['businesses']) == 0:
            raise BusinessNotFoundException('Unexpected response', name, response)

        if json['total'] == 0:
            raise BusinessNotFoundException('No results', name, response)

        result = json['businesses'][0]

        if result['distance'] > 200:
            raise BusinessNotFoundException('Too far', name, response)

        return result


    def get_api_key(self, filename='.YELP_API_KEY'):
        with open(filename, 'r') as key_file:
            key=key_file.read().replace('\n', '')
            if len(key) != 128:
                raise Exception('API key should be 128 characters long')
            return key


class BusinessNotFoundException(Exception):
    def __init__(self, message, name, response):
        super(BusinessNotFoundException, self).__init__("Could not find business '" + name + "': " + message)
        self.message = message
        self.name = name
        self.response = response


if __name__ == '__main__':
    yelp = YelpClient()

    from pprint import pprint

    pprint(yelp.search_business("K's kitchen", '757 Monterey Blvd', '94127'))
    #pprint(yelp.search_business('Samovar Tea Lounge', '0498 SANCHEZ St', '94114'))
