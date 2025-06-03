from fastapi import APIRouter, Depends, HTTPException
from starlette.concurrency import run_in_threadpool
from service import ai_service
from config.db_config import collection_statistics, collection_training
from util.token import get_user_id_from_token
from exceptions.exceptions import StatisticsNotFoundException, AIModelInferenceException
from model.user_training_entity import UserTraining

ai_router = APIRouter()

@ai_router.post("/generateplan", response_model=UserTraining)
async def generate_plan(user_id: str = Depends(get_user_id_from_token)):
    stats = await collection_statistics.find_one({"user_id": user_id})
    if not stats:
        raise StatisticsNotFoundException()

    try:
        prompt = ai_service.build_prompt(stats)
        raw_plan = await run_in_threadpool(lambda: ai_service.generate_ai_plan(prompt))
    except Exception as e:
        print(f"[AI Error] {e}")
        raise AIModelInferenceException()

    try:
        parsed_plan = ai_service.parse_plan(raw_plan)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Invalid AI response format: {e}")

    plan_doc = {
        "user_id": user_id,
        "plan_raw": raw_plan,
        "plan_json": [day.dict() for day in parsed_plan],
    }
    await collection_training.insert_one(plan_doc)

    return UserTraining(
        plan_raw=raw_plan,
        plan_json=parsed_plan
    )
