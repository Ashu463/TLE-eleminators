import express from 'express';
import cors from 'cors';
import apiRouter from './api/index.js';
import mongoose from 'mongoose';
import cron from 'node-cron';
import { Student } from './db/index.js';
import { fetchCodeforcesUserData } from './api/fetch_data.js';
import {checkInactivityAndSendEmail} from './api/email_sender.js';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);
app.get('/health', (req, res) => {
  res.json({message: 'Hello from the backend!'});
});

mongoose.connect('mongodb://localhost:27017/codeforces', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "codeforces" }).then(() => {
    console.log('Successfully connected to the database');
  })
  .catch((err) => {
    console.error('Error connecting to the database', err);
  });;

app.listen(PORT, () => {
  console.log(`Server is running on port :${PORT}`);
});

cron.schedule('0 2 * * *', async () => {
  try {
    // Get all students from database
    const students = await Student.find({});
    
    // Update each student's data
    const arr = [];
    for (const student of students) {
      if (student.codeforces_handle) {
        const cfData = await fetchCodeforcesUserData(student.codeforces_handle);
        
        // Update student record
        await Student.findByIdAndUpdate(student._id, {
          currentRating: cfData.currentRating,
          maxRating: cfData.maxRating,
          lastUpdated: new Date(),
          // Store other fetched data
        });
        
        // Check for inactivity (no submissions in last 7 days)
        const response = await checkInactivityAndSendEmail(student);
        arr.push(response);
      }
    }
    res.json({ message: 'Daily sync completed successfully', data: arr });
    
    console.log('Daily sync completed successfully');
  } catch (error) {
    console.error('Daily sync failed:', error);
  }
});
