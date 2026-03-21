from typing import Optional, Any
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime

class BaseRepository:
    def __init__(self, db: AsyncIOMotorDatabase, collection_name: str):
        self.db = db
        self.collection = db[collection_name]

    async def create(self, data: dict) -> dict:
        data["_id"] = str(ObjectId())
        data["created_at"] = datetime.utcnow().isoformat()
        data["updated_at"] = datetime.utcnow().isoformat()
        await self.collection.insert_one(data)
        return data

    async def get_by_id(self, id: str) -> Optional[dict]:
        return await self.collection.find_one({"_id": id})

    async def update(self, id: str, data: dict) -> Optional[dict]:
        data["updated_at"] = datetime.utcnow().isoformat()
        result = await self.collection.find_one_and_update(
            {"_id": id},
            {"$set": data},
            return_document=True,
        )
        return result

    async def soft_delete(self, id: str) -> bool:
        result = await self.collection.update_one(
            {"_id": id},
            {"$set": {"is_deleted": True, "updated_at": datetime.utcnow().isoformat()}},
        )
        return result.modified_count > 0

    async def list(
        self,
        filter: dict,
        page: int = 1,
        page_size: int = 20,
        sort: Optional[list[tuple[str, int]]] = None,
    ) -> tuple[list[dict], int]:
        filter = {**filter, "is_deleted": {"$ne": True}}
        total = await self.collection.count_documents(filter)
        cursor = self.collection.find(filter)
        if sort:
            cursor = cursor.sort(sort)
        else:
            cursor = cursor.sort("created_at", -1)
        cursor = cursor.skip((page - 1) * page_size).limit(page_size)
        items = await cursor.to_list(length=page_size)
        return items, total

    async def count(self, filter: dict) -> int:
        filter = {**filter, "is_deleted": {"$ne": True}}
        return await self.collection.count_documents(filter)
