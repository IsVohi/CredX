// Student Controller

const blockchainService = require('../services/blockchainService');

exports.getStudentCredentials = async (req, res) => {
    try {
        const studentWallet = req.user.address;

        if (!studentWallet) {
            return res.status(400).json({ error: 'Student wallet address missing from user profile.' });
        }

        // Fetch completely real on-chain data via Algorand Indexer
        const credentials = await blockchainService.getStudentCredentials(studentWallet);

        res.status(200).json({
            student: req.user.name,
            wallet: studentWallet,
            credentials: credentials
        });
    } catch (error) {
        console.error('Get Student Credentials Error:', error);
        res.status(500).json({ error: 'Internal server error while fetching credentials' });
    }
};
