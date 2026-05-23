import jwtUtil from '../utils/jwt.util.js';
import AppError from '../utils/app.error.js';
import catchAsync from '../utils/catch.async.js';

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Please login first.', 401);
  }

  try {
    const decoded = jwtUtil.verifyToken(token);
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (error) {
    throw new AppError('Invalid token please login again.', 401);
  }
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('You are not authorized to perform this action', 403);
    }
    next();
  }
};

export default {
  protect,
  restrictTo,
};