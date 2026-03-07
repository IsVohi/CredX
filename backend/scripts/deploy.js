const algosdk = require('algosdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const algodToken = process.env.ALGOD_API_TOKEN || '';
const algodServer = process.env.ALGOD_API_URL || 'https://testnet-api.algonode.cloud';
const algodPort = process.env.ALGOD_PORT || '';
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

const envPath = path.resolve(__dirname, '../../.env');

async function main() {
    let privateKeyBase64 = process.env.ISSUER_PRIVATE_KEY;
    let account;

    if (!privateKeyBase64) {
        console.log("No ISSUER_PRIVATE_KEY found in .env. Generating a new account...");
        account = algosdk.generateAccount();
        const pkBase64 = Buffer.from(account.sk).toString('base64');
        const mnemonic = algosdk.secretKeyToMnemonic(account.sk);

        let envContent = fs.readFileSync(envPath, 'utf8');
        envContent = envContent.replace(/ISSUER_PRIVATE_KEY=.*/g, `ISSUER_PRIVATE_KEY=${pkBase64}`);
        envContent = envContent.replace(/ISSUER_WALLET_ADDRESS=.*/g, `ISSUER_WALLET_ADDRESS=${account.addr}`);
        fs.writeFileSync(envPath, envContent);

        console.log(`\n=== 🚨 ACTION REQUIRED 🚨 ===`);
        console.log(`Created new account: ${account.addr}`);
        console.log(`Please fund this account with TestNet ALGOs using the dispenser:`);
        console.log(`https://bank.testnet.algorand.network/?account=${account.addr}`);
        console.log(`\nAfter funding, run this script again: node scripts/deploy.js`);
        return;
    }

    try {
        const pkBytes = Buffer.from(privateKeyBase64, 'base64');
        account = { addr: algosdk.encodeAddress(pkBytes.slice(32)), sk: pkBytes };
    } catch (e) {
        // Fallback for mnemonic
        account = algosdk.mnemonicToSecretKey(privateKeyBase64);
    }

    const accountInfo = await algodClient.accountInformation(account.addr).do();
    const balance = accountInfo.amount;

    if (balance < 1000000) { // Less than 1 ALGO
        console.log(`\n=== 🚨 INSUFFICIENT FUNDS 🚨 ===`);
        console.log(`Account ${account.addr} has ${balance / 1000000} ALGO.`);
        console.log(`Please fund it here: https://bank.testnet.algorand.network/?account=${account.addr}`);
        console.log(`Then run this script again.`);
        return;
    }

    console.log(`Account ${account.addr} has ${balance / 1000000} ALGO. Proceeding with deployment...`);

    // Read TEAL
    const approvalTeal = fs.readFileSync(path.resolve(__dirname, '../../smart_contracts/credential_minter.py'), 'utf8');
    const clearStateTeal = `#pragma version 8\nint 1\nreturn`;

    const compiledApproval = await algodClient.compile(approvalTeal).do();
    const compiledClear = await algodClient.compile(clearStateTeal).do();

    const approvalProgram = new Uint8Array(Buffer.from(compiledApproval.result, 'base64'));
    const clearProgram = new Uint8Array(Buffer.from(compiledClear.result, 'base64'));

    const params = await algodClient.getTransactionParams().do();

    const txn = algosdk.makeApplicationCreateTxnFromObject({
        from: account.addr,
        suggestedParams: params,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        approvalProgram: approvalProgram,
        clearProgram: clearProgram,
        numLocalInts: 0,
        numLocalByteSlices: 0,
        numGlobalInts: 1,
        numGlobalByteSlices: 1
    });

    const signedTxn = txn.signTxn(account.sk);
    console.log("Submitting transaction...");
    const tx = await algodClient.sendRawTransaction(signedTxn).do();
    console.log("Transaction ID:", tx.txId);

    const confirmation = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);
    const appId = confirmation['application-index'];
    console.log(`\n✅ Smart Contract deployed successfully! App ID: ${appId}`);

    // Fund the App Account so it can issue inner transactions (minting NFTs)
    const appAddress = algosdk.getApplicationAddress(appId);
    console.log(`Funding Application Account (${appAddress}) with 1 ALGO for inner transactions...`);
    const fundTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: account.addr,
        to: appAddress,
        amount: 1000000,
        suggestedParams: params
    });
    const signedFundTxn = fundTxn.signTxn(account.sk);
    const fundTx = await algodClient.sendRawTransaction(signedFundTxn).do();
    await algosdk.waitForConfirmation(algodClient, fundTx.txId, 4);
    console.log("App account funded.");

    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(/ALGORAND_APP_ID=.*/g, `ALGORAND_APP_ID=${appId}`);
    fs.writeFileSync(envPath, envContent);
    console.log(`Updated .env with ALGORAND_APP_ID=${appId}`);
}

main().catch(console.error);
