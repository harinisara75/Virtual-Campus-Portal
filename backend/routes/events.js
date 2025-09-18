const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const ev = new Event({ ...req.body, createdBy: req.user.id });
    await ev.save();
    res.json(ev);
  } catch (err) { res.status(500).send('Server error'); }
});

// Get events
router.get('/', auth, async (req, res) => {
  const events = await Event.find().sort({ date: 1 }).populate('createdBy','name');
  res.json(events);
});

// Join event
router.post('/:id/join', auth, async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ msg: 'Not found' });
  if (!ev.attendees.includes(req.user.id)) ev.attendees.push(req.user.id);
  await ev.save();
  res.json(ev);
});

module.exports = router;
