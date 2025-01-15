// app.js
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();


const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Batas maksimal request per IP
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api', limiter);

// Connect to database
connectDB();

// Middleware untuk file statis
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(helmet()); // Untuk meningkatkan keamanan HTTP headers
app.use(express.urlencoded({ extended: false }));

// Middleware untuk rute
app.use('/', userRoutes); // Gunakan rute pengguna

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api', userRoutes);

// Home route
app.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to MyApp' });
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
