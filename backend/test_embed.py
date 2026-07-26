from sentence_transformers import SentenceTransformer
from chunker import process_pdf

print("Loading model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded.")

chunks = process_pdf("sample.pdf")
print(f"Number of chunks: {len(chunks)}")

first_chunk_text = chunks[0]['text']
embedding = model.encode(first_chunk_text)

print("Embedding shape:", embedding.shape)
print("First 5 values:", embedding[:5])