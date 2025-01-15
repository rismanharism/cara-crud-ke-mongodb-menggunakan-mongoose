const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Rute untuk menampilkan daftar pengguna
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.render('users/list', { title: 'User List', users });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Halaman form tambah pengguna
router.get('/users/create', (req, res) => {
  res.render('users/create', { title: 'Add New User' });
});

// Proses tambah pengguna
router.post('/users/create', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.redirect('/users');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Halaman form edit pengguna
router.get('/users/edit/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('users/edit', { title: 'Edit User', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Proses edit pengguna
router.post('/users/edit/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.redirect('/users');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Proses hapus pengguna
router.get('/users/delete/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
