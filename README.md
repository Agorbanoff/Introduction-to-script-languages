Gymax is a lightweight, adaptive fitness and nutrition engine powering a personalized workout and calorie-tracking mobile application.

Built with FastAPI and React Native, Gymax exposes simple, focused endpoints that allow users to generate custom workout plans, estimate real maintenance calories from weight trends, log nutrition, and receive meals tailored to their needs.

✨ Features

Personalized workout generator (Push, Pull, Legs, Upper/Lower, Full Body, custom splits)

Adaptive metabolism engine (trend-based calorie maintenance)

Calorie and macro tracking

Meal recommendation engine

Secure JWT auth (access + refresh tokens)

User statistics (age, weight, height, sex, activity)

Extendable modular architecture (analytics, AI logic, meal plans, progression)

📦 Example Workout Request
{
  "goal": "muscle_gain",
  "experience": "beginner",
  "daysPerWeek": 3,
  "preferences": {
    "split": "full_body",
    "equipment": ["dumbbells"]
  }
}

📤 Example Workout Response
{
  "plan": {
    "days": [
      {
        "name": "Full Body A",
        "exercises": [
          { "name": "Dumbbell Squat", "sets": 3, "reps": 10 },
          { "name": "Push-Up", "sets": 3, "reps": 12 },
          { "name": "Bent-Over Row", "sets": 3, "reps": 10 }
        ]
      },
      {
        "name": "Full Body B",
        "exercises": [
          { "name": "Romanian Deadlift", "sets": 3, "reps": 10 },
          { "name": "Shoulder Press", "sets": 3, "reps": 12 },
          { "name": "Lat Pulldown", "sets": 3, "reps": 12 }
        ]
      }
    ]
  }
}

🧠 How Gymax Works

Gymax processes each user through four systems:

1. Validation

User inputs and preferences are validated:

goal exists

experience level is valid

equipment list is acceptable

days per week is within range

2. Stats & Metabolism Calculation

Gymax analyzes weight history, not raw daily weight, using:

moving average trend
or

linear regression slope (recommended)

Gymax computes realistic maintenance:

real_maintenance = calories_logged - 770 * (dW/dt)


This becomes the base for caloric surplus/deficit planning.

3. Workout Plan Builder (AST)

The request is converted into a structured AST:

WorkoutAST
 ├── goal
 ├── experience
 ├── split
 ├── days
 └── equipment


The AST compiles into a structured weekly plan.

4. Response Resolution

The workout or meal plan is formatted into clean, predictable JSON optimized for mobile UI rendering.

📚 User Profile Example
{
  "age": 17,
  "sex": "male",
  "height": 178,
  "weightHistory": [71.2, 71.0, 70.9, 70.7],
  "activityLevel": "moderate"
}

🚀 Getting Started (FastAPI)
1. Clone the repo
git clone https://github.com/Agorbanoff/Gymax.git
cd Gymax

2. Install dependencies
cd backend
pip install -r requirements.txt

3. Run the server
uvicorn app.main:app --reload

🧪 Test an Example Request
curl -X POST http://localhost:8000/workout/generate \
  -H "Content-Type: application/json" \
  -d '{"goal":"muscle_gain","daysPerWeek":4}'

🧱 Project Roadmap

Sorting & filtering for meal suggestions

Pagination for logs and history

Food barcode scanning

AI-adaptive workouts based on performance

Weekly meal planning

Caching repeated meal requests

Deep analytics dashboard

Exercise difficulty progression

Multi-device sync

❗ Error Format
{
  "error": {
    "message": "Invalid split: fullb0dy",
    "code": "INVALID_SPLIT",
    "path": "preferences.split"
  }
}

🤝 Contributing

Pull requests and ideas are welcome.
Gymax is designed as an educational yet production-ready project demonstrating fitness algorithms, trend-based metabolism modeling, and modular backend architecture.
