import fitz

doc = fitz.open("/home/faiq-randhawa/university/DB Semester Project Deliverables Instructions.pdf")
print("Number of pages:", doc.page_count)

page1 = doc[0]
text = page1.get_text()
print("--- First 500 chars of page 1 ---")
print(text[:500])
