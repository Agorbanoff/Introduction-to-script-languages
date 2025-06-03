from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from model.user_training_entity import WorkoutDay, Exercise
from typing import List
import torch
from exceptions.exceptions import AIModelInferenceException

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")

# choosing device that will run the ai
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

# after running the ai telling him how to respond and to what
def build_prompt(stats: dict) -> str:
    return (
        f"You are a certified personal trainer.\n"
        f"User: {stats['age']}y, {stats['gender']}, {stats['height_cm']}cm, {stats['weight_kg']}kg, "
        f"{stats['bfp']}% BFP. Trains {stats['sessions_per_week']}x/week.\n"
        f"Generate a workout plan, one line per day, in the exact format below—filling in each day with real exercises:\n\n"
        f"Monday: Squats 3x10, Bench Press 3x8, Bent-Over Row 3x8\n"
        f"Tuesday: Deadlift 3x5, Pullups 3x8, Overhead Press 3x6\n"
        f"Wednesday: Lunges 3x12, Dumbbell Fly 3x10, Seated Row 3x10\n"
        f"Thursday: Romanian Deadlift 3x8, Shoulder Press 3x6, Cable Pulldown 3x8\n"
        f"Friday: Leg Press 4x10, Incline Dumbbell Bench 3x8, Lat Pulldown 3x10\n"
        f"Saturday: Rest 1x0\n"
        f"Sunday: Rest 1x0\n\n"
        f"**Rules:**\n"
        f" • List exactly seven lines—Monday through Sunday—in that order.\n"
        f" • Each line must start with the day name, followed by a colon and a space.\n"
        f" • After the colon, list each exercise as “Name SxR” (e.g. “Squats 3x10”), separated by commas and a single space.\n"
        f" • Do NOT include bullets, parentheses, hyphens, extra explanations, or any other text.\n"
        f" • If it’s a rest day, write exactly “DayName: Rest 1x0”.\n"
        f" • Output only those seven lines—no extra headers or commentary.\n"
    )

def generate_ai_plan(prompt: str) -> str:
    try:
        inputs = tokenizer(prompt, return_tensors="pt").to(device)
        outputs = model.generate(**inputs, max_new_tokens=512)
        return tokenizer.decode(outputs[0], skip_special_tokens=True)
    except Exception as e:
        print(f"[AI Error] {e}")
        raise AIModelInferenceException()

#making the ai workout plan better structured for the frontend later
def parse_plan(text: str) -> List[WorkoutDay]:
    days = []
    lines = text.replace("\r\n", "\n").strip().split("\n")

    if len(lines) != 7:
        raise ValueError("Expected 7 lines, one for each day of the week.")

    for line in lines:
        if ":" not in line:
            raise ValueError(f"Invalid format, missing colon in: {line}")

        day_part, exercises_part = line.split(":", 1)
        day = day_part.strip()
        exercises = []

        for ex in exercises_part.split(","):
            ex = ex.strip()
            if ex.lower() == "rest 1x0":
                exercises.append(Exercise(name="Rest", sets=1, reps=0))
                continue

            parts = ex.rsplit(" ", 1)
            if len(parts) != 2 or "x" not in parts[1]:
                raise ValueError(f"Invalid exercise format in: {ex}")

            name = parts[0].strip()
            try:
                sets, reps = map(int, parts[1].lower().split("x"))
                exercises.append(Exercise(name=name, sets=sets, reps=reps))
            except Exception:
                raise ValueError(f"Invalid reps/sets in: {ex}")

        days.append(WorkoutDay(day=day, exercises=exercises))

    return days