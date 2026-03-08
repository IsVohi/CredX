const express = require('express');
const router = express.Router();
const multer = require('multer');
const fraudDetectionService = require('../ai/fraudDetectionService');
const { verifyIssuerRole } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

/**
 * Endpoint for checking document fraud without issuing
 * POST /ai/fraud-check
 */
router.post('/fraud-check', verifyIssuerRole, upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No document uploaded.' });
        }

        const result = await fraudDetectionService.analyzeDocument(req.file.buffer, req.file.originalname);
        res.status(200).json(result);
    } catch (error) {
        console.error('Fraud Check Route Error:', error);
        res.status(500).json({ error: 'Failed to analyze document.' });
    }
});

module.exports = router;
