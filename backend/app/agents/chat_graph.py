from langgraph.graph import StateGraph,START,END
from typing import TypedDict,Annotated
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode,tools_condition


from app.services.llm import genrel_llm
from app.prompts.genrel_llm_prompt import chat_prompt
from app.services.llm import genrel_llm,llm_with_tools,tools
from app.tools.web_search import web_search_tool

class ChatState(TypedDict):
    messages:Annotated[list[BaseMessage],add_messages]
    need_web_search: bool
    web_response:str | None


def web_search(state:ChatState):
    response=web_search_tool.invoke({
        "query":state["messages"][-1]
    })
    return {
        "web_response":response["answer"]
    }



def chatbot(state:ChatState):
    formated_prompt=chat_prompt.invoke({"chat_history":state["messages"]})

    response=llm_with_tools.invoke(formated_prompt)

    return {
        "messages":[response]
    }

tool_node=ToolNode(tools)


workflow=StateGraph(ChatState)

workflow.add_node("chat_node",chatbot)
workflow.add_node("tool_node",tool_node)

workflow.add_edge(START,"chat_node")
workflow.add_conditional_edges(
    "chat_node",
    tools_condition,
    {
        "tools": "tool_node",
        END: END
    }
    )
workflow.add_edge("tool_node",'chat_node')


def build_graph(checkpointer=None):
    return workflow.compile(checkpointer=checkpointer)


graph = build_graph()