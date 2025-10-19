import os
import re
import requests
from dotenv import load_dotenv
from exceptions.exceptions import OpenFoodFactsFetchException

load_dotenv()

OPENFOODFACTS_URL = os.getenv("OPENFOODFACTS_URL")

#getting quantity and food name from the query

def extract_quantity_and_food(query: str):
    match = re.match(r"(\d+)\s+(.+)", query)
    if match:
        quantity = int(match.group(1))
        food_name = match.group(2)
        return quantity, food_name
    return 1, query  

#making the api call and formatting the response to be readable to use for frontend

def format_food_info(product: dict, quantity: int) -> str:
    name = product.get("product_name", "Unknown food")
    nutriments = product.get("nutriments", {})
    calories_per_100g = nutriments.get("energy-kcal_100g", 0)
    proteins_per_100g = nutriments.get("proteins_100g", 0)
    fats_per_100g = nutriments.get("fat_100g", 0)
    carbs_per_100g = nutriments.get("carbohydrates_100g", 0)

    serving_size_str = product.get("serving_size", "100g")
    serving_size = 100  
    if serving_size_str.endswith("g"):
        try:
            serving_size = float(serving_size_str.replace("g", "").strip())
        except ValueError:
            pass 

    total_calories = round((calories_per_100g / 100) * serving_size * quantity)
    total_proteins = round((proteins_per_100g / 100) * serving_size * quantity, 1)
    total_fats = round((fats_per_100g / 100) * serving_size * quantity, 1)
    total_carbs = round((carbs_per_100g / 100) * serving_size * quantity, 1)

    return (
        f"For {quantity} {name}(s) ({serving_size * quantity}g):\n"
        f"- Calories: {total_calories} kcal\n"
        f"- Proteins: {total_proteins}g\n"
        f"- Fats: {total_fats}g\n"
        f"- Carbohydrates: {total_carbs}g"
    )

#fetching food info from openfoodfacts

def fetch_food_info(query: str):
    quantity, food_query = extract_quantity_and_food(query)

    params = {
        "search_terms": food_query,
        "search_simple": 1,
        "action": "process",
        "json": 1,
    }
    response = requests.get(OPENFOODFACTS_URL, params=params)
    if response.status_code == 200:
        data = response.json()
        products = data.get("products", [])
        if not products:
            raise OpenFoodFactsFetchException()

        formatted_message = format_food_info(products[0], quantity)
        return {"message": formatted_message}
    else:
        raise OpenFoodFactsFetchException()