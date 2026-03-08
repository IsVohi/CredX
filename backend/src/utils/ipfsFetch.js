/**
 * IPFS Fetch Utility
 * Fetches content from IPFS with fallback gateways to handle rate limits (429) and timeouts.
 */
const axios = require('axios');

const getGateways = () => [
    process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/',
    'https://ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://dweb.link/ipfs/',
];

const TIMEOUT_MS = 15000;

/**
 * Fetch JSON from IPFS by CID. Tries multiple gateways on 429 or timeout.
 * @param {string} cid - IPFS content ID (without ipfs:// prefix)
 * @returns {Promise<any>} Parsed JSON
 */
async function fetchFromIPFS(cid) {
    const normalizedCid = cid.replace(/^ipfs:\/\//, '');
    let lastError;

    for (const base of getGateways()) {
        const url = `${base.replace(/\/$/, '')}/${normalizedCid}`;
        try {
            const response = await axios.get(url, { timeout: TIMEOUT_MS });
            return response.data;
        } catch (err) {
            lastError = err;
            const status = err.response?.status;
            const isRetryable = status === 429 || status === 503 || err.code === 'ECONNABORTED' || err.message?.includes('timeout');
            if (!isRetryable) throw err;
        }
    }
    throw lastError;
}

module.exports = { fetchFromIPFS };
