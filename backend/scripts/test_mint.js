const blockchainService = require('../src/services/blockchainService');
const algosdk = require('algosdk');

async function testMint() {
    const studentWallet = "HXN2YYVTQRMYNETLO2Y2TVYE472XDTGR7XWQ2QTKE5SCKN7EPO67FEDSPY"; // Vikas student wallet
    const metadataCID = "QmTest1234567890";

    console.log(`Attempting to mint credential for ${studentWallet}...`);
    try {
        const result = await blockchainService.mintCredentialNFT(studentWallet, metadataCID);
        console.log("✅ Minting Successful!");
        console.log("Transaction ID:", result.txId);
        console.log("Asset ID:", result.assetId);
    } catch (error) {
        console.error("❌ Minting Failed!");
        console.error(error);
    }
}

testMint();
