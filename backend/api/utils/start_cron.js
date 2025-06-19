import cron from 'node-cron';
import { Student, AppSetting } from '../../db/index.js';
import { fetchCodeforcesUserData } from './fetch_data.js';
import { checkInactivityAndSendEmail } from './email_sender.js';

export const startCron = async () => {
  const settings = await AppSetting.findOne({});

  if (!settings || !settings.cronTime) {
    await AppSetting.create({
        cronTime: '02:00',
        cronFrequency: 'daily',
        emailRemindersEnabled: true,
        inactivityDays: 7
      });
      console.log('No cronTime found in DB. Default AppSetting inserted into DB');
  }

  const [hour, minute] = settings.cronTime.split(':').map(Number);
  const cronExpr = `${minute} ${hour} * * *`;

  console.log(`Scheduling daily sync at ${settings.cronTime} (${cronExpr})`);

  cron.schedule(cronExpr, async () => {
    console.log('Running daily sync job...');

    try {
      const students = await Student.find({});
      const resultArr = [];

      for (const student of students) {
        if (!student.codeforces_handle) continue;

        const cfData = await fetchCodeforcesUserData(student.codeforces_handle);
        await Student.findByIdAndUpdate(student._id, {
          currentRating: cfData.currentRating,
          maxRating: cfData.maxRating,
          lastUpdated: new Date()
        });

        if (settings.emailRemindersEnabled) {
          const result = await checkInactivityAndSendEmail(student, settings.inactivityDays);
          resultArr.push(result);
        }
      }

      console.log('Daily sync completed successfully');
    } catch (error) {
      console.error('Daily sync failed:', error.message);
    }
  });
};
