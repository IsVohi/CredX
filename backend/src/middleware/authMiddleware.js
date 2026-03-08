const { auth } = require('express-oauth2-jwt-bearer');
const users = require('../models/userStore');
require('dotenv').config();

// Create middleware to validate Auth0 JWTs
// This automatically verifies the JWT signature using the JWKS from the issuer
const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
    tokenSigningAlg: 'RS256'
});

// Helper to handle the role checking and attach user info
const requireRole = (role) => {
    return (req, res, next) => {
        // express-oauth2-jwt-bearer attaches claims to req.auth.payload
        const payload = req.auth.payload;
        const auth0Id = payload.sub;

        // Fetch local role if it exists (set during onboarding)
        const localUser = users[auth0Id] || {};
        const localRole = localUser.role;

        console.log(`[AUTH DEBUG] Auth0ID: ${auth0Id}`);
        console.log(`[AUTH DEBUG] Local Role: ${localRole || 'NONE'}`);
        console.log(`[AUTH DEBUG] Required Role: ${role}`);

        req.user = {
            ...payload,
            ...localUser
        };

        // Role might be in a custom namespace, direct claim, or our local store
        const tokenRoles = payload['https://credx.io/roles'] || payload.role || payload.roles || [];
        const rolesArray = (Array.isArray(tokenRoles) ? [...tokenRoles] : [tokenRoles]).filter(Boolean);

        if (localRole) rolesArray.push(localRole);

        console.log(`[AUTH DEBUG] Final Roles Array:`, rolesArray);

        if (rolesArray.includes(role) || rolesArray.includes('ADMIN')) {
            next();
        } else {
            console.warn(`[AUTH DEBUG] 403 Access Denied for ${auth0Id}`);
            return res.status(403).json({ error: `Insufficient permissions. ${role} role required.` });
        }
    };
};

// Error handling wrapper for checkJwt to return JSON
const verifyAuth = (req, res, next) => {
    checkJwt(req, res, (err) => {
        if (err) {
            console.error("JWT Verification Error:", err.message);
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }
        req.user = req.auth.payload;
        next();
    });
};

const verifyIssuerRole = (req, res, next) => {
    checkJwt(req, res, (err) => {
        if (err) return res.status(401).json({ error: 'Invalid or expired token.' });
        requireRole('ISSUER')(req, res, next);
    });
};

const verifyStudentRole = (req, res, next) => {
    checkJwt(req, res, (err) => {
        if (err) return res.status(401).json({ error: 'Invalid or expired token.' });
        requireRole('STUDENT')(req, res, next);
    });
};

const verifyAdminRole = (req, res, next) => {
    checkJwt(req, res, (err) => {
        if (err) return res.status(401).json({ error: 'Invalid or expired token.' });
        requireRole('ADMIN')(req, res, next);
    });
};

module.exports = {
    verifyAuth,
    verifyIssuerRole,
    verifyStudentRole,
    verifyAdminRole
};
