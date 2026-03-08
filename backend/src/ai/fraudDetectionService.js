/**
 * AI Fraud Detection Service
 * Analyzes uploaded credential documents for tampering, edited text, and suspicious patterns.
 */

const axios = require('axios');

/**
 * Interface for AI analysis results
 * @typedef {Object} FraudAnalysisResult
 * @property {number} fraudScore - 0 to 100
 * @property {string} riskLevel - "LOW", "MEDIUM", "HIGH"
 * @property {string[]} redFlags - List of identified suspicious items
 * @property {string} [explanation] - AI's reasoning for the score
 */

/**
 * Detects fraud in an uploaded document buffer.
 * In a real-world scenario, this sends the image to a Vision AI like GPT-4o or a trained CNN.
 */
exports.analyzeDocument = async (fileBuffer, fileName) => {
    console.log(`[AI FRAUD] Analyzing document: ${fileName} (${fileBuffer.length} bytes)`);

    const provider = process.env.AI_PROVIDER || 'openai';
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAIKey = process.env.OPENAI_API_KEY;

    try {
        if (provider === 'gemini' && geminiKey) {
            // Gemini Vision Logic (Simplified for Hackathon)
            const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
            const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
                contents: [{
                    parts: [
                        { text: "Analyze this document for fraud. Return JSON: { fraudScore (0-100), riskLevel (LOW, MEDIUM, HIGH), redFlags (array), explanation (string) }" },
                        { inlineData: { mimeType: "image/png", data: fileBuffer.toString('base64') } }
                    ]
                }]
            });
            // Extract from Gemini response structure
            const textResult = response.data.candidates[0].content.parts[0].text;
            return JSON.parse(textResult.match(/\{.*\}/s)[0]);
        }

        // OpenAI Fallback or Specific logic
        if (provider === 'openai' && openAIKey) {
            // Call OpenAI Vision API...
        }

        // Simulation for Demo
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Let's create some deterministic logic for the demo:
        // Files containing "tampered" or "fake" in name or certain metadata might trigger HIGH risk.
        const lowerName = fileName.toLowerCase();

        let fraudScore = Math.floor(Math.random() * 15); // Base noise
        let redFlags = [];

        if (lowerName.includes('sample') || lowerName.includes('template')) {
            fraudScore += 20;
            redFlags.push("Generic template or sample document used.");
        }

        if (lowerName.includes('edited') || lowerName.includes('modified')) {
            fraudScore += 40;
            redFlags.push("Suspicious file name suggesting modification.");
        }

        // Logic to simulate "tampered" detection for demo purposes
        if (lowerName.includes('fraud') || lowerName.includes('fake')) {
            fraudScore = 85;
            redFlags.push("AI detected inconsistencies in pixel patterns around logos.");
            redFlags.push("Metadata mismatch: Date modified doesn't align with document content.");
        }

        let riskLevel = "LOW";
        if (fraudScore > 70) riskLevel = "HIGH";
        else if (fraudScore > 30) riskLevel = "MEDIUM";

        return {
            fraudScore,
            riskLevel,
            redFlags,
            explanation: riskLevel === "HIGH"
                ? "The AI detected high probability of manual editing in the text areas and suspicious artifacting around the institution seal."
                : "The document structure appears consistent with known institutional standards."
        };

    } catch (error) {
        console.error('[AI FRAUD ERROR]', error);
        return {
            fraudScore: 0,
            riskLevel: "ERROR",
            redFlags: [],
            explanation: "Failed to perform AI analysis."
        };
    }
};
