from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

# MongoDB client — created once when the module is first imported.
client = AsyncIOMotorClient(settings.MONGODB_URL)
database = client[settings.DATABASE_NAME]


def get_database():
    """Return the MongoDB database instance."""
    return database


def get_users_collection():
    """Return the 'users' collection."""
    return database["users"]
