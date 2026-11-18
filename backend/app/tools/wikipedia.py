
from langchain_community.utilities import WikipediaAPIWrapper
from langchain_core.tools import tool


wiki_wrapper = WikipediaAPIWrapper(
    top_k_results=2,
    doc_content_chars_max=3000,
    lang="en"
)


@tool
def wikipedia_search(query: str) -> str:
    """
    Search Wikipedia for information about people,
    places, historical events, science, technology,
    companies, and other general topics.
    """

    try:
        result = wiki_wrapper.run(query)
        return result

    except Exception as e:
        return f"Wikipedia search failed: {str(e)}"
