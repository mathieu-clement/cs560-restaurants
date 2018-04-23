# San Francisco Restaurants

CS360/560 Data Visualization, University of San Francisco, April-May 2018

Mathieu Clément, Byron Han

# [Start here!](map.html)

## Data sources

Restaurant Health Scores: Originally from Kaggle, but updated version can be found on [DataSF](https://data.sfgov.org/Health-and-Social-Services/Restaurant-Scores-LIVES-Standard/pyih-qa8i)

[Yelp Developer API](https://www.yelp.com/developers/documentation/v3/business_search)

After updating to a new version of `restaurant_scores.csv`, `combined.json` can be regenerated using a sequence of `fetch.py`, `combine.py`, and optionally `merge_combined.py` and `show_highest_id.py` when downloading data in increments.

`neighborhood_average_scores.json` can be generated using `neighborhood_average_scores.py`.

## Build

Install the distance Python library from PyPI:

    pip3 install distance

It is used to perform fuzzy matching of strings, e.g. by using the Levenshtein edit distance algorithm.

Install the geojson Python library from PyPI:

    pip3 install geojson

Get an API KEY from Yelp, and save it to a file named `.YELP_API_KEY`. Then fetch data from Yelp using `fetch.py`, which yields the file `yelp.json`, and combine it with the SF Health Score department database using `combine.py`, which produces `combined.json`.

## Test

To run unit tests, simply launch:

    nosetests

Nose will read its settings from `setup.cfg`.

## Run

    php -S localhost:8000

NPM and Python can also be used to start a web server in the working directory.
