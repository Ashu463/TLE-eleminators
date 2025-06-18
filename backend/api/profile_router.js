import express from 'express';
import {Student} from '../db/index.js';
import { fetchCodeforcesUserData } from './utils/fetch_data.js';

const apiRouter = express.Router();
apiRouter.use(express.json());
apiRouter.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    if(!students){
      return res.status(404).json({ error: 'No students found' });
    }
    res.json({success: true, data: students});
  } catch (error) {
    res.status(500).json({success: false, error: 'Failed to fetch students' });
  }
});
apiRouter.post('/students', async (req, res) => {
  try {
    const codeforces_handle = req.body.codeforces_handle;
    if (!req.body.name || !req.body.codeforces_handle) {
      return res.status(400).json({success: false, error: 'Name and Codeforces handle are required' });
    }
    const obj = await fetchCodeforcesUserData(codeforces_handle);
    if (!obj.exists) {
      return res.status(404).json({success: false, error: 'Codeforces user not found' });
    }
    if (await Student.findOne({ codeforces_handle })) {
      return res.status(400).json({success: false, error: 'Student with this Codeforces handle already exists' });
    }
    // Create and save the student
    const student = new Student({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        codeforces_handle: codeforces_handle,
        current_rating: obj.currentRating,
        max_rating: obj.maxRating,
        ratingHistory: obj.ratingHistory,
        submissions: obj.submissions,
        last_updated: new Date(),
        email_reminders_sent: 0,
        email_reminders_disabled: false,
        created_at: new Date(),
        updated_at: new Date()
    });
    await student.save();
    res.status(201).json({success: true, data: student});
  } catch (error) {
    res.status(400).json({success: false, error: 'Failed to create student' });
  }
});
apiRouter.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) {
      return res.status(404).json({success: false, error: 'Student not found' });
    }
    student.last_updated = new Date();
    res.json(student);
  } catch (error) {
    res.status(400).json({success: false, error: 'Failed to update student' });
  }
}
);
apiRouter.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({success: false, error: 'Student not found' });
    }
    console.log(`Deleted student with ID: ${req.params.id}`);
    res.json({success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({success: false, error: 'Failed to delete student' });
  }
});
apiRouter.get('/students/:handle', async (req, res) => {
  try {
    const student = await Student.findOne({codeforces_handle: req.params.handle});

    if (!student) {
      return res.status(404).json({success: false, error: 'Student not found in database' });
    }
    res.json({message: 'Student data fetched successfully', data: student});
  } catch (error) {
    res.status(500).json({success: false, error: 'Failed to fetch student' });
  }
});
apiRouter.get('/health', (req, res) => {
  res.send('Hello from the backend API!');
});

export default apiRouter;