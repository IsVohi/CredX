const blockchainService = require('./src/services/blockchainService');
const algosdk = require('algosdk');

const studentWallet = "W2QAAKVVOW43YMZ6ZTXXID54NCLPEZDMDM4MXAXODKWDJT75BW6XTTXJMQ";

async function testFetch() {
    try {
        console.log(`Testing getStudentCredentials for ${studentWallet}`);
        const credentials = await blockchainService.getStudentCredentials(studentWallet);
        console.log('Found Credentials Count:', credentials.length);
        console.log('Credentials Details:', JSON.stringify(credentials, null, 2));
    } catch (e) {
        console.error('Error:', e.message);
    }
}

testFetch();
