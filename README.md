# San Francisco Restaurants

CS360/560 Data Visualization, University of San Francisco, April-May 2018

Mathieu Clément, Byron Han

# Project Website

[Click here to view the project website.](https://tiktaktok.github.io/cs560-restaurants/)

# Presentations

[Beta presentation](https://docs.google.com/presentation/d/1NxS61eQGfu1Zmb3gTF91KavABF7uca2-_XEPLIsoZW4/edit?usp=sharing)

[Final presentation](https://docs.google.com/presentation/d/1MVIADc9SRaT4h85XZCvbduUS-VqcRD7T37VBI7T8sKY/edit#slide=id.gc6f919934_0_0)

# Project Proposal

[Access our revised project proposal here.](https://docs.google.com/document/d/17y4hHooTP8ACr6sZglSZy2W8UiNUCoNGoSZit1lAkC4/edit?usp=sharing)

# Process Book

[The process book is available here.](https://docs.google.com/document/d/1w9JR_OSabA8oWZDZj8DoQ95W021aclDNnhPI7d-sEP0/edit?usp=sharing)

## Data sources

Restaurant Health Scores: Originally from Kaggle, but an updated version can be found on [DataSF](https://data.sfgov.org/Health-and-Social-Services/Restaurant-Scores-LIVES-Standard/pyih-qa8i)

[Yelp Developer API](https://www.yelp.com/developers/documentation/v3/business_search)

After updating to a new version of `restaurant_scores.csv`, `combined.json` can be regenerated using a sequence of `fetch.py`, `combine.py`, and optionally `merge_combined.py` and `show_highest_id.py` when downloading data in increments.

`neighborhood_average_scores.json` can be generated using `neighborhood_average_scores.py`.

`add_neighborhoods.py` can be used to add a "neighborhood" attribute to each restaurant from `combined.json`.

## Build

Install the distance Python library from PyPI:

    pip3 install distance

It is used to perform fuzzy matching of strings, e.g. by using the Levenshtein edit distance algorithm.

Install the Shapely Python library from PyPI:

    pip3 install shapely

Get an API KEY from Yelp, and save it to a file named `.YELP_API_KEY`. Then fetch data from Yelp using `fetch.py`, which yields the file `yelp.json`, and combine it with the SF Health Score department database using `combine.py`, which produces `combined.json`.

## Test

To run unit tests, simply launch:

    nosetests

Nose will read its settings from `setup.cfg`.

## Run

    php -S localhost:8000

NPM and Python can also be used to start a web server in the working directory.

## TODO

