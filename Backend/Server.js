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

const app = express();
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/gymManagement', {

})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/trainee', traineeRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/payments', paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
