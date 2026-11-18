# Chatbe

Chatbe is a full-stack AI chatbot with authenticated conversations, persistent chat history, LangGraph tool usage, and real-time assistant responses. The application is split into:

- **FastAPI backend** for authentication, conversation management, persistence, LangGraph orchestration, and SSE streaming.
- **React + Vite frontend** for the chat workspace, authentication screens, conversation history, and incremental response rendering.

## Features

- User registration and login with JWT access tokens.
- Password hashing and token-based protected routes.
- Multiple conversations per user.
- Persistent users, conversations, and messages in SQLite.
- LangGraph agent workflow with tool calling.
- Available tools for date/time, weather, web search, and Wikipedia.
- Real-time assistant response streaming over Server-Sent Events (SSE).
- Async LangGraph checkpoint persistence with `AsyncSqliteSaver`.
- Responsive chat interface with conversation navigation.

## Technology Stack

### Backend

- Python 3.13+
- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite
- LangChain and LangGraph
- Groq Chat models
- Pydantic Settings
- PyJWT
- `aiosqlite`

### Frontend

- React 19
- Vite
- Tailwind CSS
- Fetch API
- `ReadableStream`
- `TextDecoder`

## Project Structure

```text
.
├── backend/
│   ├── app/
│   │   ├── agents/          # LangGraph workflow and tool routing
│   │   ├── core/            # Settings, dependencies, and security
│   │   ├── models/          # SQLAlchemy models
│   │   ├── prompts/         # LLM prompt templates
│   │   ├── routers/         # Auth and chat API routes
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── services/        # LLM and chat-related services
│   │   ├── tools/           # Agent tools
│   │   ├── database.py
│   │   └── main.py
│   ├── chatbot.db           # Application data SQLite database
│   └── chat_history.db      # LangGraph checkpoint database
├── frontend/
│   ├── src/
│   │   ├── api/             # Backend API clients
│   │   └── components/      # React UI components
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Prerequisites

- Python 3.13 or newer
- Node.js 18 or newer
- npm
- A Groq API key

## Backend Setup

From the repository root, create and activate a virtual environment:

```powershell
cd "C:\Agentic Chatbot\backend"
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```powershell
pip install fastapi uvicorn sqlalchemy pydantic-settings python-dotenv `
  langchain-core langchain-groq langgraph langgraph-checkpoint-sqlite `
  aiosqlite pwdlib pyjwt
```

Create `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key
JWT_SECRET_KEY=replace_with_a_long_random_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=21600
```

Start the API:

```powershell
uvicorn app.main:app --reload
```

The backend runs at `http://localhost:8000`.

## Frontend Setup

In a second terminal:

```powershell
cd "C:\Agentic Chatbot\frontend"
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

To use a different backend URL, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

## Real-Time Streaming Flow

The chat route remains `POST /chat/{chat_id}`, but it now returns an SSE stream instead of waiting for a complete JSON response.

1. The backend validates conversation ownership.
2. The user message is saved immediately.
3. The first-message title is generated using the existing title service.
4. LangGraph is executed with:

   ```python
   graph.astream(..., stream_mode="messages")
   ```

5. Each assistant text chunk is sent as soon as it arrives.
6. The completed assistant response is persisted to the database.
7. The frontend reads the response using `ReadableStream` and `TextDecoder`.
8. Partial network chunks are buffered until a complete SSE event is available.
9. React appends each token to the active assistant message.

### SSE Events

#### User message

```text
event: user_message
data: {"id": 1, "role": "user", "content": "Hello", "created_at": "..."}
```

#### Assistant token

```text
event: token
data: {"content": "Hello"}
```

#### Completion

```text
event: done
data: {"assistant_message": {"id": 2, "role": "assistant", "content": "Hello...", "created_at": "..."}}
```

#### Error

```text
event: error
data: {"detail": "Unable to generate a response"}
```

## API Endpoints

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Authenticate and receive a JWT |

### Conversations

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/conversations` | List the current user's conversations |
| `POST` | `/chat` | Create a conversation |
| `POST` | `/chat/{chat_id}` | Send a message and receive an SSE stream |
| `GET` | `/chat/{chat_id}/messages` | Load conversation history |

Protected endpoints require:

```http
Authorization: Bearer <access_token>
```

## Data Persistence

- `chatbot.db` stores application data:
  - users
  - conversations
  - messages
- `chat_history.db` stores LangGraph checkpoints keyed by conversation thread ID.
- Each conversation uses its database ID as the LangGraph `thread_id`, preserving context across requests.

The async checkpoint saver is initialized during FastAPI startup and closed during application shutdown.

## Development Commands

Frontend linting:

```powershell
cd "C:\Agentic Chatbot\frontend"
npm run lint
```

Frontend production build:

```powershell
npm run build
```

Backend syntax check:

```powershell
cd "C:\Agentic Chatbot\backend"
python -m compileall app
```

## Troubleshooting

### `AsyncSqliteSaver` or `aiosqlite` errors

Install the async SQLite dependency in the active backend environment:

```powershell
pip install aiosqlite
```

### Frontend cannot connect to the API

Confirm that:

- Uvicorn is running on port `8000`.
- Vite is running on port `5173`.
- `VITE_API_URL` points to the backend URL.
- The backend CORS configuration allows the frontend origin.

### Streaming appears as one complete response

Check that the request is reaching `POST /chat/{chat_id}` and that:

- The backend uses `graph.astream(..., stream_mode="messages")`.
- The response has `text/event-stream` content type.
- No reverse proxy is buffering the response.
- The frontend is consuming `response.body` rather than calling `response.json()`.

### Authentication failures

Log in again if the JWT has expired. The frontend clears invalid tokens and redirects to the authentication page after a `401` response.

## Security Notes

- Do not commit `.env` files or API keys.
- Use a strong random `JWT_SECRET_KEY` outside local development.
- Keep `GROQ_API_KEY` server-side; never expose it through frontend environment variables.
- Restrict CORS origins before deploying publicly.
- Use HTTPS in production.

## Purpose

Chatbe is designed to provide a simple, persistent, and responsive AI workspace. Its primary goal is to make conversations feel immediate by showing the assistant’s answer while it is being generated, while retaining conversation history, authentication, and agent tool capabilities.
