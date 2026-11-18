from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os



from app.tools.date_time import get_current_datetime,get_date_difference
from app.tools.weather import get_weather
from app.tools.web_search import web_search_tool
from app.tools.wikipedia import wikipedia_search


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

tools=[get_weather,get_date_difference,get_current_datetime,web_search_tool,wikipedia_search]

llm_with_tools=genrel_llm.bind_tools(tools)




