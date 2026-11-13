from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Message(Base):
    __tablename__="messages"
    id=Column(Integer,primary_key=True,index=True)

    conversation_id=Column(Integer,ForeignKey("conversations.id"))

    role=Column(String,nullable=False)

    content=Column(Text,nullable=False)
    
    created_at = Column(
    DateTime(timezone=True),
    server_default=func.now()
    )