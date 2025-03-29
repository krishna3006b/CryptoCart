
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret'; // In production, use environment variable

export const register = async (req, res) => {
  const { email, password, type } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, type });
    await user.save();
    const token = jwt.sign({ id: user._id, type: user.type }, 'secret', { expiresIn: '1h' });
    
    res.status(201).json({ token });
    } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user._id, type: user.type }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    res.json({ token, userId: user._id, userType: user.type });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
