Gymax

Gymax is a personalized fitness and nutrition engine powering a modern React Native mobile app through a clean, flexible FastAPI backend.

Built for users who want adaptive workout plans, precise calorie tracking, and meal recommendations tailored to their unique body stats and goals.
Gymax combines static formulas with dynamic trend-based algorithms to deliver accurate maintenance estimates and fully customized training plans.

✨ Features

Personalized workout generation (Push, Pull, Legs, Upper/Lower, Full Body, custom splits)

Adaptive metabolism engine using weight-trend analysis

Daily calorie and macro tracking

Meal recommendations based on user stats and goals

Secure JWT authentication (access + refresh tokens)

User statistics storage (height, weight, age, sex, activity level)

Clean modular architecture (workouts, nutrition, analytics, auth)

Fully mobile-optimized API responses

Extendable system for future analytics, AI logic, and meal planning

📦 Example Workout Generation Request
{
  "goal": "muscle_gain",
  "experience": "intermediate",
  "daysPerWeek": 4,
  "preferences": {
    "split": "upper_lower",
    "equipment": ["dumbbells", "bench"]
  }
}

📤 Example Response
{
  "plan": {
    "days": [
      {
        "name": "Upper Body",
        "exercises": [
          { "name": "Bench Press", "sets": 4, "reps": 8 },
          { "name": "Dumbbell Row", "sets": 4, "reps": 10 }
        ]
      },
      {
        "name": "Lower Body",
        "exercises": [
          { "name": "Squat", "sets": 4, "reps": 8 },
          { "name": "Romanian Deadlift", "sets": 3, "reps": 10 }
        ]
      }
    ]
  }
}

🧠 How Gymax Works

Gymax processes training, nutrition, and statistics through four core systems:

1. User Profile & Stats

The engine reads the stored user data:

age, sex, height

weight history

activity level

training style and preferences

These values define the baseline for calories and training recommendations.

2. Metabolism & Weight Trend Analysis

Raw weight is noisy, so Gymax calculates:

7–14 day moving average
or

linear regression trend (recommended)

The daily weight slope (dW/dt) helps compute a more accurate:

real_maintenance = reported_calories - 770 * (dW/dt)


This makes calorie targets adaptive and personalized.

3. Workout Plan Engine

The backend constructs a structured Workout AST:

WorkoutPlan
 ├── split
 ├── days
 ├── exercises
 └── alternatives


The AST is then expanded into a full weekly program based on:

goal (fat loss, muscle gain, recomp)

available equipment

experience level

exercise difficulty progression

4. Meal Recommendation Engine

Meals are filtered and scored based on:

calorie budget

macro targets

cooking difficulty

goal (surplus/deficit/balance)

Results are delivered in a clean JSON structure ready for mobile UI rendering.

📚 User Stats Example
{
  "user": {
    "age": 17,
    "sex": "male",
    "height": 178,
    "weightHistory": [71.2, 71.0, 70.9, 70.7],
    "activityLevel": "moderate"
  }
}

🚀 Getting Started (FastAPI)
1. Clone the Repo
git clone https://github.com/Agorbanoff/Gymax.git
cd Gymax

2. Install Backend Dependencies
cd backend
pip install -r requirements.txt

3. Start the Backend
uvicorn app.main:app --reload

🧪 Test an Example Request
curl -X POST http://localhost:8000/workout/generate \
  -H "Content-Type: application/json" \
  -d '{"goal": "muscle_gain", "daysPerWeek": 4}'

🧱 Project Roadmap

In-app progress graphs (weight trend, calorie trend)

Barcode scanning for calorie tracking

Weekly meal planning system

AI-based workout adaptation from actual performance logs

Exercise execution analytics

Social features and shared programs

Cloud sync and multi-device support

❗ Error Format
{
  "error": {
    "message": "Invalid goal: muscle_gains",
    "code": "INVALID_GOAL",
    "path": "goal"
  }
}

🤝 Contributing

Contributions, ideas, refactors, and architectural improvements are welcome.
Gymax is designed as an educational and practical project showcasing backend fitness algorithms, trend-based metabolism modeling, and clean mobile-ready API design.
