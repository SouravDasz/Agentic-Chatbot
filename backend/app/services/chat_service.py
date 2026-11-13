from app.prompts.title_generation_prompt import title_prompt
from app.services.llm import title_generation_llm


def title_generator(message:str)->str:
    chain=title_prompt | title_generation_llm
    response=chain.invoke(
        {
            "message":message
        }
    )
    return response.content