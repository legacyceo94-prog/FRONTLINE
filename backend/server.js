require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true, // Temporarily allow all origins for testing
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"]
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Database Connection
// TODO: Replace with your actual MongoDB connection string in .env file
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/frontline';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connection established successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/communities', require('./routes/communities'));
app.use('/api/users', require('./routes/users'));
app.use('/api/connections', require('./routes/connections'));

console.log('✅ All routes mounted successfully');

app.get('/', (req, res) => {
  res.json({ 
    message: 'Frontline API is running...',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    routes: ['auth', 'courses', 'communities', 'users']
  });
});

// Test endpoint to verify deployment
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    version: '2.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
