from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def migrate_sqlite_schema():
    if engine.dialect.name != "sqlite":
        return
    with engine.begin() as connection:
        columns = {row[1] for row in connection.exec_driver_sql("PRAGMA table_info(users)")}
        if columns and "email" not in columns:
            connection.exec_driver_sql("ALTER TABLE users ADD COLUMN email VARCHAR")
        if columns:
            connection.exec_driver_sql(
                "UPDATE users SET email = username || '@aegisops.local' WHERE email IS NULL OR email = ''"
            )

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
