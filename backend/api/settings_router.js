import express from 'express';
import { AppSetting } from '../db/index.js';

const settingsRouter = express.Router();
settingsRouter.use(express.json());

settingsRouter.get('/get', async (req, res) => {
  const settings = await AppSetting.findOne({});
  res.json(settings);
});

settingsRouter.post('/set', async (req, res) => {
  const data = req.body;
  let settings = await AppSetting.findOne({});
  if (settings) {
    Object.assign(settings, data);
    await settings.save();
  } else {
    settings = await AppSetting.create(data);
  }
  res.json({ message: 'Settings updated successfully' });
});

export default settingsRouter;
