# Configuration for FastAPI Student Portal backend
# This file contains secrets and JWT settings for authentication

SECRET_KEY = "your-very-secret-key"  # TODO: Replace with a secure random string in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
