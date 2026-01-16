
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<AnalysisResult> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Chave de API não configurada. Verifique se VITE_GEMINI_API_KEY está definida no .env (local) ou nas variáveis da Vercel.");
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Aja como um sistema de análise de RH (ATS). Sua tarefa é comparar um currículo com uma descrição de vaga.
    
    VAGA: ${jobDescription}
    CURRÍCULO: ${resumeText}`,
    config: {
      systemInstruction: `Você é um especialista em recrutamento e seleção (ATS). 
      Compare o currículo com a descrição da vaga. 
      Identifique as lacunas de competências e forneça uma pontuação realista.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: {
            type: Type.INTEGER,
            description: "Aderência do candidato de 0 a 100",
          },
          missingKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Palavras-chave técnicas (skills) que estão na vaga mas NÃO estão no currículo",
          },
          matchAnalysis: {
            type: Type.STRING,
            description: "Análise curta sobre a compatibilidade",
          },
          recommendation: {
            type: Type.STRING,
            description: "Resumo de 2 frases com conselhos de melhoria",
          }
        },
        required: ["score", "missingKeywords", "matchAnalysis", "recommendation"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Não foi possível obter uma resposta do modelo.");
  }

  try {
    return JSON.parse(text) as AnalysisResult;
  } catch (err) {
    console.error("Erro ao parsear JSON:", err);
    throw new Error("Erro na formatação dos dados de análise.");
  }
};
