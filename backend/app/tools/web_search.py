from langchain_tavily import TavilySearch
from dotenv import load_dotenv
import os
from langchain.tools import tool

load_dotenv()


web_search_tool = TavilySearch(
    max_results=5,
    topic="general",
    search_depth="basic",
    include_answer=True,
    tavily_api_key=os.getenv("TAVILY_API_KEY")
)


