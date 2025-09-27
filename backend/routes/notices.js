const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const auth = require('../middleware/auth');

// Create notice
router.post('/', auth, async (req, res) => {
  try {
    const n = new Notice({ ...req.body, createdBy: req.user.id });
    await n.save();
    res.json(n);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// List
router.get('/', auth, async (req, res) => {
  try {
    const list = await Notice.find().sort({ createdAt: -1 }).populate('createdBy','name');
    res.json(list);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

// Delete notice (teacher/admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const n = await Notice.findById(req.params.id);
    if (!n) return res.status(404).json({ msg: 'Not found' });
    if (n.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not allowed' });
    }
    await Notice.findByIdAndDelete(n._id);
    return res.json({ msg: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
});

module.exports = router;
