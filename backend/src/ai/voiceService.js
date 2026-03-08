/**
 * AI Voice Summary Service
 * Generates audio narration for credential metadata using Text-to-Speech.
 */

const axios = require('axios');

/**
 * Generates audio narration for a given text.
 * @param {String} text - The text to narrate
 * @returns {Promise<Buffer>} - Audio file buffer
 */
exports.generateCredentialAudio = async (text) => {
    console.log(`[AI VOICE] Generating narration for text: ${text.substring(0, 50)}...`);

    // ELEVENLABS API INTEGRATION (HACKATHON PATTERN)
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Default "Rachel" voice

    if (!apiKey) {
        console.warn('[AI VOICE] No ElevenLabs API Key found. Using browser-side TTS mock fallback.');
        // In a real hackathon backend without keys, we'd return a specific error or a pre-recorded mock.
        // For this demo, we'll signal the frontend to use the Web Speech API if the backend fails.
        throw new Error('NO_API_KEY');
    }

    try {
        const response = await axios({
            method: 'post',
            url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            data: {
                text: text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5
                }
            },
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer'
        });

        return Buffer.from(response.data);
    } catch (error) {
        console.error('[AI VOICE ERROR]', error.response?.data?.toString() || error.message);
        throw error;
    }
};
