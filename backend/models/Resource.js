const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: String,
  fileURL: String,
  tags: [String],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);
