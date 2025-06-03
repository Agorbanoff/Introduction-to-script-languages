# MobileApp/Backend/controller/ai_controller.py

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from service import ai_service
from config.db_config import collection_statistics, collection_training
from util.token import get_user_id_from_token

ai_router = APIRouter()

# ------------------------------------------------------------------------------
# Define a minimal Pydantic schema so the endpoint returns only { "plan_raw": "<string>" }
class AIPlanResponse(BaseModel):
    plan_raw: str
# ------------------------------------------------------------------------------


@ai_router.post("/generateplan", response_model=AIPlanResponse)
async def generate_plan(user_id: str = Depends(get_user_id_from_token)):
    """
    1) Fetch the user's statistics from MongoDB (collection_statistics)
    2) Build a prompt from those stats, run the AI model, and get a raw workout plan string
    3) Parse that raw string into structured WorkoutDay objects (so we can store it)
    4) Insert both raw_plan and plan_json into the Mongo collection (collection_training)
    5) Return only { "plan_raw": "<the raw text>" } to the frontend
    """

    # 1) Retrieve user statistics
    stats = await collection_statistics.find_one({"user_id": user_id})
    if not stats:
        raise HTTPException(status_code=404, detail="User statistics not found")

    # 2) Build AI prompt and generate raw plan text
    prompt = ai_service.build_prompt(stats)
    raw_plan = ai_service.generate_ai_plan(prompt)

    # 3) Parse raw text into structured WorkoutDay objects
    parsed_plan = ai_service.parse_plan(raw_plan)

    # 4) Save raw_plan and plan_json into MongoDB
    plan_doc = {
        "user_id": user_id,
        "plan_raw": raw_plan,
        "plan_json": [day.dict() for day in parsed_plan],
    }
    await collection_training.insert_one(plan_doc)

    # 5) Return only the raw text (so the frontend can do data.plan_raw)
    return AIPlanResponse(plan_raw=raw_plan)
