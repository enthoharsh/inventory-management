import { validationResult } from 'express-validator';
import AppError from '../utils/app.error.js';

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map((err) => err.msg).join(', ');
    next(new AppError(`Validation Error: ${errorMessages}`, 400));
  };
};

export default validate;