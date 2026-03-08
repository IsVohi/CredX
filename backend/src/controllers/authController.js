const jwt = require('jsonwebtoken');
const users = require('../models/userStore');

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
        let localProfile = users[auth0Id] || {};

        // Self-healing: Upgrade legacy mock addresses to valid ones
        const algosdk = require('algosdk');
        if (localProfile.role && (!localProfile.address || !algosdk.isValidAddress(localProfile.address))) {
            console.log(`[AUTH DEBUG] Upgrading invalid address for ${auth0Id}`);
            const mockAccount = algosdk.generateAccount();
            localProfile.address = mockAccount.addr;
            users[auth0Id] = localProfile; // Trigger save via Proxy
        }

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
        const { name, accountType, address } = req.body;
        const auth0Id = req.user.sub;

        if (!name || !accountType) {
            return res.status(400).json({ error: 'Name and account type are required.' });
        }

        const isStudent = accountType.toUpperCase() === 'STUDENT';
        const algosdk = require('algosdk');
        let finalAddress = address;

        if (isStudent) {
            if (!address) {
                return res.status(400).json({ error: 'Algorand wallet address is required for students.' });
            }
            if (!algosdk.isValidAddress(address)) {
                return res.status(400).json({ error: 'Invalid Algorand wallet address format.' });
            }

            // Uniqueness check - allow if it's the same user updating their profile
            const isDuplicate = Object.entries(users).some(([id, u]) => u.address === address && id !== auth0Id);
            if (isDuplicate) {
                return res.status(400).json({ error: 'This wallet address is already registered with another account.' });
            }
        } else {
            // For institutions, we can still generate one or use provided
            if (!finalAddress || !algosdk.isValidAddress(finalAddress)) {
                const mockAccount = algosdk.generateAccount();
                finalAddress = mockAccount.addr;
            }
        }

        // Store or update user profile
        console.log(`[AUTH DEBUG] Saving profile for ${auth0Id}: name=${name}, accountType=${accountType}, address=${finalAddress}`);
        users[auth0Id] = {
            name,
            role: isStudent ? 'STUDENT' : 'ISSUER',
            email: req.user.email,
            address: finalAddress
        };
        console.log(`[AUTH DEBUG] Profile saved with role: ${users[auth0Id].role}`);

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

