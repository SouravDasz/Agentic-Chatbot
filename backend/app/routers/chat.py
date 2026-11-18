import json

from fastapi import APIRouter,Depends,HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from langchain_core.messages import HumanMessage,AIMessageChunk



from app.schemas.conversation import ConversationResponse
from app.database import get_db
from app.models.user import User
from app.models.chat_model import Conversation
from app.core.dependencies import get_current_user
from app.schemas.message import MessageRequest,MessageResponse,ChatResponse
from app.models.message import Message
from app.services.chat_service import title_generator
import app.agents.chat_graph as chat_graph_module



router=APIRouter(tags=["conversations"])

def sse_event(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"

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

@router.post("/chat/{chat_id}")
async def send_message(
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

    async def generate():
        assistant_content = []

        yield sse_event("user_message", {
            "id": user_message.id,
            "role": user_message.role,
            "content": user_message.content,
            "created_at": user_message.created_at.isoformat(),
        })

        try:
            async for chunk, _metadata in chat_graph_module.graph.astream(
                {"messages": [HumanMessage(content=message_data.message)]},
                config=config,
                stream_mode="messages",
            ):
                if not isinstance(chunk, AIMessageChunk):
                    continue

                text = chunk.content
                if isinstance(text, list):
                    text = "".join(
                        block.get("text", "")
                        if isinstance(block, dict)
                        else str(block)
                        for block in text
                    )
                if not isinstance(text, str) or not text:
                    continue

                assistant_content.append(text)
                yield sse_event("token", {"content": text})

            assistant_message = Message(
                conversation_id=chat_id,
                role="assistant",
                content="".join(assistant_content),
            )
            db.add(assistant_message)
            db.commit()
            db.refresh(assistant_message)

            yield sse_event("done", {
                "assistant_message": {
                    "id": assistant_message.id,
                    "role": assistant_message.role,
                    "content": assistant_message.content,
                    "created_at": assistant_message.created_at.isoformat(),
                }
            })
        except Exception as error:
            db.rollback()
            yield sse_event("error", {"detail": str(error)})

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )



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