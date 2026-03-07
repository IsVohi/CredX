const express = require('express');
const router = express.Router();
const issuerController = require('../controllers/issuerController');
const { verifyAdminRole, verifyIssuerRole } = require('../middleware/authMiddleware');

// Route to get all verified institutions
router.get('/', issuerController.getInstitutions);

// Route for an institution to get its own profile and metrics
router.get('/me', verifyIssuerRole, issuerController.getIssuerProfile);

// Route for an institution to register itself
router.post('/register', issuerController.registerIssuer);

// Route for an admin to approve an institution
router.post('/approve', verifyAdminRole, issuerController.approveIssuer);

// Route to get verification status of an issuer
router.get('/:address/status', issuerController.getIssuerStatus);

module.exports = router;
