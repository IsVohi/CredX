const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from global .env
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const credentialRoutes = require('./routes/credentialRoutes');
const issuerRoutes = require('./routes/issuerRoutes');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');

// Register routes
app.use('/api/credentials', credentialRoutes);
app.use('/api/institutions', issuerRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'CredX Backend Running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`CredX server listening on port ${PORT}`);
});
