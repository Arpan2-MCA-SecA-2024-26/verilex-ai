import pickle
import numpy as np
from groq import Groq
import os
import traceback
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# embedder = SentenceTransformer(
#     "all-MiniLM-L6-v2"
# )
embedder = None

def get_embedder():

    global embedder

    if embedder is None:

        from sentence_transformers import SentenceTransformer

        embedder = SentenceTransformer(
            "all-MiniLM-L6-v2"
        )

    return embedder

# index = faiss.read_index(
#     "constitution_rag/constitution_index.faiss"
# )
index = None

def get_index():

    global index

    if index is None:

        import faiss

        index = faiss.read_index(
            "constitution_rag/constitution_index.faiss"
        )

    return index

chunks = None

def get_chunks():

    global chunks

    if chunks is None:

        with open(
            "constitution_rag/constitution_chunks.pkl",
            "rb"
        ) as f:

            chunks = pickle.load(f)

    return chunks


def search_constitution(query):

    print("=" * 60)
    print("Searching Constitution...")
    print("Working Directory:", os.getcwd())

    print(
        "FAISS Exists:",
        os.path.exists(
            "constitution_rag/constitution_index.faiss"
        )
    )

    print(
        "Chunks Exists:",
        os.path.exists(
            "constitution_rag/constitution_chunks.pkl"
        )
    )

    vector = get_embedder().encode(
        [query]
    )

    idx = get_index()

    distances, indices = idx.search(
        vector.astype("float32"),
        8
    )

    context = ""

    for i in indices[0]:

        context += (
            f"\n\nPage {get_chunks()[i]['page']}:\n"
            f"{get_chunks()[i]['text']}"
        )

    return context


def answer_question(question):

    try:

        context = search_constitution(
            question
        )

        prompt = f"""
You are a Constitutional Law Expert.

Answer ONLY from the Constitution context.

Context:
{context}

Question:
{question}

Instructions:

1. Give structured answer.
2. Mention relevant Article numbers.
3. Use headings.
4. Explain in simple language.
5. If answer not found, say:
   'Not found in Constitution.'
"""

        print("Calling Groq...")
        response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        max_tokens=1200
)

        return response.choices[0].message.content

    except Exception as e:

        print("=" * 60)
        print("CONSTITUTION ASSISTANT ERROR")
        traceback.print_exc()
        print("=" * 60)

        raise

def answer_multiple_questions(text):

    questions = [
        q.strip()
        for q in text.split("?")
        if q.strip()
    ]

    final_answer = ""

    for i, q in enumerate(
        questions,
        start=1
    ):

        ans = answer_question(q)

        final_answer += (
            f"\n\n"
            f"QUESTION {i}\n"
            f"{'='*40}\n"
            f"{ans}\n"
        )

    return final_answer