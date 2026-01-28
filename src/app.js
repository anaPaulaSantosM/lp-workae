const express = require('express');
const cors = require('cors');

const waitlistRoutes = require('./routes/waitlist.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/waitlist', waitlistRoutes);

module.exports = app;
