from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from model.user_training_entity import UserTraining
from service import ai_service
from config.db_config import collection_statistics, collection_training
from util.token import get_user_id_from_token

router = APIRouter()

class GoalOnlyRequest(BaseModel):
    goal: str

@router.post("/generateplan", response_model=UserTraining)
async def generate_plan(
    data: GoalOnlyRequest,
    user_id: str = Depends(get_user_id_from_token)
):
    # Get the user's statistics
    stats = await collection_statistics.find_one({"user_id": user_id})
    if not stats:
        raise HTTPException(status_code=404, detail="User statistics not found")

    # Generate prompt and run model
    prompt = ai_service.build_prompt(stats)
    raw_plan = ai_service.generate_ai_plan(prompt)
    parsed_plan = ai_service.parse_plan(raw_plan)

    # Store the result
    plan_doc = {
        "user_id": user_id,
        "plan_raw": raw_plan,
        "plan_json": [day.dict() for day in parsed_plan]
    }
    await collection_training.insert_one(plan_doc)

    # Respond with full data including streak and last update
    return UserTraining(
        sessions_per_week=stats["sessions_per_week"],
        streak=stats.get("streak", 0),
        last_streak_update=stats.get("last_streak_update"),
        goal=data.goal,
        plan_raw=raw_plan,
        plan_json=parsed_plan
    )