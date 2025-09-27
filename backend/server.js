require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

// ✅ Allow localhost + Vercel main + previews
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://virtual-campus-portal.vercel.app",
    /\.vercel\.app$/ // allow any Vercel preview domain
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/timetable', require('./routes/timetable'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
