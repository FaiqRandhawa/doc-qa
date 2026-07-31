from fastapi import FastAPI, UploadFile, File
import chromadb
from sentence_transformers import SentenceTransformer
from chunker import process_pdf
import shutil
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


print("Loading embedding model...")
model = SentenceTransformer('all-MiniLM-L6-v2')

# one chroma client, lives for the life of the server
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection(name="doc_chunks")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # save uploaded file to disk temporarily
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # process: extract -> clean -> chunk
    chunks = process_pdf(file_path)

    # clear old collection data so each upload starts fresh
    # (simple approach for now — one doc at a time)
    global collection
    chroma_client.delete_collection(name="doc_chunks")
    collection = chroma_client.create_collection(name="doc_chunks")

    # embed and store each chunk
    for chunk in chunks:
        embedding = model.encode(chunk['text']).tolist()
        collection.add(
            ids=[str(chunk['chunk_id'])],
            embeddings=[embedding],
            documents=[chunk['text']],
            metadatas=[{"word_count": chunk['word_count']}]
        )

    return {
        "filename": file.filename,
        "chunks_stored": len(chunks)
    }


@app.post("/ask")
async def ask_question(question: str):
    query_embedding = model.encode(question).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3
    )

    sources = []
    for i, doc in enumerate(results['documents'][0]):
        sources.append({
            "text": doc,
            "distance": results['distances'][0][i]
        })

    return {
        "question": question,
        "sources": sources
    }