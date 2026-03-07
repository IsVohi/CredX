const { auth } = require('express-oauth2-jwt-bearer');
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
        req.user = payload; // Attach for legacy controller compatibility

        // Role might be in a custom namespace or direct claim
        const userRoles = payload['https://credx.io/roles'] || payload.role || payload.roles || [];
        const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];

        if (rolesArray.includes(role) || rolesArray.includes('ADMIN')) {
            next();
        } else {
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
