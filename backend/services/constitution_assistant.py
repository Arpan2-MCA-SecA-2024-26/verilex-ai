import pickle
import numpy as np
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
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

def get_embedder():
    global embedder

    if embedder is None:
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

    vector = get_embedder().encode(
        [query]
    )

    idx = get_index()
    distances, indices = idx.search(
        vector.astype("float32"),
        8
    )

    context = ""

    for idx in indices[0]:

        context += (
            f"\n\nPage {get_chunks()[idx]['page']}:\n"
            f"{get_chunks()[idx]['text']}"
        )

    return context


def answer_question(question):

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

    response = model.generate_content(
        prompt
    )

    return response.text

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