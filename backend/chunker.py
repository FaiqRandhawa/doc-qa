import fitz  # pymupdf


def extract_text(pdf_path: str) -> str:
    """Extract raw text from every page of a PDF, concatenated."""
    doc = fitz.open(pdf_path)
    full_text = ""

    for page_num, page in enumerate(doc):
        page_text = page.get_text()
        full_text += page_text + "\n"

    doc.close()
    return full_text


def clean_text(text: str) -> str:
    """Basic cleanup: collapse excess whitespace/newlines."""
    lines = [line.strip() for line in text.split("\n")]
    lines = [line for line in lines if line]  # drop empty lines
    return " ".join(lines)


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[dict]:
    """Split text into overlapping word-based chunks."""
    words = text.split()
    chunks = []
    start = 0
    chunk_id = 0

    while start < len(words):
        end = start + chunk_size
        chunk_words = words[start:end]
        chunk_str = " ".join(chunk_words)

        chunks.append({
            "chunk_id": chunk_id,
            "text": chunk_str,
            "word_count": len(chunk_words)
        })

        chunk_id += 1
        start += chunk_size - overlap  # step forward, but overlap by 50

    return chunks


def process_pdf(pdf_path: str, chunk_size: int = 500, overlap: int = 50) -> list[dict]:
    """Full pipeline: extract -> clean -> chunk."""
    raw = extract_text(pdf_path)
    cleaned = clean_text(raw)
    chunks = chunk_text(cleaned, chunk_size, overlap)
    return chunks