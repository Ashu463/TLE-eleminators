import express from 'express';
import cors from 'cors';
import apiRouter from './api/profile_router.js';
import mongoose from 'mongoose';
import settingsRouter from './api/settings_router.js';
import { startCron } from './api/utils/start_cron.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);
app.use('/api/settings', settingsRouter)
app.get('/health', (req, res) => {
  res.json({message: 'Hello from the backend!'});
});

mongoose.connect('mongodb://localhost:27017/codeforces', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "codeforces" }).then(() => {
    console.log('Successfully connected to the database');
    startCron();
  })
  .catch((err) => {
    console.error('Error connecting to the database', err);
  });;

app.listen(PORT, () => {
  console.log(`Server is running on port :${PORT}`);
});
