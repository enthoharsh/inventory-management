import userRepository from '../repositories/user.repository.js';
import jwtUtil from '../utils/jwt.util.js';
import AppError from '../utils/app.error.js';

const register = async (userData) => {
  const existingUser = await userRepository.findByEmail(userData.email);
  if (existingUser) {
    throw new AppError('Email is already exist.', 400);
  }

  const newUser = await userRepository.create(userData);
  
  const token = jwtUtil.generateToken({ id: newUser._id, role: newUser.role });

  return {
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
    token,
  };
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = jwtUtil.generateToken({ id: user._id, role: user.role });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export default {
  register,
  login,
};