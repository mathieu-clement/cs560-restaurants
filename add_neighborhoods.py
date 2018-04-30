#!/usr/bin/env python3

import json
from shapely.geometry import shape, Point
from scores import ScoresReader
import sys
from writers import YelpDataWriter

def get_polygons(geo_file):
    # dict with key: neighborhood name, 
    # value: polygon
    polygons = {}

    # The GeoJSON file contains a FeatureCollection (data['type'])
    data = json.load(geo_file)
    for feature in data['features']:
        neighborhood = feature['properties']['nhood']
        polygon = shape(feature['geometry'])
        polygons[neighborhood] = polygon

    return polygons


def get_neighborhood(polygons, restaurant):
    neighborhoods = polygons.keys()

    r_lat = restaurant['coordinates']['latitude']
    r_lon = restaurant['coordinates']['longitude']
    r_point = Point(r_lon, r_lat)

    for neighborhood, polygon in polygons.items():
        if polygon.contains(r_point):
            return neighborhood
    
    # not found?
    return None


restaurants = ScoresReader('restaurant_scores.csv').get_restaurants()

with open('neighborhoods.json', 'r', encoding='utf8') as geo_file:
    polygons = get_polygons(geo_file)

    with open('combined.json', 'r', encoding='utf8') as combined_json:
        restaurants_with_id = json.load(combined_json)

        with open('combined_with_neighborhood.json', 'w', encoding='utf8') as out_file:
            with YelpDataWriter(out_file) as writer:
                for score_id, restaurant in restaurants_with_id.items():
                    restaurant['neighborhood'] = get_neighborhood(polygons, restaurant)
                    writer.write(score_id, restaurant)

