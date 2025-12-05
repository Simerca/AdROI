import { GoogleGenAI } from "@google/genai";
import { SimulationInputs, SimulationResult } from "../types";

export const analyzeProfitability = async (
  inputs: SimulationInputs,
  results: SimulationResult
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Clé API manquante. Veuillez configurer process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Agis comme un expert senior en User Acquisition (UA) et monétisation mobile.
    Analyse les données suivantes d'une campagne de jeu/app mobile et donne des recommandations stratégiques concrètes en français.
    
    Données d'entrée:
    - Dépenses Pub (Ad Spend): ${inputs.adSpend}€
    - Installations: ${inputs.installs}
    - CPI (Coût par Install): ${results.cpi.toFixed(2)}€
    - ARPDAU: ${inputs.arpdau.toFixed(2)}€
    - Rétention D1: ${inputs.retentionD1}%
    - Rétention D7: ${inputs.retentionD7}%
    - Rétention D30: ${inputs.retentionD30}%

    Résultats Projetés:
    - Point de rentabilité (Break-even): ${results.breakEvenDay ? `Jour ${results.breakEvenDay}` : "Jamais atteint dans les 90 jours"}
    - ROAS J7: ${results.roasD7.toFixed(1)}%
    - ROAS J30: ${results.roasD30.toFixed(1)}%
    - LTV projetée J90: ${results.ltvD90.toFixed(2)}€

    Format de réponse souhaité (Markdown):
    1. **Diagnostic Immédiat**: Est-ce sain ou critique ?
    2. **Analyse des Métriques**:
       - Le CPI est-il trop haut par rapport à l'ARPDAU ?
       - La courbe de rétention est-elle le problème ?
    3. **Plan d'Action**: 3 actions concrètes pour atteindre la rentabilité plus vite (ex: optimiser créas, features de rétention, stratégie de prix).
    
    Sois direct, professionnel et utilise des termes du métier (LTV, Churn, ROAS, Whale, etc.).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text || "Impossible de générer une analyse pour le moment.";
  } catch (error) {
    console.error("Erreur Gemini:", error);
    throw new Error("Une erreur est survenue lors de l'analyse IA.");
  }
};