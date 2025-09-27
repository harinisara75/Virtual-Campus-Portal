const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const auth = require('../middleware/auth');

// Save timetable
router.post('/', auth, async (req, res) => {
  const { date, periods } = req.body;
  await Timetable.findOneAndUpdate({ date }, { date, periods }, { upsert: true });
  res.json({ msg: 'Saved' });
});

// Get timetable
router.get('/:date', auth, async (req, res) => {
  const t = await Timetable.findOne({ date: req.params.date });
  res.json(t || { date: req.params.date, periods: [] });
});

module.exports = router;
