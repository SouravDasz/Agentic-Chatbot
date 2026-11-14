from langgraph.graph import StateGraph,START,END
from typing import TypedDict,Annotated
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
from langgraph.checkpoint.sqlite import SqliteSaver


from app.services.llm import genrel_llm
from app.prompts.genrel_llm_prompt import chat_prompt
from app.services.llm import genrel_llm
from app.database import conn


class ChatState(TypedDict):
    messages:Annotated[list[BaseMessage],add_messages]


checkpoint=SqliteSaver(conn)

def chatbot(state:ChatState):
    formated_prompt=chat_prompt.invoke({"chat_history":state["messages"]})

    response=genrel_llm.invoke(formated_prompt)

    return {
        "messages":[response]
    }

workflow=StateGraph(ChatState)
workflow.add_node("chatbot",chatbot)
workflow.add_edge(START,"chatbot")
workflow.add_edge("chatbot",END)

graph=workflow.compile(checkpointer=checkpoint)