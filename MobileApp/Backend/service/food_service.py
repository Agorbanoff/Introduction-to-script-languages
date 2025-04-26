import os
from dotenv import load_dotenv
import requests
from exceptions.exceptions import OpenFoodFactsFetchException

load_dotenv()

OPENFOODFACTS_URL = os.getenv("OPENFOODFACTS_URL")

def fetch_food_info(query):
    params = {
        "search_terms": query,
        "search_simple": 1,
        "action": "process",
        "json": 1
    }
    response = requests.get(OPENFOODFACTS_URL, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        raise OpenFoodFactsFetchException()
