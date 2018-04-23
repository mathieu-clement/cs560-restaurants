#!/usr/bin/env python3

import json
from shapely.geometry import shape, Point

class NeighborhoodAverageGenerator:

    def __init__(self, restaurants, neighborhoods_filename):
        self.restaurants = restaurants
        self.geo_file = open(neighborhoods_filename, 'r', encoding='utf8')

    def get_polygons(self):
        # dict with key: neighborhood name, 
        # value: polygon
        polygons = {}

        # The GeoJSON file contains a FeatureCollection (data['type'])
        data = json.load(self.geo_file)
        for feature in data['features']:
            neighborhood = feature['properties']['nhood']
            polygon = shape(feature['geometry'])
            polygons[neighborhood] = polygon

        return polygons

    @property
    def averages(self):
        return self.get_averages()

    def get_averages(self):
        averages = {} # key is neighborhood name, value is average (float)
        polygons = self.get_polygons()
        neighborhoods = polygons.keys()

        totals = {} # similar structure as averages
        counts = {} # idem

        # Init totals and counts
        for neighborhood in neighborhoods:
            totals[neighborhood] = 0.0
            counts[neighborhood] = 0

        for restaurant in restaurants:
            r_score = restaurant.score

            r_lat = restaurant.lat
            r_lon = restaurant.lon
            r_point = Point(r_lon, r_lat)

            for neighborhood, polygon in polygons.items():
                if polygon.contains(r_point):
                    totals[neighborhood] += r_score
                    counts[neighborhood] += 1
                    break
                # not found? Ignore

        for neighborhood in neighborhoods:
            averages[neighborhood] = totals[neighborhood] / counts[neighborhood]

        return averages

if __name__ == '__main__':
    from scores import ScoresReader

    restaurants = ScoresReader('restaurant_scores.csv').get_restaurants()
    gen = NeighborhoodAverageGenerator(restaurants, 'neighborhoods.json')
    averages = gen.get_averages()
    
    with open('neighborhood_average_scores.json', 'w', encoding='utf8') as outfile:
        json.dump(averages, outfile)
