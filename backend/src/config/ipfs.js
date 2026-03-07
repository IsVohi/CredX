require('dotenv').config();

// IPFS configuration targeting Pinata API
const ipfsApiKey = process.env.IPFS_API_KEY || '';
const ipfsApiSecret = process.env.IPFS_API_SECRET || '';
const ipfsGateway = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

module.exports = {
    ipfsApiKey,
    ipfsApiSecret,
    ipfsGateway
};
