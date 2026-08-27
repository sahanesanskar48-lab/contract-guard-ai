import React, { useState } from "react";
import axios from "axios";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Loader2,
  Sparkles,
  Scale
} from "lucide-react";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Please select a valid PDF file.");
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF document first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/analyze-contract",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Failed to analyze contract. Ensure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 7) return "text-red-500 bg-red-50 border-red-200";
    if (score >= 4) return "text-amber-500 bg-amber-50 border-amber-200";
    return "text-emerald-500 bg-emerald-50 border-emerald-200";
  };

  const getBadgeColor = (level) => {
    if (level === "HIGH") return "bg-red-100 text-red-700 border-red-300";
    if (level === "MEDIUM") return "bg-amber-100 text-amber-700 border-amber-300";
    return "bg-emerald-100 text-emerald-700 border-emerald-300";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                ContractGuard <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">AI RAG</span>
              </h1>
              <p className="text-xs text-slate-500">Autonomous Legal Risk Auditor & Safe Counter-Drafter</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            <Sparkles className="w-4 h-4 text-indigo-600" /> Grounded on Legal Benchmarks
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Upload Card */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-lg font-semibold text-slate-800 mb-1">
              Audit Employment Contract / Offer Letter
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Upload your PDF to scan for predatory clauses, bond traps, non-competes, and get safe counter-drafts.
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50 hover:bg-slate-100/70 transition-colors flex flex-col items-center justify-center cursor-pointer relative">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileText className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-700">
                {file ? file.name : "Click or drag & drop PDF contract here"}
              </p>
              <p className="text-xs text-slate-400 mt-1">Supported format: .PDF</p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2 text-left border border-red-200">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`mt-6 w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                loading || !file
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 shadow-lg cursor-pointer"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Auditing Clauses with RAG Engine...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Analyze Contract Now
                </>
              )}
            </button>
          </div>
        </section>

        {/* Results View */}
        {result && (
          <div className="space-y-6">
            {/* Summary & Score Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <div className="md:col-span-3">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-md font-bold text-slate-800">Executive Contract Summary</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {result.contract_summary}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 rounded-xl border bg-slate-50 md:border-l md:border-t-0 border-t border-slate-200">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Overall Risk Score
                </span>
                <div className={`text-3xl font-extrabold px-4 py-2 rounded-xl border ${getScoreColor(result.overall_risk_score)}`}>
                  {result.overall_risk_score} <span className="text-base font-normal text-slate-400">/ 10</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1">
                  {result.overall_risk_score >= 7 ? "High Legal Risk" : result.overall_risk_score >= 4 ? "Moderate Risk" : "Safe Contract"}
                </span>
              </div>
            </div>

            {/* Flagged Clauses Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  Flagged Clauses & Safe Counter-Drafts ({result.flagged_clauses.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {result.flagged_clauses.map((clause, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                      <span className="text-sm font-bold text-slate-800">
                        {clause.category}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getBadgeColor(clause.risk_level)}`}>
                        {clause.risk_level} RISK
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Original Problematic Clause */}
                      <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                        <div className="text-xs font-semibold text-red-800 flex items-center gap-1.5 mb-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Problematic Extracted Clause:
                        </div>
                        <p className="text-xs text-red-950 font-mono italic leading-relaxed">
                          "{clause.extracted_text}"
                        </p>
                      </div>

                      {/* Reason */}
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                          Why It's Risky / Predatory:
                        </h4>
                        <p className="text-sm text-slate-700 leading-normal">
                          {clause.violation_reason}
                        </p>
                      </div>

                      {/* Recommended Safer Counter-Draft */}
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 relative">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Recommended Safe Counter-Draft:
                          </div>
                          <button
                            onClick={() => handleCopy(clause.safer_alternative, idx)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-white border border-emerald-300 px-2.5 py-1 rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy Draft
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-emerald-950 leading-relaxed font-sans">
                          {clause.safer_alternative}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}