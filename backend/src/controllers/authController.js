const jwt = require('jsonwebtoken');

// In-memory user store for hackathon demonstration.
// In production, this would be a database like MongoDB/Postgres.
// Updated to use Auth0 "sub" as the unique identifier.
const users = {
    'auth0|admin_id': { // Example structure
        name: 'Stanford University',
        role: 'ISSUER',
        address: 'STANFORD_ISSUER_WALLET_ADDRESS'
    }
};

exports.register = async (req, res) => {
    // Legacy register, kept for compatibility if needed elsewhere
    res.status(410).json({ error: 'Please use Auth0 for registration.' });
};

exports.login = async (req, res) => {
    // Legacy login, kept for compatibility if needed elsewhere
    res.status(410).json({ error: 'Please use Auth0 for login.' });
};

exports.me = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const auth0Id = req.user.sub;
        const localProfile = users[auth0Id] || {};

        // Merge Auth0 token data with local profile data
        res.status(200).json({
            ...req.user,
            ...localProfile
        });
    } catch (error) {
        console.error('Me Controller Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.completeProfile = async (req, res) => {
    try {
        const { name, accountType } = req.body;
        const auth0Id = req.user.sub;

        if (!name || !accountType) {
            return res.status(400).json({ error: 'Name and account type are required.' });
        }

        // Store or update user profile
        users[auth0Id] = {
            name,
            role: accountType.toUpperCase() === 'INSTITUTION' ? 'ISSUER' : 'STUDENT',
            email: req.user.email,
            address: `WALLET_${Math.random().toString(36).substring(7).toUpperCase()}` // Mock wallet address
        };

        return res.status(200).json({
            message: 'Profile completed successfully',
            user: {
                ...req.user,
                ...users[auth0Id]
            }
        });
    } catch (error) {
        console.error('Complete Profile Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

