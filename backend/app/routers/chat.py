from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from langchain_core.messages import HumanMessage,AIMessage



from app.schemas.conversation import ConversationResponse
from app.database import get_db
from app.models.user import User
from app.models.chat_model import Conversation
from app.core.dependencies import get_current_user
from app.schemas.message import MessageRequest,MessageResponse,ChatResponse
from app.models.message import Message
from app.services.chat_service import title_generator
from app.agents.chat_graph import graph



router=APIRouter(tags=["conversations"])

@router.get("/conversations",response_model=list[ConversationResponse])
def get_conversations(
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
    ):

    conversations=(db.query(Conversation).filter(
        Conversation.user_id==current_user.id
    ).order_by(Conversation.created_at.desc()).all())

    return conversations



@router.post("/chat",response_model=ConversationResponse)
def create_chat(
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
    ):
    new_chat=Conversation(
        user_id=current_user.id,
        title="New Chat"
    )
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat

@router.post("/chat/{chat_id}", response_model=ChatResponse)
def send_message(
    chat_id: int,
    message_data: MessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Step 1: Verify conversation ownership
    chat = db.query(Conversation).filter(
        Conversation.id == chat_id,
        Conversation.user_id == current_user.id
    ).first()

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    # Step 2: Save user message
    user_message = Message(
        conversation_id=chat_id,
        role="user",
        content=message_data.message
    )

    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    # Step 3: Count user messages
    message_count = db.query(Message).filter(
        Message.conversation_id == chat_id,
        Message.role == "user"
    ).count()

    # Step 4: Generate title for first message
    if message_count == 1:
        generated_title = title_generator(message_data.message)

        chat.title = generated_title
        db.commit()
        db.refresh(chat)
    config = {
        "configurable": {
            "thread_id": str(chat_id)
        }
    }

    response=graph.invoke(
        {"messages":[HumanMessage(content=message_data.message)]},config=config
    )

    ai_response=response["messages"][-1].content

    assistant_message = Message(
    conversation_id=chat_id,
    role="assistant",
    content=ai_response
    )
    db.add(assistant_message)
    db.commit()
    db.refresh(assistant_message)


    return {
    "user_message": user_message,
    "assistant_message": assistant_message
}



@router.get("/chat/{chat_id}/messages",response_model=list[MessageResponse])
def get_chat_message(
    chat_id:int,
    db:Session=Depends(get_db),
    current_user:User=Depends(get_current_user)
):
    chat=db.query(Conversation).filter(
        Conversation.id==chat_id,
        Conversation.user_id==current_user.id
    ).first()
    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )
    messages = db.query(Message).filter(
    Message.conversation_id == chat_id
    ).order_by(Message.created_at.asc(), Message.id.asc()).all()

    # Step 3: Return messages
    return messages