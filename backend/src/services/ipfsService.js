// IPFS Service
// Handles file uploads and metadata pushing to IPFS using Pinata API

const axios = require('axios');
const FormData = require('form-data');
const { ipfsApiKey, ipfsApiSecret, ipfsGateway } = require('../config/ipfs');

/**
 * Uploads a credential document (e.g., PDF) to IPFS via Pinata
 * @param {Buffer | ReadStream} fileStream - The file data
 * @param {string} filename - The name of the file
 * @returns {Promise<{cid: string, url: string}>}
 */
exports.uploadDocument = async (fileStream, filename = 'credential.pdf') => {
    if (!ipfsApiKey || !ipfsApiSecret) {
        throw new Error("IPFS API credentials are not configured.");
    }

    const formData = new FormData();
    formData.append('file', fileStream, { filename });

    const metadata = JSON.stringify({
        name: filename,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 1,
    });
    formData.append('pinataOptions', options);

    try {
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'pinata_api_key': ipfsApiKey,
                'pinata_secret_api_key': ipfsApiSecret,
            }
        });

        const cid = response.data.IpfsHash;
        return {
            cid: cid,
            url: `ipfs://${cid}`,
            gatewayUrl: `${ipfsGateway}${cid}`
        };
    } catch (error) {
        throw new Error(`Failed to upload document to IPFS: ${error.message}`);
    }
};

/**
 * Uploads ARC-3 JSON Metadata to IPFS via Pinata
 * @param {Object} metadataObject - The ARC-3 compliant JSON metadata
 * @returns {Promise<{cid: string, url: string}>}
 */
exports.uploadMetadata = async (metadataObject) => {
    if (!ipfsApiKey || !ipfsApiSecret) {
        throw new Error("IPFS API credentials are not configured.");
    }

    const data = JSON.stringify({
        pinataOptions: {
            cidVersion: 1
        },
        pinataMetadata: {
            name: metadataObject.name ? `${metadataObject.name}_metadata.json` : 'arc3_metadata.json',
        },
        pinataContent: metadataObject
    });

    try {
        const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
            headers: {
                'Content-Type': 'application/json',
                'pinata_api_key': ipfsApiKey,
                'pinata_secret_api_key': ipfsApiSecret,
            }
        });

        const cid = response.data.IpfsHash;
        return {
            cid: cid,
            url: `ipfs://${cid}`,
            gatewayUrl: `${ipfsGateway}${cid}`
        };
    } catch (error) {
        throw new Error(`Failed to upload metadata to IPFS: ${error.message}`);
    }
};
