# ContractGuard AI ⚖️

> Autonomous Legal Risk Auditor and Safe Counter-Drafter powered by RAG and LLMs.

ContractGuard AI is a specialized legal technology application that analyzes employment contracts and offer letters to detect predatory clauses, excessive non-compete agreements, unreasonable service bonds, and unfair intellectual property assignments.

It provides an overall risk score, actionable clause-by-clause legal risk assessments grounded on labor benchmarks, and generates safer counter-draft alternatives for candidates.

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
--------------------------------------------------------------------------------------
* How It Works:
  
Upload an employment contract or offer letter in PDF format.

Extract and segment the document text using pypdf.

Retrieve relevant labor benchmarks from ChromaDB.

Use the Groq API-powered LLM to analyze contract clauses against the retrieved context.

Generate structured risk assessments and safer counter-draft alternatives.

Display the results through the React-based dashboard.

---------------------------------------------------------------------------------------
* Tech Stack:

  
Frontend-

React

Vite

Tailwind CSS

Lucide Icons

Axios


Backend-

FastAPI

Python

Uvicorn

Pydantic


Vector Database-

ChromaDB

In-Memory Vector Search


LLM Engine-

Groq API

High-throughput LLMs

------------------------------------------------------------------------------------------------
* Project Structure:

contract-guard-ai/
├── backend/
├── frontend/
├── .gitignore
└── README.md

-----------------------------------------------------------------------------------------------
* Getting Started

Prerequisites-

Make sure you have the following installed:

-Python 3.10+

-Node.js 18+

-Groq API Key

----------------------------------------------------------------------------------------------
* Backend Setup:

Navigate to the backend directory:

cd backend


Create a virtual environment:

python -m venv venv

-For Windows

venv\Scripts\activate

-For macOS/Linux

source venv/bin/activate


Install the required dependencies:

pip install fastapi uvicorn chromadb groq pypdf python-dotenv reportlab

--------------------------------------------------------------------------------------------
* Environment Variables:

Create a .env file inside the backend/ directory:

GROQ_API_KEY=your_groq_api_key_here

------------------------------------------------------------------------------------------
* Start the FastAPI Server:

\Run the following command from the backend/ directory:

uvicorn main:app --reload --port 8000

The backend server will run on:

http://localhost:8000

-------------------------------------------------------------------------------------------
* Frontend Setup:

Open a new terminal and navigate to the frontend directory:

cd frontend


Install the frontend dependencies:

npm install


Start the development server:

npm run dev


The application will be accessible at:

http://localhost:5173

--------------------------------------------------------------------------------------------
* Disclaimer:
  
ContractGuard AI is an educational and technical project intended to assist users in identifying potentially concerning contract clauses.

It does not provide legal advice and should not replace consultation with a qualified legal professional.
