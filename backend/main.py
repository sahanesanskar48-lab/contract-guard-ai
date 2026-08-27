import os
import io
import json
from typing import List
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import chromadb
from groq import Groq
from pypdf import PdfReader

# 1. Load environment variables
load_dotenv()

GROQ_KEY = os.getenv("GROQ_API_KEY")

app = FastAPI(title="ContractGuard RAG Engine")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Initialize Groq client and In-Memory Vector Store
groq_client = Groq(api_key=GROQ_KEY)
chroma_client = chromadb.EphemeralClient()
legal_collection = chroma_client.get_or_create_collection(name="legal_benchmarks")

# 3. Pydantic Models for Schema Enforcement
class FlaggedClause(BaseModel):
    category: str = Field(description="Type of clause (e.g., Non-Compete, IP, Notice Period)")
    extracted_text: str = Field(description="Exact problematic text from the contract")
    risk_level: str = Field(description="HIGH, MEDIUM, or LOW")
    violation_reason: str = Field(description="Why this clause is unfair or predatory")
    safer_alternative: str = Field(description="Suggested counter-draft clause")

class AnalysisResponse(BaseModel):
    contract_summary: str
    overall_risk_score: int
    flagged_clauses: List[FlaggedClause]

# 4. Startup Event: Ingest benchmarks into ChromaDB
@app.on_event("startup")
def load_legal_knowledge_base():
    file_path = os.path.join(os.path.dirname(__file__), "benchmarks.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            rules = json.load(f)
            legal_collection.add(
                documents=[r["text"] for r in rules],
                metadatas=[{"category": r["category"]} for r in rules],
                ids=[r["id"] for r in rules]
            )

# 5. Extract text from PDF and split into paragraph chunks
def extract_and_chunk_pdf(pdf_bytes: bytes) -> List[str]:
    pdf_file = io.BytesIO(pdf_bytes)
    reader = PdfReader(pdf_file)
    full_text = ""
    for page in reader.pages:
        text = page.extract_text()
        if text:
            full_text += text + "\n"
    
    raw_chunks = [c.strip() for c in full_text.split("\n\n") if len(c.strip()) > 30]
    return raw_chunks

# 6. Core RAG Endpoint
@app.post("/api/analyze-contract", response_model=AnalysisResponse)
async def analyze_contract(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # Ingestion & Chunking
    pdf_bytes = await file.read()
    contract_chunks = extract_and_chunk_pdf(pdf_bytes)

    if not contract_chunks:
        raise HTTPException(status_code=400, detail="No readable text found in PDF.")

    # Retrieval: Similarity search against legal benchmarks
    sample_query = " ".join(contract_chunks[:4])
    search_results = legal_collection.query(
        query_texts=[sample_query],
        n_results=3
    )
    
    retrieved_benchmarks = search_results["documents"][0] if search_results["documents"] else []
    benchmark_context = "\n---\n".join(retrieved_benchmarks)
    contract_text_sample = "\n\n".join(contract_chunks[:15])

    # Generation: Grounded analysis via available Groq model
    system_prompt = """You are an expert Legal AI Auditor. 
Audit the provided employment contract against the given legal benchmarks. 
Identify unfair, predatory, or risky clauses. Return ONLY a valid JSON object matching the requested schema."""

    user_prompt = f"""
Standard Legal Benchmarks (Ground Truth):
{benchmark_context}

Contract Text to Audit:
{contract_text_sample}

Provide a JSON response with this exact structure:
{{
  "contract_summary": "Short 2-sentence summary of the contract",
  "overall_risk_score": 8,
  "flagged_clauses": [
    {{
      "category": "Clause category",
      "extracted_text": "Exact text from contract",
      "risk_level": "HIGH",
      "violation_reason": "Clear explanation of risk",
      "safer_alternative": "Fair counter-draft clause"
    }}
  ]
}}
"""

    completion = groq_client.chat.completions.create(
        model="qwen/qwen3.8-27b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        response_format={"type": "json_object"},
        temperature=0.1
    )

    result_json = json.loads(completion.choices[0].message.content)
    return result_json