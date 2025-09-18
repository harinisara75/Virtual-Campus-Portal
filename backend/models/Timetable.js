const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
  date: String, // YYYY-MM-DD
  periods: [
    { time: String, subject: String, teacher: String, room: String }
  ]
});

module.exports = mongoose.model('Timetable', TimetableSchema);
