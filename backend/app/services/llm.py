from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

load_dotenv()

title_generation_llm=ChatGroq(
    model="openai/gpt-oss-20b",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0
)

genrel_llm=ChatGroq(
    model="openai/gpt-oss-120b",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.4
)


