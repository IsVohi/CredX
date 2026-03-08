const fs = require('fs');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '../../data/users.json');

// Helper to load users
const loadUsers = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Error loading users from file:", error);
    }
    return {
        'auth0|admin_id': {
            name: 'Stanford University',
            role: 'ISSUER',
            address: 'Y5QWXXLDDVCA2SDFOXU4N262JL2XIWTYBPZVHHKHGABUAT333XKDU2PL3M'
        }
    };
};

// Initial load
let usersMap = loadUsers();

// Proxy to automatically save on changes
const users = new Proxy(usersMap, {
    set(target, prop, value) {
        target[prop] = value;
        try {
            fs.writeFileSync(DATA_FILE, JSON.stringify(target, null, 2));
        } catch (error) {
            console.error("Error saving users to file:", error);
        }
        return true;
    }
});

module.exports = users;
