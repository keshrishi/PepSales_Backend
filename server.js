require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const { connectQueue } = require('./config/queue');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const userRouter = require('./routes/apiRoutes');
app.use('/api', userRouter);

(async () => {
  try {
    await connectDB();
    await connectQueue();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();