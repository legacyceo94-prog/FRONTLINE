require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

app.get('/', (req, res) => {
  res.send('Frontline API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
