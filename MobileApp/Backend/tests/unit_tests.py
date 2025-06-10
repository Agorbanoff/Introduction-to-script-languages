import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from service.user_account_service import sign_up
from exceptions.exceptions import EmailAlreadyUsedException
from model.user_credentials_entity import UserSignUp


@pytest.mark.asyncio
async def test_sign_up_success():
    user = UserSignUp(username="testuser", email="test@example.com", password="password123")

    # Patch dependencies
    with patch("your_module.collection_name.find_one", new_callable=AsyncMock) as mock_find_one, \
         patch("your_module.collection_name.insert_one", new_callable=AsyncMock) as mock_insert_one, \
         patch("your_module.hashing_password", return_value="hashed_pass") as mock_hash, \
         patch("your_module.create_refresh_token", return_value="refresh123") as mock_refresh_token, \
         patch("your_module.create_access_token", return_value="access123") as mock_access_token, \
         patch("your_module.save_refresh_token", new_callable=AsyncMock) as mock_save_token:

        mock_find_one.return_value = None  # User does not exist
        mock_insert_one.return_value.inserted_id = "some_id"

        result = await sign_up(user)

        assert result["message"] == "User registered successfully"
        assert result["access_token"] == "access123"
        assert result["refresh_token"] == "refresh123"
        assert result["user"]["email"] == "test@example.com"

@pytest.mark.asyncio
async def test_sign_up_existing_email():
    user = UserSignUp(username="testuser", email="existing@example.com", password="password123")

    with patch("your_module.collection_name.find_one", new_callable=AsyncMock) as mock_find_one:
        mock_find_one.return_value = {"email": "existing@example.com"}  # Simulate existing user

        with pytest.raises(EmailAlreadyUsedException):
            await sign_up(user)
