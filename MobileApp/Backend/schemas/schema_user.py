def individual_serial(todo) -> dict:
    return {
        "id": str(todo["_id"]),
        "username": todo["username"],
        "email": todo["email"],
        "password": todo["password"],
    }

def list_serial(todos) -> list:
    return [individual_serial(todo) for todo in todos]