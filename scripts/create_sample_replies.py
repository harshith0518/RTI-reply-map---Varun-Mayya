from pathlib import Path
from textwrap import wrap

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "replies"
OUTPUT.mkdir(parents=True, exist_ok=True)

WIDTH, HEIGHT = A4
INK = HexColor("#17352f")
MUTED = HexColor("#60746e")
GREEN = HexColor("#176b4d")
SAGE = HexColor("#e8f4ec")
AMBER = HexColor("#8d4c0d")
LINE = HexColor("#d8e4dd")


def draw_watermark(pdf: canvas.Canvas) -> None:
    pdf.saveState()
    pdf.setFillColor(Color(0.09, 0.42, 0.30, alpha=0.07))
    pdf.setFont("Helvetica-Bold", 34)
    pdf.translate(WIDTH / 2, HEIGHT / 2)
    pdf.rotate(34)
    pdf.drawCentredString(0, 0, "SYNTHETIC DEMO - NOT OFFICIAL")
    pdf.restoreState()


def draw_page_frame(pdf: canvas.Canvas, title: str, registration: str, page_label: str) -> None:
    pdf.setFillColor(SAGE)
    pdf.rect(0, HEIGHT - 82, WIDTH, 82, fill=1, stroke=0)
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(46, HEIGHT - 42, title)
    pdf.setFont("Helvetica", 8.5)
    pdf.setFillColor(MUTED)
    pdf.drawString(46, HEIGHT - 60, f"Fictional registration: {registration}")
    pdf.setFillColor(AMBER)
    pdf.setFont("Helvetica-Bold", 8.5)
    pdf.drawRightString(WIDTH - 46, HEIGHT - 43, "SAMPLE DATA ONLY")
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 7.5)
    pdf.drawRightString(WIDTH - 46, HEIGHT - 60, page_label)
    pdf.setStrokeColor(LINE)
    pdf.line(46, 48, WIDTH - 46, 48)
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 7.5)
    pdf.drawString(46, 32, "Independent hackathon prototype - no government connection - nothing was filed")
    pdf.drawRightString(WIDTH - 46, 32, "Not legal advice")
    draw_watermark(pdf)


def draw_wrapped(pdf: canvas.Canvas, text: str, x: float, y: float, width_chars: int = 86,
                 font: str = "Helvetica", size: float = 10.5, leading: float = 16,
                 color=INK) -> float:
    pdf.setFillColor(color)
    pdf.setFont(font, size)
    for line in wrap(text, width=width_chars):
        pdf.drawString(x, y, line)
        y -= leading
    return y


def draw_letter_intro(pdf: canvas.Canvas, date: str, subject: str, office: str) -> float:
    y = HEIGHT - 118
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 9)
    pdf.drawString(46, y, f"Reply date: {date}")
    pdf.drawRightString(WIDTH - 46, y, office)
    y -= 28
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(46, y, "Subject")
    y -= 18
    return draw_wrapped(pdf, subject, 46, y, width_chars=78, size=10, leading=15)


def build_results_reply(path: Path) -> None:
    registration = "DEMO/CFSB/R/E/26/00421"
    pdf = canvas.Canvas(str(path), pagesize=A4, pageCompression=1)
    pdf.setTitle("DEMO - Maya Results Reply")

    draw_page_frame(pdf, "Fictional Results Section Reply", registration, "PDF page 1 of 2")
    y = draw_letter_intro(
        pdf,
        "18 June 2026",
        "Reply to the request for the marks recorded for application DEMO-024",
        "Central Fellowship Selection Board - Results Section (fictional)",
    )
    y -= 26
    y = draw_wrapped(pdf, "The requested marks record is enclosed on the next page as a candidate marks table.", 46, y)
    y -= 34
    pdf.setFillColor(SAGE)
    pdf.roundRect(46, y - 70, WIDTH - 92, 70, 10, fill=1, stroke=0)
    pdf.setFillColor(GREEN)
    pdf.setFont("Helvetica-Bold", 10)
    pdf.drawString(62, y - 23, "Document note")
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 9)
    pdf.drawString(62, y - 43, "This entire file is fictional and exists only for the RTI Reply Navigator demonstration.")
    pdf.showPage()

    draw_page_frame(pdf, "Candidate Marks Table", registration, "PDF page 2 of 2 - cited as page 2")
    y = HEIGHT - 128
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(46, y, "Recorded marks for application DEMO-024")
    y -= 42
    cols = [46, 220, 350, 470]
    widths = [174, 130, 120, 79]
    headers = ["Application", "Written test", "Interview", "Total"]
    values = ["DEMO-024", "62 / 80", "16 / 20", "78 / 100"]
    for idx, (x, cell_width) in enumerate(zip(cols, widths)):
        pdf.setFillColor(INK)
        pdf.rect(x, y, cell_width, 34, fill=1, stroke=0)
        pdf.setFillColor(white)
        pdf.setFont("Helvetica-Bold", 8.5)
        pdf.drawString(x + 8, y + 12, headers[idx])
        pdf.setFillColor(white)
        pdf.rect(x, y - 42, cell_width, 42, fill=1, stroke=1)
        pdf.setFillColor(INK)
        pdf.setFont("Helvetica-Bold", 10)
        pdf.drawString(x + 8, y - 26, values[idx])
    y -= 84
    pdf.setFillColor(SAGE)
    pdf.roundRect(46, y - 72, WIDTH - 92, 72, 10, fill=1, stroke=0)
    pdf.setFillColor(GREEN)
    pdf.setFont("Helvetica-Bold", 10)
    pdf.drawString(62, y - 23, "Exact passage used in the demo")
    draw_wrapped(pdf, "Application DEMO-024 - Written test: 62/80; Interview: 16/20; Total recorded score: 78/100.", 62, y - 43, width_chars=76, size=9, leading=14, color=INK)
    pdf.save()


def build_cutoff_reply(path: Path) -> None:
    registration = "DEMO/CFSB/R/E/26/00421/1"
    pdf = canvas.Canvas(str(path), pagesize=A4, pageCompression=1)
    pdf.setTitle("DEMO - Maya Cut-off Reply")

    draw_page_frame(pdf, "Fictional Selection Policy Reply", registration, "PDF page 1 of 2")
    y = draw_letter_intro(
        pdf,
        "21 June 2026",
        "Reply to the request for the approved category-wise cut-off document",
        "Central Fellowship Selection Board - Selection Policy Section (fictional)",
    )
    y -= 26
    y = draw_wrapped(pdf, "A copy of the fictional approved 2026 selection cut-off is enclosed as Attachment 1.", 46, y)
    y -= 32
    pdf.setFillColor(SAGE)
    pdf.roundRect(46, y - 54, WIDTH - 92, 54, 10, fill=1, stroke=0)
    pdf.setFillColor(GREEN)
    pdf.setFont("Helvetica-Bold", 10)
    pdf.drawString(62, y - 22, "Enclosure: Attachment 1 - Approved 2026 selection cut-off")
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 8.5)
    pdf.drawString(62, y - 39, "The attachment begins on the next PDF page and is cited as Attachment 1, page 1.")
    pdf.showPage()

    draw_page_frame(pdf, "Attachment 1 - Approved Cut-off", registration, "Attachment 1 - page 1")
    y = HEIGHT - 126
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(46, y, "Fictional 2026 fellowship selection cut-off")
    y -= 34
    pdf.setFillColor(SAGE)
    pdf.roundRect(46, y - 84, WIDTH - 92, 84, 10, fill=1, stroke=0)
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 9)
    pdf.drawString(62, y - 24, "Demonstration Category B")
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 20)
    pdf.drawString(62, y - 54, "74 marks")
    y -= 118
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 10)
    pdf.drawString(46, y, "Approval record")
    y -= 20
    draw_wrapped(pdf, "Approved by the Fellowship Selection Committee on 14 May 2026.", 46, y, size=10)
    y -= 44
    pdf.setStrokeColor(LINE)
    pdf.line(46, y, WIDTH - 46, y)
    y -= 24
    pdf.setFillColor(GREEN)
    pdf.setFont("Helvetica-Bold", 10)
    pdf.drawString(46, y, "Exact passage used in the demo")
    y -= 20
    draw_wrapped(pdf, "Approved 2026 selection cut-off - Demonstration Category B: 74 marks. Approved by the Fellowship Selection Committee on 14 May 2026.", 46, y, width_chars=82, size=9.5, leading=14)
    pdf.save()


def build_vacancy_reply(path: Path) -> None:
    registration = "DEMO/CFSB/R/E/26/00421/2"
    pdf = canvas.Canvas(str(path), pagesize=A4, pageCompression=1)
    pdf.setTitle("DEMO - Maya Vacancy Reply")

    draw_page_frame(pdf, "Fictional Planning and Finance Reply", registration, "PDF page 1 of 2")
    y = draw_letter_intro(
        pdf,
        "26 June 2026",
        "Reply to the request for the record showing how the total number of fellowship seats was determined",
        "Central Fellowship Selection Board - Planning and Finance Section (fictional)",
    )
    y -= 28
    pdf.setFillColor(SAGE)
    pdf.roundRect(46, y - 86, WIDTH - 92, 86, 10, fill=1, stroke=0)
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 10)
    pdf.drawString(62, y - 23, "Reply passage")
    draw_wrapped(pdf, "The final fellowship notification records a total of 120 seats. The notification is enclosed as Annexure A.", 62, y - 44, width_chars=76, size=9.5, leading=15)
    y -= 118
    pdf.setFillColor(AMBER)
    pdf.setFont("Helvetica-Bold", 9.5)
    pdf.drawString(46, y, "Important demonstration note")
    y -= 18
    draw_wrapped(pdf, "This fictional reply does not contain a calculation sheet, formula, approval note, or other record explaining how the total of 120 was determined.", 46, y, width_chars=84, size=9, leading=14, color=MUTED)
    pdf.showPage()

    draw_page_frame(pdf, "Annexure A - Final Notification Extract", registration, "PDF page 2 of 2 - Annexure A")
    y = HEIGHT - 126
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(46, y, "Fictional fellowship seat summary")
    y -= 38
    pdf.setFillColor(SAGE)
    pdf.roundRect(46, y - 96, WIDTH - 92, 96, 10, fill=1, stroke=0)
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 9)
    pdf.drawString(62, y - 27, "Selection year")
    pdf.drawString(260, y - 27, "Final recorded seats")
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(62, y - 59, "2026")
    pdf.drawString(260, y - 59, "120")
    y -= 136
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 9)
    pdf.drawString(46, y, "No calculation method or approval record appears in this annexure.")
    pdf.save()


def main() -> None:
    build_results_reply(OUTPUT / "maya-results-reply.pdf")
    build_cutoff_reply(OUTPUT / "maya-cutoff-reply.pdf")
    build_vacancy_reply(OUTPUT / "maya-vacancy-reply.pdf")
    for path in sorted(OUTPUT.glob("maya-*-reply.pdf")):
        print(path)


if __name__ == "__main__":
    main()
