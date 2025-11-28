"""
Seed initial data for Cosmos DB (Mongo API) used by postconsult-service and rewards-service.

Usage:
    COSMOS_MONGO_URL="..." COSMOS_DB_NAME="pettrack_db" python scripts/seed_cosmos.py
"""

from __future__ import annotations

import os
from datetime import date
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

COSMOS_MONGO_URL = os.getenv("COSMOS_MONGO_URL")
COSMOS_DB_NAME = os.getenv("COSMOS_DB_NAME", os.getenv("DATABASE_NAME", "pettrack_db"))

FOLLOWUPS_COLLECTION = os.getenv("FOLLOWUPS_COLLECTION", "followups")
REWARDS_COLLECTION = os.getenv("REWARDS_COLLECTION", "rewards")


def seed_followups(db):
    followups = [
        {
            "pet_name": "Rocky",
            "owner_name": "Ana Pérez",
            "type": "Seguimiento de recuperación",
            "date": "2025-05-12",
            "time": "10:00",
            "status": "Pendiente",
            "notes": "Revisar sutura",
            "pointsOnComplete": 100,
        },
        {
            "pet_name": "Luna",
            "owner_name": "Carlos R.",
            "type": "Vacunación programada",
            "date": "2025-06-02",
            "time": "16:30",
            "status": "Enviado recordatorio",
            "notes": "Vacuna antirrábica",
            "pointsOnComplete": 100,
        },
        {
            "pet_name": "Milo",
            "owner_name": "Laura S.",
            "type": "Encuesta de satisfacción",
            "date": "2025-04-30",
            "time": "09:00",
            "status": "Completado",
            "notes": "Excelente recuperación",
            "pointsOnComplete": 30,
        },
    ]

    collection = db[FOLLOWUPS_COLLECTION]
    collection.delete_many({})
    collection.insert_many(followups)
    print(f"✅ Follow-ups listos ({len(followups)})")


def seed_rewards(db):
    rewards = [
        {
            "title": "Cepillo profesional",
            "desc": "Cepillo ergonómico para perros mediano/grande.",
            "cost": 400,
            "img": "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=60",
        },
        {
            "title": "Desparasitación (1 aplicación)",
            "desc": "Servicio en clínica, incluye revisión.",
            "cost": 800,
            "img": "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=60",
        },
        {
            "title": "Snack saludable (pack)",
            "desc": "Pack de snacks naturales para mascotas.",
            "cost": 250,
            "img": "https://www.shutterstock.com/shutterstock/photos/479587543/display_1500/stock-photo-healthy-dog-food-isolated-on-white-479587543.jpg",
        },
    ]

    collection = db[REWARDS_COLLECTION]
    collection.delete_many({})
    collection.insert_many(rewards)
    print(f"✅ Recompensas listas ({len(rewards)})")


def main():
    if not COSMOS_MONGO_URL:
        raise SystemExit("❌ COSMOS_MONGO_URL es requerido para ejecutar el seed.")

    client = MongoClient(COSMOS_MONGO_URL)
    try:
        client.admin.command("ping")
    except ConnectionFailure as exc:
        raise SystemExit(f"❌ No se pudo conectar a Cosmos DB: {exc}") from exc

    db = client[COSMOS_DB_NAME]
    seed_followups(db)
    seed_rewards(db)
    print(f"🚀 Datos iniciales insertados en {COSMOS_DB_NAME}")


if __name__ == "__main__":
    main()

