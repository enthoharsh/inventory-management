import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../controllers/auth.controller.js';
import validate from '../middlewares/validator.middleware.js';

const router = Router();

router.post(
  '/register',
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').optional().isIn(['Admin', 'Viewer']).withMessage('Role must be either Admin or Viewer'),
  ]),
  authController.register
);

router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  authController.login
);

export default router;