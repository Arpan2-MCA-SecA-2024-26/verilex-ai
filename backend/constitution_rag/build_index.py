import fitz
import faiss
import pickle
import numpy as np

from sentence_transformers import SentenceTransformer

PDF_PATH = "constitution.pdf"

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

doc = fitz.open(PDF_PATH)

chunks = []

for page_no in range(len(doc)):
    page = doc[page_no]

    text = page.get_text()

    paragraphs = text.split("\n\n")

    for para in paragraphs:

        para = para.strip()

        if len(para) > 100:
            chunks.append(
                {
                    "page": page_no + 1,
                    "text": para
                }
            )

texts = [c["text"] for c in chunks]

embeddings = model.encode(
    texts,
    convert_to_numpy=True
)

dimension = embeddings.shape[1]

index = faiss.IndexFlatL2(dimension)

index.add(
    embeddings.astype("float32")
)

faiss.write_index(
    index,
    "constitution_rag/constitution_index.faiss"
)

with open(
    "constitution_rag/constitution_chunks.pkl",
    "wb"
) as f:
    pickle.dump(chunks, f)

print("Constitution indexed successfully.")