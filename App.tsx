
import React, { useState, useCallback } from 'react';
import InputForm from './components/InputForm';
import AnalysisDashboard from './components/AnalysisDashboard';
import { analyzeResume } from './services/geminiService';
import { AnalysisState } from './types';

type View = 'analyzer' | 'how-it-works' | 'tips';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('analyzer');
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
    setCurrentView('analyzer');
  };

  const renderContent = () => {
    if (state.isAnalyzing) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-800">IA Analisando seu Perfil...</h3>
            <p className="text-slate-500 mt-2">Cruzando dados com algoritmos ATS e Otimização LinkedIn</p>
          </div>
        </div>
      );
    }

    if (state.result) {
      return <AnalysisDashboard result={state.result} onReset={resetAnalysis} />;
    }

    switch (currentView) {
      case 'how-it-works':
        return (
          <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-black text-slate-900">Como a IA Analisa seu Currículo?</h2>
              <p className="text-slate-600">Utilizamos o motor Gemini 3 para simular o comportamento de um Applicant Tracking System (ATS) real.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">1</div>
                <h4 className="font-bold mb-2 text-slate-800">Extração (Parsing)</h4>
                <p className="text-sm text-slate-500">O sistema lê seu PDF e organiza o texto de forma estruturada para entender experiências e datas.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">2</div>
                <h4 className="font-bold mb-2 text-slate-800">Matching Semântico</h4>
                <p className="text-sm text-slate-500">A IA não busca apenas palavras exatas, mas o sentido das suas competências em relação ao que o RH busca.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">3</div>
                <h4 className="font-bold mb-2 text-slate-800">Scoring & Insights</h4>
                <p className="text-sm text-slate-500">Gera uma nota de 0 a 100 e aponta exatamente onde você deve focar para "vencer" o filtro.</p>
              </div>
            </div>
            <div className="text-center">
               <button onClick={() => setCurrentView('analyzer')} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">Voltar para Análise</button>
            </div>
          </div>
        );
      case 'tips':
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <h2 className="text-3xl font-black text-slate-900 text-center mb-8">Dicas de Ouro para o Currículo Moderno</h2>
            <div className="space-y-4">
               {[
                 { t: "Use Formatos Simples", d: "Sistemas ATS têm dificuldade com currículos em colunas complexas ou muitos elementos gráficos. Use layout de coluna única." },
                 { t: "Palavras-Chave no Topo", d: "Garanta que as competências listadas na vaga apareçam de forma orgânica no seu resumo ou histórico profissional." },
                 { t: "Foco em Resultados", d: "Não diga apenas o que fez. Diga qual foi o impacto. Use números: 'Aumentei as vendas em 20%' ao invés de 'Vendi produtos'." },
                 { t: "Customização é Tudo", d: "Nunca envie o mesmo currículo para 10 vagas. Ajuste 20% do texto para cada vaga específica." }
               ].map((tip, i) => (
                 <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                    <h4 className="font-bold text-indigo-600 mb-1">{tip.t}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{tip.d}</p>
                 </div>
               ))}
            </div>
             <div className="text-center pt-8">
               <button onClick={() => setCurrentView('analyzer')} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">Começar Análise Agora</button>
            </div>
          </div>
        );
      default:
        return (
          <>
            <div className="text-center mb-12 animate-fadeIn">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                Seu Currículo <span className="text-indigo-600 italic">à Prova de Erros</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Compare seu perfil com a vaga e otimize seu LinkedIn em segundos. Nossa IA identifica as lacunas para você ser chamado para a entrevista.
              </p>
            </div>
            <InputForm onAnalyze={handleAnalyze} isLoading={state.isAnalyzing} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {resetAnalysis(); setCurrentView('analyzer');}}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl italic">A</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              ATS<span className="text-indigo-600">Master</span>
            </h1>
          </div>
          <nav className="flex items-center gap-4 md:gap-8 text-sm font-bold text-slate-500">
            <button 
              onClick={() => setCurrentView('how-it-works')} 
              className={`hover:text-indigo-600 transition-colors ${currentView === 'how-it-works' ? 'text-indigo-600' : ''}`}
            >
              Como funciona
            </button>
            <button 
              onClick={() => setCurrentView('tips')} 
              className={`hover:text-indigo-600 transition-colors ${currentView === 'tips' ? 'text-indigo-600' : ''}`}
            >
              Dicas
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {state.error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {state.error}
          </div>
        )}
        {renderContent()}
      </main>

      <footer className="mt-auto border-t py-8 text-center text-slate-400 text-xs">
        <div className="flex justify-center gap-4 mb-4 grayscale opacity-50">
           {/* Simple placeholders for brands */}
           <span className="font-bold">ATS COMPLIANT</span>
           <span className="font-bold">LINKEDIN READY</span>
           <span className="font-bold">IA POWERED</span>
        </div>
        <p>&copy; 2024 ATS Master Pro - Inteligência de Carreira com Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
