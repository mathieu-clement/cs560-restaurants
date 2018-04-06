#!/usr/bin/env python3

import requests

class YelpClient:

    def __init__(self):
        self.apiKey = self.get_api_key()
        self.headers = {'Authorization': 'Bearer ' + self.apiKey}


    def search_business(self, name, street, zip_code, **kwargs):
        endpoint='https://api.yelp.com/v3/businesses/search'
        params={
            'term': name,
            'location': street + ', San Francisco, ' + zip_code,
            'sort_by': 'distance',
            'limit': 1
        }
        for key in kwargs:
            params[key] = kwargs[key]
        return requests.get(endpoint, params=params, headers=self.headers)\
                .json()['businesses'][0]


    def get_api_key(self, filename='.API_KEY'):
        with open(filename, 'r') as keyFile:
            key=keyFile.read().replace('\n', '')
            if len(key) != 128:
                raise Exception('API key should be 128 characters long')
            return key


#if __name__ == '__main__':
#    yelp = YelpClient()
#
#    from pprint import pprint
#
#    pprint(yelp.search_business("K's kitchen", '757 Monterey Blvd', '94127'))
#    #pprint(yelp.search_business('Samovar Tea Lounge', '0498 SANCHEZ St', '94114'))
