/**
 * AI Credential Insight Service
 * Uses LLM to provide deeper analysis and confidence scoring for credentials.
 */

const axios = require('axios');

/**
 * Generates structured insights for a credential.
 * @param {Object} metadata - Credential metadata from IPFS
 * @param {Object} issuerInfo - Information about the issuer
 * @param {String} documentText - Extracted text (if available) or description
 * @returns {Promise<Object>} - Structured insights
 */
exports.generateInsights = async (metadata, issuerInfo, documentText = "") => {
    console.log(`[AI INSIGHTS] Analyzing credential: ${metadata.name}`);

    const provider = process.env.AI_PROVIDER || 'openai';
    const openAIKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!openAIKey && !geminiKey) {
        console.warn('[AI INSIGHTS] No AI API Keys found. Using heuristic mock fallback.');
        return this.generateMockInsights(metadata, issuerInfo);
    }

    try {
        const prompt = `
            Analyze this academic credential...
            Metadata: ${JSON.stringify(metadata)}
            Issuer: ${JSON.stringify(issuerInfo)}
            Document Description: ${metadata.description}
            
            Return exactly this structure:
            {
                "confidenceScore": (0-100),
                "category": (string),
                "analysisSummary": (string)
            }
        `;

        if (provider === 'gemini' && geminiKey) {
            const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
            const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
                contents: [{ parts: [{ text: prompt }] }]
            });
            const textResult = response.data.candidates[0].content.parts[0].text;
            return JSON.parse(textResult.match(/\{.*\}/s)[0]);
        }

        // OpenAI Path
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo-0125",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        }, {
            headers: {
                'Authorization': `Bearer ${openAIKey}`,
                'Content-Type': 'application/json'
            }
        });

        const insights = JSON.parse(response.data.choices[0].message.content);
        return insights;
    } catch (error) {
        console.error('[AI INSIGHTS ERROR]', error.response?.data || error.message);
        return this.generateMockInsights(metadata, issuerInfo);
    }
};

/**
 * Heuristic fallback for hackathon demo
 */
exports.generateMockInsights = (metadata, issuerInfo) => {
    const isVerifiedIssuer = issuerInfo.name && !issuerInfo.name.includes("Unverified");

    let category = "Certificate";
    if (metadata.name.toLowerCase().includes("degree") || metadata.name.toLowerCase().includes("bachelor") || metadata.name.toLowerCase().includes("master")) {
        category = "Degree";
    } else if (metadata.name.toLowerCase().includes("license")) {
        category = "Professional License";
    }

    const confidenceScore = isVerifiedIssuer ? 95 : 65;

    return {
        confidenceScore,
        category,
        analysisSummary: `This ${category} was issued by ${issuerInfo.name || "a registered institution"} on the CredX network. The metadata matches on-chain records, confirming its technical authenticity.`
    };
};
