
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Aja como um sistema de análise de RH (ATS) e especialista em branding pessoal. 
    Compare o currículo com a descrição da vaga e forneça otimizações para o LinkedIn.
    
    VAGA: ${jobDescription}
    CURRÍCULO: ${resumeText}`,
    config: {
      systemInstruction: `Você é um especialista em recrutamento e seleção (ATS) e especialista em otimização de perfis LinkedIn. 
      Compare o currículo com a vaga e forneça uma pontuação realista.
      Além da análise de compatibilidade, gere sugestões específicas para o LinkedIn que aumentem a visibilidade do candidato para esta vaga específica.`,
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
            description: "Palavras-chave técnicas que estão na vaga mas NÃO estão no currículo",
          },
          matchAnalysis: {
            type: Type.STRING,
            description: "Análise curta sobre a compatibilidade",
          },
          recommendation: {
            type: Type.STRING,
            description: "Resumo de 2 frases com conselhos de melhoria",
          },
          linkedin: {
            type: Type.OBJECT,
            properties: {
              suggestedHeadline: {
                type: Type.STRING,
                description: "Título otimizado para o LinkedIn (Headline) usando palavras-chave da vaga",
              },
              suggestedAbout: {
                type: Type.STRING,
                description: "Sugestão de texto para a seção 'Sobre' do LinkedIn",
              },
              topSkillsToAdd: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "As 5 principais competências para listar no LinkedIn",
              }
            },
            required: ["suggestedHeadline", "suggestedAbout", "topSkillsToAdd"]
          }
        },
        required: ["score", "missingKeywords", "matchAnalysis", "recommendation", "linkedin"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Não foi possível obter uma resposta do modelo.");

  try {
    return JSON.parse(text) as AnalysisResult;
  } catch (err) {
    console.error("Erro ao parsear JSON:", err);
    throw new Error("Erro na formatação dos dados de análise.");
  }
};
