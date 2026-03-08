// Credential Controller

const ipfsService = require('../services/ipfsService');
const blockchainService = require('../services/blockchainService');
const metadataBuilder = require('../utils/metadataBuilder');
const { fetchFromIPFS } = require('../utils/ipfsFetch');
const fraudDetectionService = require('../ai/fraudDetectionService');
const voiceService = require('../ai/voiceService');
const credentialInsightService = require('../ai/credentialInsightService');

/**
 * Issue a new Credential
 * POST /credentials/issue
 */
exports.issueCredential = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Credential document file is required.' });
        }

        const {
            studentWallet,
            studentName,
            credentialTitle,
            programName,
            issueDate,
            expiryDate,
        } = req.body;

        if (!studentWallet || !studentName || !credentialTitle) {
            return res.status(400).json({ error: 'Missing required fields: studentWallet, studentName, or credentialTitle.' });
        }

        // --- NEW: AI Fraud Detection ---
        const { forceIssue } = req.body;
        const fraudAnalysis = await fraudDetectionService.analyzeDocument(req.file.buffer, req.file.originalname);

        if (fraudAnalysis.riskLevel === 'HIGH' && !forceIssue) {
            return res.status(422).json({
                error: 'Suspicious document detected.',
                warning: 'The AI fraud detection system flagged this document as potentially tampered with.',
                analysis: fraudAnalysis
            });
        }
        // ------------------------------

        // 1. Upload credential document to IPFS
        const documentUploadResult = await ipfsService.uploadDocument(req.file.buffer, req.file.originalname);

        // Use a dummy IPFS hash for image representation (ARC-3 expects an image)
        const imageCid = documentUploadResult.cid;

        // Use authenticated issuer data
        const issuerName = req.user?.name || "CredX Verified Institution";
        const issuerWallet = req.user?.address || "ISSUER_PLACEHOLDER_ADDRESS";

        // 2. Build ARC-3 JSON Metadata
        const metadataObject = metadataBuilder.buildARC3Metadata({
            name: credentialTitle,
            description: `${credentialTitle} - Issued by ${issuerName}`,
            imageCid: imageCid,
            issuer_wallet: issuerWallet,
            student_wallet: studentWallet,
            student_name: studentName,
            program_name: programName,
            issued_timestamp: issueDate,
            expiry_timestamp: expiryDate,
            credential_status: 'ACTIVE',
            ipfs_document_cid: documentUploadResult.cid
        });

        // 3. Upload ARC-3 Metadata JSON to IPFS
        const metadataUploadResult = await ipfsService.uploadMetadata(metadataObject);

        // 4. Call Blockchain Service to Mint NFT
        // Using the metadata CID as both URI extension and hash seed.
        // In full production, a true SHA256 of the JSON bytes should be sent.
        const mintResult = await blockchainService.mintCredentialNFT(studentWallet, metadataUploadResult.cid);

        const metadataCid = metadataUploadResult.cid;
        const documentCid = documentUploadResult.cid;

        res.status(201).json({
            message: 'Credential successfully issued.',
            assetId: mintResult.assetId,
            transactionId: mintResult.txId,
            metadataCid,
            documentCid,
            fraudAnalysis // Include analysis in success response too
        });

    } catch (error) {
        console.error('Issue Credential Error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get Credential Details
 * GET /credentials/:assetId
 */
exports.getCredential = async (req, res) => {
    try {
        const assetId = parseInt(req.params.assetId, 10);
        if (isNaN(assetId)) {
            return res.status(400).json({ error: 'Invalid assetId provided.' });
        }

        // Fetch on-chain data
        const credentialOnChain = await blockchainService.getCredential(assetId);

        let metadata = null;
        let documentUrl = null;

        // Optionally, parse the IPFS URI to fetch the JSON metadata
        if (credentialOnChain.url && credentialOnChain.url.startsWith('ipfs://')) {
            const cid = credentialOnChain.url.split('ipfs://')[1];
            try {
                const gateway = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
                metadata = await fetchFromIPFS(cid);
                documentUrl = metadata.properties && metadata.properties.ipfs_document
                    ? metadata.properties.ipfs_document.replace('ipfs://', gateway) : null;
            } catch (ipfsError) {
                console.warn('Failed to fetch metadata from IPFS directly during getCredential', ipfsError.message);
            }
        }

        // --- NEW: AI Insights ---
        let aiInsights = null;
        if (metadata) {
            aiInsights = await credentialInsightService.generateInsights(
                metadata,
                { name: metadata.properties?.issuer_name || "Verified Institution", wallet: credentialOnChain.creator }
            );
        }
        // -------------------------

        res.status(200).json({
            assetId,
            onChainStatus: credentialOnChain.statusStr,
            creator: credentialOnChain.creator,
            metadata,
            documentUrl,
            aiInsights
        });

    } catch (error) {
        console.error('Get Credential Error:', error);
        if (error.message.includes('404')) {
            return res.status(404).json({ error: `Credential with ID ${req.params.assetId} not found on the blockchain.` });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * Revoke a Credential
 * POST /credentials/:assetId/revoke
 */
exports.revokeCredential = async (req, res) => {
    try {
        const assetId = parseInt(req.params.assetId, 10);
        if (isNaN(assetId)) {
            return res.status(400).json({ error: 'Invalid assetId provided.' });
        }

        const result = await blockchainService.revokeCredential(assetId);

        res.status(200).json({
            message: 'Credential successfully revoked.',
            assetId,
            transactionId: result.txId
        });

    } catch (error) {
        console.error('Revoke Credential Error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Public Verification of Credential
 * GET /credentials/:assetId/verify
 */
exports.verifyCredential = async (req, res) => {
    try {
        const assetId = parseInt(req.params.assetId, 10);
        if (isNaN(assetId)) {
            return res.status(400).json({ error: 'Invalid assetId provided.' });
        }

        // In a real application, you would pass the expected metadata hash to the blockchain verification function
        // to assert the NFT constraints securely on the smart contract side.
        // For standard public API checks, verifyCredential relies on the Box states
        const verificationResult = await blockchainService.verifyCredential(assetId);

        // --- NEW: AI Insights ---
        let aiInsights = null;
        const gateway = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
        let metadata = null;

        if (verificationResult.isValid && verificationResult.assetData.url && verificationResult.assetData.url.startsWith('ipfs://')) {
            const cid = verificationResult.assetData.url.split('ipfs://')[1];
            try {
                metadata = await fetchFromIPFS(cid);
                aiInsights = await credentialInsightService.generateInsights(
                    metadata,
                    { name: metadata.properties?.issuer_name || "Verified Institution", wallet: verificationResult.assetData.creator }
                );
            } catch (err) {
                console.warn('AI Insights failed during verification', err.message);
            }
        }
        // -------------------------

        res.status(200).json({
            verified: verificationResult.isValid,
            status: verificationResult.isValid ? 'VALID' : 'INVALID',
            details: {
                assetId: verificationResult.assetData.assetId,
                onchainStatus: verificationResult.assetData.statusStr,
                creator: verificationResult.assetData.creator,
                metadata: metadata // Include metadata in verify response for frontend convenience
            },
            aiInsights
        });

    } catch (error) {
        console.error('Verify Credential Error:', error);
        res.status(500).json({
            verified: false,
            status: 'ERROR',
            error: error.message
        });
    }
};

/**
 * Public lookup of student credentials by wallet address
 * GET /credentials/student/:address
 */
exports.getPublicStudentCredentialsByAddress = async (req, res) => {
    try {
        const { address } = req.params;
        if (!address) {
            return res.status(400).json({ error: 'Wallet address is required.' });
        }

        const credentials = await blockchainService.getStudentCredentials(address);

        res.status(200).json({
            address,
            credentials
        });
    } catch (error) {
        console.error('Public Student Lookup Error:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Generate Voice Summary
 * GET /credentials/:assetId/voice
 */
exports.getVoiceSummary = async (req, res) => {
    try {
        const { assetId } = req.params;

        // 1. Fetch credential data
        const credentialOnChain = await blockchainService.getCredential(parseInt(assetId));
        if (!credentialOnChain) {
            return res.status(404).json({ error: 'Credential not found' });
        }

        // 2. Fetch metadata from IPFS
        let metadata = null;
        if (credentialOnChain.url && credentialOnChain.url.startsWith('ipfs://')) {
            const cid = credentialOnChain.url.split('ipfs://')[1];
            try {
                metadata = await fetchFromIPFS(cid);
            } catch (e) {
                console.warn('IPFS fetch failed for voice summary', e.message);
            }
        }

        // 3. Prepare text for narration
        // We prioritize the AI analytical summary if available, otherwise fallback to metadata description
        let narrationText = "";

        try {
            // Fetch/Generate insights if not already present
            const insights = await credentialInsightService.generateInsights(
                metadata,
                { name: metadata.properties?.issuer_name || "Verified Institution", wallet: credentialOnChain.creator }
            );

            if (insights && insights.analysisSummary) {
                narrationText = `Here is the AI analysis for this credential. ${insights.analysisSummary}`;
            }
        } catch (insightErr) {
            console.warn('Insight generation failed for voice summary, falling back to basic narration', insightErr.message);
        }

        if (!narrationText) {
            const studentName = (metadata && metadata.name) || 'Student';
            const title = (metadata && (metadata.properties?.program_name || metadata.name)) || 'Credential';
            const issuer = (metadata && metadata.properties?.issuer_name) || 'a Verified Institution';
            narrationText = `Verified credential for ${studentName}. This ${title} was issued by ${issuer} and has been authenticated on the blockchain.`;
        }

        // 4. Generate audio
        try {
            const audioBuffer = await voiceService.generateCredentialAudio(narrationText);

            res.set({
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length,
                'Cache-Control': 'public, max-age=3600'
            });

            res.send(audioBuffer);
        } catch (voiceError) {
            if (voiceError.message === 'NO_API_KEY') {
                return res.status(403).json({
                    error: 'Voice generation requires an API Key.',
                    fallback: true
                });
            }
            throw voiceError;
        }

    } catch (error) {
        console.error('Voice Summary Error:', error);
        res.status(500).json({ error: 'Failed to generate voice summary.' });
    }
};

/**
 * Get AI-generated Credential Insights
 * GET /credentials/:assetId/insights
 */
exports.getCredentialInsights = async (req, res) => {
    try {
        const { assetId } = req.params;

        // 1. Fetch on-chain data
        const credentialOnChain = await blockchainService.getCredential(parseInt(assetId));

        // 2. Fetch metadata from IPFS
        let metadata = null;
        if (credentialOnChain.url && credentialOnChain.url.startsWith('ipfs://')) {
            const cid = credentialOnChain.url.split('ipfs://')[1];
            try {
                metadata = await fetchFromIPFS(cid);
            } catch (e) {
                console.warn('IPFS fetch failed for insights', e.message);
            }
        }

        if (!metadata) {
            return res.status(404).json({ error: 'Metadata not found for insights generation.' });
        }

        // 3. Generate insights
        const insights = await credentialInsightService.generateInsights(
            metadata,
            { name: metadata.properties?.issuer_name || "Verified Institution", wallet: credentialOnChain.creator }
        );

        res.status(200).json(insights);
    } catch (error) {
        console.error('Credential Insights Error:', error);
        res.status(500).json({ error: 'Failed to generate credential insights.' });
    }
};
