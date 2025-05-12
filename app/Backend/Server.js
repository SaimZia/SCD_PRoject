const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./Routes/authRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const trainerRoutes = require('./Routes/trainerRoutes');
const traineeRoutes = require('./Routes/traineeRoutes');
const packageRoutes = require('./Routes/packageRoutes');
const paymentRoutes = require('./Routes/paymentRoutes');
require('dotenv').config();

const app = express();
const PORT = 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // Use MONGO_URI from .env
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use(bodyParser.json());
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  };
  try {
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).send();
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/trainee', traineeRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/payments', paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
