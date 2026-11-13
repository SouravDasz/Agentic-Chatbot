from langchain_core.prompts import PromptTemplate


title_prompt=PromptTemplate(
    template="""
You are an AI conversation title generator.

    Generate a short and meaningful title based on the user's first message.

    Rules:
    - Title must contain 3-7 words.
    - Capture the main topic.
    - Do not use quotation marks.
    - Do not provide explanations.
    - Return only the title.

    User message: {message}

    Title:
    """,input_variables=["message"]
)
