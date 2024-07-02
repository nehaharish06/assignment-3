const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
  

// Routes
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

// Check if authRoutes and dataRoutes are valid middleware functions or routers
if (typeof authRoutes === 'function') {
  app.use('/api/auth', authRoutes);
} else {
  console.error('Invalid authRoutes definition');
}

if (typeof dataRoutes === 'function') {
  app.use('/api/data', dataRoutes);
} else {
  console.error('Invalid dataRoutes definition');
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));