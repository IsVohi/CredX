const express = require('express');
const router = express.Router();
const credentialController = require('../controllers/credentialController');
const { verifyIssuerRole } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for in-memory file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /credentials/issue
// Uploads document to IPFS, creates ARC-3 metadata, mints NFT
router.post('/issue', verifyIssuerRole, upload.single('document'), credentialController.issueCredential);

// GET /credentials/:assetId
// Fetch credential details from blockchain and IPFS metadata
router.get('/:assetId', credentialController.getCredential);

// POST /credentials/:assetId/revoke
// Allows an issuer to revoke a credential
router.post('/:assetId/revoke', verifyIssuerRole, credentialController.revokeCredential);

// GET /credentials/:assetId/verify
// Public endpoint that verifies a credential exists, issuer is verified, status is ACTIVE, metadata is valid
router.get('/:assetId/verify', credentialController.verifyCredential);

// GET /credentials/student/:address
// Public lookup of all credentials for a specific student
router.get('/student/:address', credentialController.getPublicStudentCredentialsByAddress);

module.exports = router;
