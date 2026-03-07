const algosdk = require('algosdk');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const algodToken = process.env.ALGOD_API_TOKEN || '';
const algodServer = process.env.ALGOD_API_URL || 'https://testnet-api.algonode.cloud';
const algodPort = process.env.ALGOD_PORT || '';
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

const indexerToken = process.env.ALGOD_INDEXER_TOKEN || '';
const indexerServer = process.env.ALGOD_INDEXER_URL || 'https://testnet-idx.algonode.cloud';
const indexerPort = process.env.ALGOD_INDEXER_PORT || '';
const indexerClient = new algosdk.Indexer(indexerToken, indexerServer, indexerPort);

let issuerAccount = null;
try {
    if (process.env.ISSUER_PRIVATE_KEY) {
        // Parse base64 string back into Uint8Array
        const privateKeyBuffer = Buffer.from(process.env.ISSUER_PRIVATE_KEY, 'base64');
        const privateKeyBytes = new Uint8Array(privateKeyBuffer);

        // Recover public key from the secret key (last 32 bytes of the 64-byte secret key are the public key)
        const publicKeyBytes = privateKeyBytes.slice(32);
        const address = algosdk.encodeAddress(publicKeyBytes);

        issuerAccount = {
            addr: address,
            sk: privateKeyBytes
        };
    }
} catch (error) {
    console.warn("Failed to load ISSUER_PRIVATE_KEY from base64. Minting will be disabled.", error);
}

const APP_ID = process.env.APP_ID ? parseInt(process.env.APP_ID, 10) : 0;

module.exports = {
    algodClient,
    indexerClient,
    issuerAccount,
    APP_ID
};
