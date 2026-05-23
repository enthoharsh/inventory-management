import User from '../models/user.model.js';

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findById = async (id) => {
  return await User.findById(id).select('-password');
};

const create = async (userData) => {
  return await User.create(userData);
};

export default {
  findByEmail,
  findById,
  create,
};