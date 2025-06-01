from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from model.user_training_entity import WorkoutDay, Exercise
from typing import List
import torch
import re

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

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
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    outputs = model.generate(**inputs, max_new_tokens=512)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

def parse_plan(text: str) -> List[WorkoutDay]:
    days = []
    for line in text.strip().split("\n"):
        if ":" not in line:
            continue
        day, rest = line.split(":", 1)
        exercises = []
        for ex in rest.split(","):
            parts = ex.strip().rsplit(" ", 1)
            if len(parts) == 2 and 'x' in parts[1]:
                name = parts[0].strip()
                try:
                    sets, reps = map(int, parts[1].lower().split("x"))
                    exercises.append(Exercise(name=name, sets=sets, reps=reps))
                except:
                    exercises.append(Exercise(name=name))
            else:
                exercises.append(Exercise(name=ex.strip()))
        days.append(WorkoutDay(day=day.strip(), exercises=exercises))
    return days