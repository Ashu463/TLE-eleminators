import mongoose from 'mongoose';


const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  codeforces_handle: { type: String, required: true, unique: true },
  current_rating: { type: Number, default: 0 },
  max_rating: { type: Number, default: 0 },
  ratingHistory: [{
    contestId: Number,
    contestName: String,
    handle: String,
    rank: Number,
    ratingUpdateTimeSeconds: Number,
    oldRating: Number,
    newRating: Number
  }], // This is the key addition
  submissions: [{
  id: Number, // submission ID
  creationTimeSeconds: Number, // UNIX timestamp
  verdict: String, // e.g., "OK", "WRONG_ANSWER"
  programmingLanguage: String,
  problem: {
    contestId: Number,
    index: String,
    name: String,
    rating: Number,
    tags: [String]
  }
}],
  last_updated: { type: Date, default: Date.now },
  email_reminders_sent: { type: Number, default: 0 },
  email_reminders_disabled: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

const settingSchema = new mongoose.Schema({
  cronTime: String,      
  cronFrequency: String,
  emailRemindersEnabled: Boolean,
  inactivityDays: Number
});

const AppSetting = mongoose.model('AppSetting', settingSchema);

export { Student, AppSetting };