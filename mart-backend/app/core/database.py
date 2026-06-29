import os
from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL is None:
    raise Exception("DATABASE_URL not found in .env file")

# SQLAlchemy Base (THIS WAS MISSING - MAIN ERROR)
Base = declarative_base()

# Engine
engine = create_engine(DATABASE_URL)

# Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()