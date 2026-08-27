import os
from reportlab.pdfgen import canvas

content = """
EMPLOYMENT OFFER LETTER AND TERMS

1. Role & Working Hours: The employee will work as a Software Engineer.

2. Intellectual Property Rights: The Company shall exclusively own all intellectual 
property, code, and inventions created by the Employee at any time, including work done 
on weekends or personal devices outside of working hours.

3. Non-Compete Agreement: The Employee agrees that upon termination or resignation, 
the Employee shall not work for any competitor or technology company across the entire 
country for a period of 24 months.

4. Notice Period & Service Bond: The Employee must serve a mandatory 6-month notice period. 
If the Employee resigns within 2 years, the Employee must pay a financial penalty 
bond of Rs. 3,00,000 to the Company.
"""

def create_sample_pdf(filename="sample_contract.pdf"):
    c = canvas.Canvas(filename)
    y = 800
    for line in content.strip().split("\n"):
        c.drawString(50, y, line.strip())
        y -= 25
    c.save()
    print(f"{filename} successfully created!")

if __name__ == "__main__":
    create_sample_pdf()