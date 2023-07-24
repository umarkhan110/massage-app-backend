const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config({ path: './config.env' });

const PORT = 5000;
const cors = require('cors');

mongoose
  .connect('mongodb+srv://massage:massage@massageapp.peirmuq.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database is connected');
  })
  .catch((e) => {
    console.log(e + "It's not ok");
  });

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Serve static files from the "/uploads" directory
app.use('/uploads', express.static('uploads'));

app.use('/admin', require('./routes/admin.js'));
app.use('/provider', require('./routes/provider'));

app.use('/user', require('./routes/dashboard.js'));
app.use('/expense', require('./routes/expenses.js'));

app.listen(PORT, () => {
  console.log('Server is listening on port ' + PORT);
});
