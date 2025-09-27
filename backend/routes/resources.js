const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');

// Upload resource
router.post('/', auth, async (req, res) => {
  const r = new Resource({ ...req.body, uploadedBy: req.user.id });
  await r.save();
  res.json(r);
});

// List resources
router.get('/', auth, async (req, res) => {
  const docs = await Resource.find().sort({ createdAt: -1 });
  res.json(docs);
});

module.exports = router;
