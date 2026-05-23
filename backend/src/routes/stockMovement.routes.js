import { Router } from 'express';
import { body } from 'express-validator';
import movementController from '../controllers/stockMovement.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validator.middleware.js';

const router = Router();

router.use(authMiddleware.protect);

router.get('/dashboard', movementController.getDashboardData);

router.post(
  '/adjust',
  authMiddleware.restrictTo('Admin'),
  validate([
    body('productId').isMongoId().withMessage('Invalid product id format'),
    body('type').isIn(['IN', 'OUT']).withMessage('Movement type must be IN or OUT'),
    body('quantity').isInt({ min: 1 }).withMessage('Adjustment quantity must be at least 1'),
  ]),
  movementController.adjustStock
);

export default router;