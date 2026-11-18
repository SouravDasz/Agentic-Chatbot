from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware



from app.routers.auth import router as auth_router
from app.database import Base, engine
from app.models.user import User
from app.routers.chat import router as chat_router
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
import app.agents.chat_graph as chat_graph_module

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs when the application starts
    Base.metadata.create_all(bind=engine)

    async with AsyncSqliteSaver.from_conn_string("chat_history.db") as checkpoint:
        await checkpoint.setup()
        chat_graph_module.graph = chat_graph_module.build_graph(checkpointer=checkpoint)
        yield

        # Runs when the application shuts down
        engine.dispose()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router_list=[auth_router,chat_router]

for router in router_list:
    app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "server running successfully",
        "status_code": 200
    }