import authService from '../services/auth.service.js';
import catchAsync from '../utils/catch.async.js';

const register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const result = await authService.register({ name, email, password, role });

  res.status(201).json({
    status: 'success',
    data: result,
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

export default {
  register,
  login,
};