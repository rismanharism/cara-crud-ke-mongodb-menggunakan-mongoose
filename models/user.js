// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Email is invalid'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
  });

// Middleware: Hash password sebelum menyimpannya
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Hanya hash jika password diubah
  const salt = await bcrypt.genSalt(12); // Gunakan 12 putaran salt
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method: Verifikasi password
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
