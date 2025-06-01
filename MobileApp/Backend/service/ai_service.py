from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from model.user_training_entity import WorkoutDay, Exercise
from typing import List
import torch
import re

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

def build_prompt(stats: dict, goal: str) -> str:
    return (
        f"You are a certified personal trainer.\n"
        f"User: {stats['age']}y, {stats['gender']}, {stats['height_cm']}cm, {stats['weight_kg']}kg, "
        f"{stats['bfp']}% BFP. Trains {stats['sessions_per_week']}x/week.\n"
        f"Generate a workout plan by day with exercises, sets, and reps."
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