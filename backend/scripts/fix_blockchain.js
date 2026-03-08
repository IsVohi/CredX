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
    const minterAppId = parseInt(process.env.ALGORAND_APP_ID, 10);
    let registryAppId = parseInt(process.env.ALGORAND_REGISTRY_APP_ID, 10);

    console.log(`Checking Minter App ID: ${minterAppId}`);
    console.log(`Target Registry App ID: ${registryAppId}`);

    const privateKeyBase64 = process.env.ISSUER_PRIVATE_KEY;
    const pkBytes = Buffer.from(privateKeyBase64, 'base64');
    const account = { addr: algosdk.encodeAddress(pkBytes.slice(32)), sk: pkBytes };

    const params = await algodClient.getTransactionParams().do();

    if (!registryAppId) {
        console.log("No Registry App ID found in .env. Deploying fresh...");
        const approvalTeal = fs.readFileSync(path.resolve(__dirname, '../../smart_contracts/issuer_registry.teal'), 'utf8');
        const clearStateTeal = `#pragma version 8\nint 1\nreturn`;

        const compiledApproval = await algodClient.compile(approvalTeal).do();
        const compiledClear = await algodClient.compile(clearStateTeal).do();

        const createTxn = algosdk.makeApplicationCreateTxnFromObject({
            from: account.addr,
            suggestedParams: params,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
            approvalProgram: new Uint8Array(Buffer.from(compiledApproval.result, 'base64')),
            clearProgram: new Uint8Array(Buffer.from(compiledClear.result, 'base64')),
            numLocalInts: 0,
            numLocalByteSlices: 0,
            numGlobalInts: 30,
            numGlobalByteSlices: 20
        });

        const signedCreate = createTxn.signTxn(account.sk);
        const { txId: createTxId } = await algodClient.sendRawTransaction(signedCreate).do();
        const createConf = await algosdk.waitForConfirmation(algodClient, createTxId, 4);
        registryAppId = createConf['application-index'];
        console.log(`✅ Registry Deployed! App ID: ${registryAppId}`);

        let envContent = fs.readFileSync(envPath, 'utf8');
        if (!envContent.includes('ALGORAND_REGISTRY_APP_ID')) {
            envContent += `\nALGORAND_REGISTRY_APP_ID=${registryAppId}`;
        } else {
            envContent = envContent.replace(/ALGORAND_REGISTRY_APP_ID=.*/g, `ALGORAND_REGISTRY_APP_ID=${registryAppId}`);
        }
        fs.writeFileSync(envPath, envContent);
    } else {
        console.log("Using existing Registry App ID from .env");
    }

    // 2. Set Registry in Minter
    console.log(`Linking Registry (${registryAppId}) to Minter (${minterAppId})...`);
    const setRegTxn = algosdk.makeApplicationNoOpTxnFromObject({
        from: account.addr,
        appIndex: minterAppId,
        appArgs: [
            new Uint8Array(Buffer.from("set_registry")),
            algosdk.encodeUint64(registryAppId)
        ],
        suggestedParams: params
    });
    const signedSetReg = setRegTxn.signTxn(account.sk);
    await algodClient.sendRawTransaction(signedSetReg).do();
    await algosdk.waitForConfirmation(algodClient, setRegTxn.txID(), 4);
    console.log("✅ Registry linked in Minter.");

    // 3. Register and Verify the Issuer
    console.log(`Registering and Approving Issuer (${account.addr}) in Registry...`);

    // Register
    const regTxn = algosdk.makeApplicationNoOpTxnFromObject({
        from: account.addr,
        appIndex: registryAppId,
        appArgs: [
            new Uint8Array(Buffer.from("register")),
            new Uint8Array(Buffer.from(process.env.ISSUER_NAME || "CredX Institution"))
        ],
        suggestedParams: params
    });
    await algodClient.sendRawTransaction(regTxn.signTxn(account.sk)).do();
    await algosdk.waitForConfirmation(algodClient, regTxn.txID(), 4);

    // Approve
    const appTxn = algosdk.makeApplicationNoOpTxnFromObject({
        from: account.addr,
        appIndex: registryAppId,
        appArgs: [
            new Uint8Array(Buffer.from("approve")),
            algosdk.decodeAddress(account.addr).publicKey
        ],
        suggestedParams: params
    });
    await algodClient.sendRawTransaction(appTxn.signTxn(account.sk)).do();
    await algosdk.waitForConfirmation(algodClient, appTxn.txID(), 4);
    console.log("✅ Issuer registered and approved in Registry.");

    console.log("\n=== Blockchain Setup Complete ===");
    console.log(`Minter: ${minterAppId}`);
    console.log(`Registry: ${registryAppId}`);
}

main().catch(err => {
    console.error("Setup failed:", err);
    process.exit(1);
});
