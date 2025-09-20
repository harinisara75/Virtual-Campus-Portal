const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const ev = new Event({ ...req.body, createdBy: req.user.id });
    await ev.save();
    res.json(ev);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// Get events
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).populate('createdBy','name');
    res.json(events);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// Join event - also save to user's joinedEvents
router.post('/:id/join', auth, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ msg: 'Event not found' });

    // add user to event.attendees
    if (!ev.attendees) ev.attendees = [];
    if (!ev.attendees.includes(req.user.id)) {
      ev.attendees.push(req.user.id);
      await ev.save();
    }

    // add event id to user's joinedEvents
    const user = await User.findById(req.user.id);
    if (!user.joinedEvents) user.joinedEvents = [];
    if (!user.joinedEvents.includes(ev._id)) {
      user.joinedEvents.push(ev._id);
      await user.save();
    }

    return res.json({ msg: 'Joined' });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// Delete event (teacher/admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ msg: 'Not found' });
    // only creator or admin can delete
    if (ev.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not allowed' });
    }
    await Event.findByIdAndDelete(ev._id);
    // remove this event from all users' joinedEvents
    await User.updateMany({}, { $pull: { joinedEvents: ev._id } });
    return res.json({ msg: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

module.exports = router;
