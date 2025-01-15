// controllers/userController.js
const User = require('../models/user');
const { validationResult } = require('express-validator');

// Create user
exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
    });

    await user.save();
    res.status(201).json({ msg: 'User created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all users
exports.getUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Tidak mengembalikan password
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

// Update user
exports.updateUser = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Update fields
      if (name) user.name = name;
      if (email) user.email = email;
  
      // Jika password di-update, hash password baru
      if (password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(password, salt);
      }
  
      await user.save();
      res.json({ msg: 'User updated successfully', user });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
  

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
