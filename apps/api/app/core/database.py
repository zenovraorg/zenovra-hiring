from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import get_settings

class Database:
    client: AsyncIOMotorClient | None = None
    db: AsyncIOMotorDatabase | None = None

db = Database()

async def connect_to_mongo():
    settings = get_settings()
    db.client = AsyncIOMotorClient(settings.mongodb_url)
    db.db = db.client[settings.mongodb_db_name]
    # Create indexes
    await create_indexes()

async def close_mongo_connection():
    if db.client:
        db.client.close()

async def get_database() -> AsyncIOMotorDatabase:
    if db.db is None:
        await connect_to_mongo()
    return db.db

async def create_indexes():
    if db.db is None:
        return
    # Organizations
    await db.db.organizations.create_index("slug", unique=True)
    await db.db.organizations.create_index("domain")
    # Users
    await db.db.users.create_index("email", unique=True)
    await db.db.users.create_index("firebase_uid", unique=True)
    # Memberships
    await db.db.memberships.create_index([("user_id", 1), ("org_id", 1)], unique=True)
    await db.db.memberships.create_index("org_id")
    # Jobs
    await db.db.job_requisitions.create_index([("org_id", 1), ("status", 1)])
    await db.db.job_requisitions.create_index([("org_id", 1), ("slug", 1)], unique=True)
    await db.db.job_requisitions.create_index([("org_id", 1), ("department_id", 1)])
    await db.db.job_requisitions.create_index({"title": "text", "description": "text"})
    # Candidates
    await db.db.candidates.create_index([("org_id", 1), ("email", 1)], unique=True)
    await db.db.candidates.create_index({"first_name": "text", "last_name": "text", "email": "text", "headline": "text"})
    await db.db.candidates.create_index([("org_id", 1), ("created_at", -1)])
    # Applications
    await db.db.applications.create_index([("org_id", 1), ("job_id", 1)])
    await db.db.applications.create_index([("org_id", 1), ("candidate_id", 1)])
    await db.db.applications.create_index([("org_id", 1), ("stage_id", 1)])
    # Interviews
    await db.db.interviews.create_index([("org_id", 1), ("scheduled_at", 1)])
    await db.db.interviews.create_index("application_id")
    # Offers
    await db.db.offers.create_index([("org_id", 1), ("status", 1)])
    await db.db.offers.create_index("application_id")
    # Activity/Audit
    await db.db.activity_logs.create_index([("org_id", 1), ("created_at", -1)])
    await db.db.audit_logs.create_index([("org_id", 1), ("created_at", -1)])
    # Notifications
    await db.db.notifications.create_index([("user_id", 1), ("is_read", 1), ("created_at", -1)])
    # Referrals
    await db.db.referrals.create_index([("org_id", 1), ("referrer_id", 1)])
