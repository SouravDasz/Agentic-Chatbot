from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,DeclarativeBase
import sqlite3



DATABASE_URL="sqlite:///./chatbot.db"

engine=create_engine(url=DATABASE_URL,connect_args={"check_same_thread": False})


SessionLocal=sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)

class Base(DeclarativeBase):
    pass


def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()


#Sqlite persitance

conn=sqlite3.connect(
    "chat_history.db",check_same_thread=False
)

