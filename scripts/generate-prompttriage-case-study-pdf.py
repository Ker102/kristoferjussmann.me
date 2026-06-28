from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "downloads" / "prompttriage-case-study.pdf"


def p(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(text, style)


def bullet_list(items, style):
    return ListFlowable(
        [ListItem(p(item, style), leftIndent=10) for item in items],
        bulletType="bullet",
        leftIndent=16,
        bulletFontName="Helvetica",
        bulletFontSize=8,
    )


def table(data, widths):
    header_style = ParagraphStyle(
        "TableHeader",
        fontName="Helvetica-Bold",
        fontSize=8.2,
        leading=9.8,
        textColor=colors.white,
    )
    cell_style = ParagraphStyle(
        "TableCell",
        fontName="Helvetica",
        fontSize=7.5,
        leading=9.2,
        textColor=colors.HexColor("#111111"),
    )
    wrapped = []
    for row_index, row in enumerate(data):
        row_style = header_style if row_index == 0 else cell_style
        wrapped.append([Paragraph(str(cell), row_style) for cell in row])

    tbl = Table(wrapped, colWidths=widths, repeatRows=1, hAlign="LEFT", splitByRow=1)
    tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#111111")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
                ("TOPPADDING", (0, 0), (-1, 0), 8),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#f6f7f9")),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#d8dbe2")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 1), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 1), (-1, -1), 6),
            ]
        )
    )
    return tbl


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        rightMargin=0.55 * inch,
        leftMargin=0.55 * inch,
        topMargin=0.58 * inch,
        bottomMargin=0.58 * inch,
        title="PromptTriage Case Study",
        author="Kristofer Jussmann",
    )

    base = getSampleStyleSheet()
    styles = {
        "title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=26,
            leading=30,
            textColor=colors.HexColor("#111111"),
            alignment=TA_CENTER,
            spaceAfter=10,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["BodyText"],
            fontSize=11.2,
            leading=16,
            textColor=colors.HexColor("#4b5563"),
            alignment=TA_CENTER,
            spaceAfter=18,
        ),
        "h1": ParagraphStyle(
            "H1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=15,
            leading=18,
            textColor=colors.HexColor("#111111"),
            spaceBefore=10,
            spaceAfter=7,
            keepWithNext=True,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11.5,
            leading=14,
            textColor=colors.HexColor("#111111"),
            spaceBefore=8,
            spaceAfter=5,
            keepWithNext=True,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontSize=9.2,
            leading=13.2,
            textColor=colors.HexColor("#374151"),
            spaceAfter=7,
            alignment=TA_LEFT,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["BodyText"],
            fontSize=7.8,
            leading=10,
            textColor=colors.HexColor("#4b5563"),
            spaceAfter=5,
        ),
        "callout": ParagraphStyle(
            "Callout",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=9.2,
            leading=13,
            textColor=colors.HexColor("#111111"),
            backColor=colors.HexColor("#eef0f4"),
            borderColor=colors.HexColor("#cfd3dc"),
            borderWidth=0.7,
            borderPadding=8,
            spaceBefore=5,
            spaceAfter=10,
        ),
    }

    story = []
    story.append(p("PromptTriage Case Study", styles["title"]))
    story.append(
        p(
            "RAG-powered prompt engineering platform with benchmarked prompt strategy, retrieval, model-selection, and format-efficiency evidence.",
            styles["subtitle"],
        )
    )

    metric_style = ParagraphStyle(
        "Metric",
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=TA_CENTER,
    )
    metric_data = [
        [
            p("<b>28K+</b><br/>Prompt corpus", metric_style),
            p("<b>1,080</b><br/>Study E evaluations", metric_style),
            p("<b>+13.9%</b><br/>Best gain vs generic", metric_style),
            p("<b>86.7%</b><br/>Fewer prompt words", metric_style),
        ]
    ]
    metric_table = Table(metric_data, colWidths=[1.35 * inch] * 4)
    metric_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#111111")),
                ("TEXTCOLOR", (0, 0), (-1, -1), colors.white),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#404040")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.append(metric_table)
    story.append(Spacer(1, 12))

    story.append(p("Executive Summary", styles["h1"]))
    story.append(
        p(
            "PromptTriage turns rough user intent into production-grade prompts across text, image, video, and system-prompt workflows. The platform combines a Next.js interface, Supabase Auth, Stripe subscription logic, FastAPI retrieval, Pinecone vectors, modality-specific metaprompts, and Azure deployment history. Its strongest signal is the research trail: benchmark outputs, judge-bias corrections, model/runtime tradeoffs, and prompt-format experiments.",
            styles["body"],
        )
    )
    story.append(
        p(
            "The results are intentionally framed as task-dependent. PromptTriage showed the strongest gains where prompts needed explicit structure, exact constraints, edge-case handling, boundary setting, or resistance to default model behavior.",
            styles["callout"],
        )
    )

    story.append(p("Benchmark Impact", styles["h1"]))
    benchmark_rows = [
        ["Metric", "Scope", "Result", "Impact"],
        ["PromptTriage vs generic prompt", "Study D IFEval, Gemini, 50 tasks", "82% vs 72%", "+13.9% relative"],
        ["PromptTriage vs no system prompt", "Study C v2, Nemotron 120B, 13 tasks", "30.92 vs 27.54", "+12.3% relative"],
        ["Naive RAG vs judge RAG", "Study A, 180 outputs, /50 rubric", "42.27 vs 38.97", "+8.5% quality, 57.3% faster"],
        ["Naive RAG vs agentic RAG", "Study A RAG ablation", "42.27 vs 39.40", "+7.3% quality, 42.5% faster"],
        ["Short prompts vs long prompts", "Study E v2, 1,080 evals", "32.03 vs 26.76", "+19.7% quality, 86.7% fewer words"],
        ["Qwen3 14B vs tested MoE path", "Study B prompt-generation benchmark", "41.77 vs 41.47", "Slightly higher score, about 64x faster"],
    ]
    story.append(table(benchmark_rows, [1.42 * inch, 1.62 * inch, 1.02 * inch, 1.34 * inch]))

    story.append(p("Edge Cases With The Largest Gains", styles["h1"]))
    edge_rows = [
        ["Edge case", "Best observed win", "Why it mattered"],
        ["Anti-default UI/code generation", "Nemotron: 35 vs 5 bare (+600%)", "Helped avoid AI UI defaults such as dark gradients, rounded corners, and framework assumptions."],
        ["Strict constrained formatting", "Nemotron: 25 vs 7 simple (+257%)", "Exact line/syllable constraints punished generic prompting."],
        ["Timezone scheduling reasoning", "Nemotron: 30 vs 13 simple (+131%)", "Constraint ordering and assumption control mattered."],
        ["Boolean logic trap", "Gemini: 31 vs 18 simple (+72%)", "Systematic hypothesis testing beat intuitive guessing."],
        ["Security code review", "Gemini: 48 vs 43 simple (+11.6%)", "Improved role expertise, boundaries, edge cases, specificity, and format."],
        ["DevOps incident response", "Claude: 45 vs 41 bare (+9.8%)", "Improved edge cases, specificity, and operational formatting."],
        ["Medical/financial boundary handling", "Up to +3 / 50 (+7.0% to +7.3%)", "Better boundary setting where confident generic advice can be risky."],
    ]
    story.append(table(edge_rows, [1.7 * inch, 1.45 * inch, 2.25 * inch]))

    story.append(PageBreak())
    story.append(p("Architecture And Implementation", styles["h1"]))
    story.append(
        bullet_list(
            [
                "Frontend: Next.js interface with modality selection, prompt analysis, and refinement flows.",
                "Auth and billing: Supabase Auth plus Stripe checkout, billing portal, and webhook-backed subscription state.",
                "Retrieval: FastAPI RAG service with Pinecone prompt vectors and corpus-derived examples.",
                "Generation: model-provider calls wrapped by modality-specific metaprompts.",
                "Deployment history: GitHub Actions, Azure Container Registry, Azure Container Apps, and Google Cloud Run history.",
            ],
            styles["body"],
        )
    )

    story.append(p("Format And Token-Order Lessons", styles["h1"]))
    story.append(
        p(
            "Study E supports compact, structured prompts over long instruction walls. Short prompts scored 32.03 versus 26.76 for long prompts while using 86.7% fewer words on average. For multimodal and agentic systems, the practical design rule is to place the most important details first: task, role, constraints, input priority, output format, and safety boundaries should be ordered from highest to lowest importance because models react differently depending on token order.",
            styles["body"],
        )
    )

    story.append(p("Case Study And Repository Format Status", styles["h1"]))
    story.append(
        bullet_list(
            [
                "The public case study follows the required professional sequence: summary, problem, constraints, requirements, architecture, security, deployment, operations, cost, results, tradeoffs, lessons, next steps, links, interview explanation, and resume bullets.",
                "The PromptTriage repository has a README, deployment documentation, security policy, research notes, benchmark output JSON, Azure ML logs, release charts, and architecture evidence.",
                "Remaining gaps are evidence polish: public-safe screenshots, job-level cost mapping, runbooks, monitoring/alert screenshots, and downloadable benchmark CSV/JSON summaries.",
            ],
            styles["body"],
        )
    )

    story.append(p("Resume-Ready Value Claims", styles["h1"]))
    story.append(
        bullet_list(
            [
                "Built and benchmarked PromptTriage across prompt strategy, RAG complexity, prompt format, model selection, and judge-bias studies.",
                "Demonstrated up to +13.9% relative instruction-following improvement versus generic prompts and up to +12.3% downstream quality lift versus no system prompt.",
                "Identified a compact-prompt strategy that scored +19.7% higher than long prompts while using 86.7% fewer words.",
                "Selected a Qwen3 14B production candidate that was about 64x faster than the tested MoE inference path while maintaining comparable quality.",
            ],
            styles["body"],
        )
    )

    story.append(p("Verification Sources", styles["h1"]))
    story.append(
        p(
            "Primary evidence lives in the PromptTriage repository: backend/research/RESEARCH_PROGRESS.md, backend/research/notebooks/named-outputs, Study A/B/C/D/E benchmark JSON, release charts, README, deployment notes, and the public case study page.",
            styles["small"],
        )
    )

    def footer(canvas, doc_obj):
        canvas.saveState()
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(colors.HexColor("#6b7280"))
        canvas.drawString(0.55 * inch, 0.32 * inch, "PromptTriage Case Study - Kristofer Jussmann")
        canvas.drawRightString(7.95 * inch, 0.32 * inch, f"Page {doc_obj.page}")
        canvas.restoreState()

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(OUTPUT)


if __name__ == "__main__":
    build_pdf()
