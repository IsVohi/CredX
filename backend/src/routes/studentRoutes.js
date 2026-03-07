const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyStudentRole } = require('../middleware/authMiddleware');

// Route to get all credentials for the logged-in student
router.get('/credentials', verifyStudentRole, studentController.getStudentCredentials);

module.exports = router;
