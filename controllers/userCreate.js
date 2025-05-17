const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const user = await User.create({ name, email, phone });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
