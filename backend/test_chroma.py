import chromadb
from sentence_transformers import SentenceTransformer
from chunker import process_pdf

print("Loading model...")
model = SentenceTransformer('all-MiniLM-L6-v2')

print("Processing PDF...")
chunks = process_pdf("sample.pdf")
print(f"Number of chunks: {len(chunks)}")

# create in-memory chroma client + collection
client = chromadb.Client()
collection = client.create_collection(name="doc_chunks")

# embed and store each chunk
print("Embedding and storing chunks...")
for chunk in chunks:
    embedding = model.encode(chunk['text']).tolist()
    collection.add(
        ids=[str(chunk['chunk_id'])],
        embeddings=[embedding],
        documents=[chunk['text']],
        metadatas=[{"word_count": chunk['word_count']}]
    )

print("Storage complete.")

# test query
query = "What is the main contribution of this paper?"
query_embedding = model.encode(query).tolist()

results = collection.query(
    query_embeddings=[query_embedding],
    n_results=3
)

print("\n=== QUERY RESULTS ===")
print(f"Query: {query}\n")
for i, doc in enumerate(results['documents'][0]):
    distance = results['distances'][0][i]
    print(f"Result {i+1} (distance={distance:.4f}):")
    print(doc[:200])
    print()

    # add this to test_chroma.py, or make a new quick test
query2 = "How is the attention weight computed using dot product"
query2_embedding = model.encode(query2).tolist()
results2 = collection.query(query_embeddings=[query2_embedding], n_results=3)

print("\n=== QUERY 2 RESULTS ===")
for i, doc in enumerate(results2['documents'][0]):
    distance = results2['distances'][0][i]
    print(f"Result {i+1} (distance={distance:.4f}):")
    print(doc[:200])
    print()