# Doc QA

Upload a PDF, ask questions about it, get answers pulled straight from the document — along with the exact source text used to answer.

Think ChatPDF or NotebookLM, but built from scratch to actually understand how retrieval-augmented generation works under the hood.

## How it works

1. You upload a PDF.
2. The backend extracts the raw text and splits it into overlapping chunks (~500 words each, with 50 words of overlap so context doesn't get lost at the edges).
3. Each chunk gets converted into a 384-dimensional vector using `all-MiniLM-L6-v2` (a sentence-transformers model) and stored in ChromaDB.
4. When you ask a question, the question itself gets embedded the same way, and ChromaDB finds the chunks whose vectors are closest in meaning — not just closest in keywords.
5. The top matching chunks are returned as the answer, along with how confident the match was.

## Tech stack

**Backend:** Python, FastAPI, ChromaDB, sentence-transformers, PyMuPDF
**Frontend:** React, TypeScript, Vite, Tailwind CSS
**Deployment:** Railway (planned)

## Project structure
doc-qa/
├── backend/
│ ├── main.py # FastAPI app — /upload, /ask, /health
│ ├── chunker.py # PDF extraction and chunking logic
│ └── requirements.txt
├── frontend/
│ ├── src/
│ │ ├── App.tsx # main app shell
│ │ ├── Upload.tsx # PDF upload UI
│ │ └── Chat.tsx # chat interface with source display
│ └── package.json
└── README.md


## Running it locally

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:8000`, frontend on `http://localhost:5173`.

## What's next

- Swap raw chunk retrieval for actual LLM-generated answers (using the retrieved chunks as context)
- Clean up page headers/footers getting mixed into extracted text
- Persistent ChromaDB storage instead of in-memory
- Deploy to Railway

## Why I built this

Built to understand the full RAG pipeline end to end — not just calling an API, but actually wiring together PDF extraction, chunking strategy, embeddings, vector search, and a real frontend, and debugging every layer when it broke.
