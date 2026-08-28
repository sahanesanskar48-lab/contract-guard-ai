ContractGuard AI ⚖️

> Autonomous Legal Risk Auditor and Safe Counter-Drafter powered by RAG and LLMs.

ContractGuard AI is a specialized legal technology application that analyzes employment contracts and offer letters to detect predatory clauses, excessive non-compete agreements, unreasonable service bonds, and unfair intellectual property assignments. It provides an overall risk score, actionable clause-by-clause legal risk assessments grounded on labor benchmarks, and generates safer counter-draft alternatives for candidates.

---

## Key Features

- **Document Parsing & Chunking:** Extracts text from uploaded PDF contracts using `pypdf` with paragraph-level semantic segmentation.
- **RAG Architecture (Retrieval-Augmented Generation):** Evaluates contract terms against standard labor benchmarks indexed inside ChromaDB.
- **Strict Structured Output:** Enforces JSON schema guarantees via Pydantic to deliver risk levels (`HIGH`, `MEDIUM`, `LOW`), risk explanations, and alternative legal drafts.
- **Interactive UI:** Built with React, Vite, and Tailwind CSS with one-click counter-draft copy utility and dynamic risk scoring badges.

---

## System Architecture

```text
[ Upload PDF ]
      |
      v
[ PyPDF Chunking ] ---> [ ChromaDB Vector Retrieval ] (Legal Benchmarks)
                                 |
                                 v
                     [ LLM Reasoning Engine ] (Groq API)
                                 |
                                 v
                     [ Structured JSON Response ]
                                 |
                                 v
                     [ React Dashboard UI ]
```
=======================================================================================

* Tech Stack: 

- Frontend: React (Vite), Tailwind CSS, Lucide Icons, Axios
- Backend: FastAPI (Python), Uvicorn, Pydantic
- Vector Database: ChromaDB (In-Memory Vector Search)
- LLM Engine: Groq API / High-throughput LLMs

=========================================================================================

* Getting Started:

1. Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API Key

=========================================================================================

2. Backend Setup:

Bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install fastapi uvicorn chromadb groq pypdf python-dotenv reportlab

========================================================================================

* Create a .env file in the backend/ directory:

Code snippet
GROQ_API_KEY=your_groq_api_key_here

========================================================================================

* Start the FastAPI server:

Bash
uvicorn main:app --reload --port 8000

========================================================================================

3. Frontend Setup
Bash
cd frontend
npm install
npm run dev

The application will be accessible at http://localhost:5173.
