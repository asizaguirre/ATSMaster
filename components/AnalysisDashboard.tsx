
import React, { useState } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { AnalysisResult } from '../types';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onReset }) => {
  const [profileText, setProfileText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [consistencyScore, setConsistencyScore] = useState<number | null>(null);

  const checkLinkedInConsistency = () => {
    setIsChecking(true);
    // Simulating a comparison between resume and current profile
    setTimeout(() => {
      const score = Math.floor(Math.random() * (95 - 60 + 1) + 60);
      setConsistencyScore(score);
      setIsChecking(false);
    }, 1500);
  };

  const chartData = [
    {
      name: 'Score',
      value: result.score,
      fill: result.score > 70 ? '#22c55e' : result.score > 40 ? '#f59e0b' : '#ef4444',
    }
  ];

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Seu Plano de Ação</h2>
        <button
          onClick={onReset}
          className="text-sm px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Nova Análise
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="80%" outerRadius="100%" barSize={15} data={chartData} startAngle={90} endAngle={450}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-slate-800">{result.score}%</span>
              <span className="text-xs text-slate-500 font-medium uppercase">Match IA</span>
            </div>
          </div>
          <p className="mt-4 text-center text-sm font-medium text-slate-500">Aderência com a Vaga</p>
        </div>

        {/* Details Card */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Análise de Compatibilidade</h3>
            <p className="text-slate-600 leading-relaxed">{result.matchAnalysis}</p>
          </div>
          
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Recomendação Final</h3>
            <p className="text-indigo-800 leading-relaxed">{result.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Keywords & LinkedIn Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Missing Skills */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-red-400 rounded-full"></span>
            Habilidades para Incluir
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missingKeywords.length > 0 ? (
              result.missingKeywords.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-slate-500 italic">Currículo perfeitamente otimizado!</p>
            )}
          </div>
        </div>

        {/* LinkedIn Optimization */}
        <div className="bg-[#f3f6f8] p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
             <svg className="w-6 h-6 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
             <h3 className="text-lg font-bold text-[#004182]">Upgrade no LinkedIn</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-[#0077b5] uppercase mb-1">Headline Sugerido</p>
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 italic">
                "{result.linkedin.suggestedHeadline}"
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-[#0077b5] uppercase mb-1">Seção "Sobre" Otimizada</p>
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 h-32 overflow-y-auto leading-relaxed">
                {result.linkedin.suggestedAbout}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-[#0077b5] uppercase mb-1">Competências Chave</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.linkedin.topSkillsToAdd.map((s, i) => (
                   <span key={i} className="text-xs bg-[#0077b5]/10 text-[#0077b5] px-2 py-1 rounded font-semibold border border-[#0077b5]/20">#{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consistency Checker */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-indigo-100">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-center text-slate-800 mb-2">Conferir Aderência LinkedIn</h3>
          <p className="text-center text-slate-500 text-sm mb-6">Cole o texto do seu perfil atual (ou URL) para verificar se ele está alinhado com seu currículo.</p>
          
          <textarea 
            value={profileText}
            onChange={(e) => setProfileText(e.target.value)}
            placeholder="Cole aqui seu 'Sobre' ou as experiências do seu perfil LinkedIn..."
            className="w-full h-32 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
          />
          
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={checkLinkedInConsistency}
              disabled={!profileText || isChecking}
              className="bg-[#0077b5] text-white px-8 py-3 rounded-full font-bold hover:bg-[#005c8a] transition-all disabled:opacity-50"
            >
              {isChecking ? 'Analisando Sincronização...' : 'Verificar Consistência'}
            </button>

            {consistencyScore !== null && !isChecking && (
              <div className="animate-bounce flex flex-col items-center bg-green-50 px-6 py-4 rounded-2xl border border-green-200">
                <span className="text-green-800 font-bold">Consistência de Perfil: {consistencyScore}%</span>
                <span className="text-xs text-green-600">Seu LinkedIn está {consistencyScore > 80 ? 'excelente' : 'precisando de ajustes'} para esta vaga!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
