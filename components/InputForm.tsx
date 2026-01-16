
import React, { useState } from 'react';
import * as pdfjs from 'pdfjs-dist';

// Set up the worker for PDF.js using esm.sh version
pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.mjs`;

interface InputFormProps {
  onAnalyze: (resume: string, job: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isFileLoading, setIsFileLoading] = useState(false);

  const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsFileLoading(true);
    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const text = await extractTextFromPDF(arrayBuffer);
        setResumeText(text);
      } else {
        // Assume text file
        const text = await file.text();
        setResumeText(text);
      }
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Erro ao ler o arquivo. Certifique-se de que é um PDF ou arquivo de texto válido.");
    } finally {
      setIsFileLoading(false);
      // Reset the input value so the same file can be uploaded again if needed
      event.target.value = '';
    }
  };

  const isFormValid = jobDescription.trim().length > 50 && resumeText.trim().length > 50;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 gap-8">
        {/* Job Description Section */}
        <section className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Descrição da Vaga</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Cole aqui a descrição completa da vaga de emprego..."
            className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none bg-white text-sm"
          />
          <div className="flex justify-between">
            <span className="text-xs text-slate-400">{jobDescription.length} caracteres</span>
            {jobDescription.length < 50 && jobDescription.length > 0 && (
                <span className="text-xs text-amber-500">Mínimo 50 caracteres</span>
            )}
          </div>
        </section>

        {/* Resume Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-700">Currículo</label>
            <div className="flex items-center gap-2">
              <label className={`cursor-pointer text-xs font-medium transition-colors ${isFileLoading ? 'text-slate-400 pointer-events-none' : 'text-indigo-600 hover:text-indigo-800'}`}>
                {isFileLoading ? 'Extraindo texto...' : 'Carregar PDF ou TXT'}
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  disabled={isFileLoading}
                />
              </label>
            </div>
          </div>
          <div className="relative">
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Cole o texto do seu currículo aqui ou faça o upload..."
              className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none bg-white text-sm"
            />
            {isFileLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-10">
                 <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-100 animate-bounce">
                    <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Processando Arquivo...</span>
                 </div>
              </div>
            )}
          </div>
           <div className="flex justify-between">
            <span className="text-xs text-slate-400">{resumeText.length} caracteres</span>
            {resumeText.length < 50 && resumeText.length > 0 && (
                <span className="text-xs text-amber-500">Mínimo 50 caracteres</span>
            )}
          </div>
        </section>
      </div>

      <div className="flex justify-center pt-4 sticky bottom-6 z-10">
        <button
          disabled={!isFormValid || isLoading || isFileLoading}
          onClick={() => onAnalyze(resumeText, jobDescription)}
          className={`
            px-12 py-4 rounded-2xl font-bold text-white shadow-xl transform transition-all active:scale-95
            ${isFormValid && !isLoading && !isFileLoading
                ? 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1' 
                : 'bg-slate-300 cursor-not-allowed'}
          `}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analisando com IA...
            </div>
          ) : 'Analisar Aderência'}
        </button>
      </div>
    </div>
  );
};

export default InputForm;
