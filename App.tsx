
import React, { useState, useCallback } from 'react';
import InputForm from './components/InputForm';
import AnalysisDashboard from './components/AnalysisDashboard';
import { analyzeResume } from './services/geminiService';
import { AnalysisState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null,
  });

  const handleAnalyze = useCallback(async (resume: string, job: string) => {
    setState({ isAnalyzing: true, result: null, error: null });
    try {
      const result = await analyzeResume(resume, job);
      setState({ isAnalyzing: false, result, error: null });
    } catch (err) {
      setState({ 
        isAnalyzing: false, 
        result: null, 
        error: err instanceof Error ? err.message : 'Ocorreu um erro inesperado na análise.' 
      });
    }
  }, []);

  const resetAnalysis = () => {
    setState({ isAnalyzing: false, result: null, error: null });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl italic">A</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              ATS<span className="text-indigo-600">Master</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <span className="hover:text-indigo-600 cursor-pointer">Como funciona</span>
            <span className="hover:text-indigo-600 cursor-pointer">Dicas de Currículo</span>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {!state.result && !state.isAnalyzing && (
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Seu Currículo <span className="text-indigo-600 italic">à Prova de Erros</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Compare seu currículo com a vaga desejada em segundos. Nossa IA identifica as habilidades que faltam para você ser chamado para a entrevista.
            </p>
          </div>
        )}

        {state.error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {state.error}
          </div>
        )}

        {state.isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse">
                A Inteligência Artificial está decodificando seu potencial...
              </h3>
              <p className="text-slate-500 mt-2">Analisando semântica, skills e calculando sua probabilidade de aprovação.</p>
            </div>
          </div>
        ) : state.result ? (
          <AnalysisDashboard result={state.result} onReset={resetAnalysis} />
        ) : (
          <InputForm onAnalyze={handleAnalyze} isLoading={state.isAnalyzing} />
        )}
      </main>

      <footer className="mt-auto border-t py-8 text-center text-slate-400 text-xs">
        <p>&copy; 2024 ATS Master Pro - Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
