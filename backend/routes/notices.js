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
  } catch (err) { res.status(500).send('Server error'); }
});

// List
router.get('/', auth, async (req, res) => {
  const list = await Notice.find().sort({ createdAt: -1 }).populate('createdBy','name');
  res.json(list);
});

module.exports = router;
