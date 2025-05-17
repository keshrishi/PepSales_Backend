const express = require('express');
const connectDB = require('./config/database');
const app = express();
const { connectQueue } = require('./config/queue');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

connectDB();
(async () => {
  await connectDB();
  await connectQueue();
  // ...rest of server setup
})();
app.use(express.json());
const userRouter = require('./routes/apiRoutes');
app.use('/api', userRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));