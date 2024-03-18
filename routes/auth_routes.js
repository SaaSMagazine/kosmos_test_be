const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const existingUser = await User.findOne({ where: { login: req.body.login } });
    if (existingUser) {
      return res.status(400).json({ message: 'Login already in use' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      middleName: req.body.middleName,
      login: req.body.login,
      password: hashedPassword,
      // managerId: req.body.managerId
    });

    const userWithoutPassword = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      middleName: newUser.middleName,
      login: newUser.login,
      // managerId: newUser.managerId
    };

    res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ where: { login: req.body.login } });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'User logged in successfully', token, userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});


router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully. Please remove your token.' });
});


module.exports = router;
