from chunker import extract_text, clean_text, chunk_text, process_pdf

PDF_PATH = "sample.pdf"  # change to your actual PDF path

# step 1: raw extraction
raw = extract_text(PDF_PATH)
print("=== RAW TEXT (first 500 chars) ===")
print(raw[:500])
print(f"\nTotal raw text length: {len(raw)} chars\n")

# step 2: cleaned
cleaned = clean_text(raw)
print("=== CLEANED TEXT (first 500 chars) ===")
print(cleaned[:500])
print(f"\nTotal cleaned length: {len(cleaned)} chars\n")

# step 3: chunked
chunks = chunk_text(cleaned)
print(f"=== CHUNKS ===")
print(f"Total chunks: {len(chunks)}")
print(f"\nFirst chunk (word_count={chunks[0]['word_count']}):")
print(chunks[0]['text'][:300])

if len(chunks) > 1:
    print(f"\nSecond chunk (word_count={chunks[1]['word_count']}):")
    print(chunks[1]['text'][:300])
