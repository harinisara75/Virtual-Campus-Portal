const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create event (POST /api/events)
router.post('/', auth, async (req, res) => {
  try {
    const ev = new Event({ ...req.body, createdBy: req.user.id });
    await ev.save();
    res.json(ev);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// List events (GET /api/events)
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).populate('createdBy', 'name');
    res.json(events);
  } catch (err) {
    console.error('GET /api/events error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get attendees for an event (GET /api/events/:id/attendees)
router.get('/:id/attendees', auth, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id).populate('attendees', 'name email _id');
    if (!ev) return res.status(404).json({ msg: 'Event not found' });
    res.json(ev.attendees || []);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// Join event - also save to user's joinedEvents (POST /api/events/:id/join)
router.post('/:id/join', auth, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ msg: 'Event not found' });

    if (!ev.attendees) ev.attendees = [];
    if (!ev.attendees.includes(req.user.id)) {
      ev.attendees.push(req.user.id);
      await ev.save();
    }

    const user = await User.findById(req.user.id);
    if (!user.joinedEvents) user.joinedEvents = [];
    if (!user.joinedEvents.includes(ev._id)) {
      user.joinedEvents.push(ev._id);
      await user.save();
    }

    return res.json({ msg: 'Joined' });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// Delete event (DELETE /api/events/:id)
router.delete('/:id', auth, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ msg: 'Not found' });
    if (ev.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not allowed' });
    }
    await Event.findByIdAndDelete(ev._id);
    await User.updateMany({}, { $pull: { joinedEvents: ev._id } });
    return res.json({ msg: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

module.exports = router;
