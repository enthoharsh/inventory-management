import { Router } from 'express';
import { body, param } from 'express-validator';
import productController from '../controllers/product.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validator.middleware.js';

const router = Router();

router.use(authMiddleware.protect);

router.get('/', productController.getAllProducts);

router.get(
  '/:id',
  validate([param('id').isMongoId().withMessage('Invalid product id format')]),
  productController.getProductById
);

router.post(
  '/',
  authMiddleware.restrictTo('Admin'),
  validate([
    body('sku').notEmpty().withMessage('Unique SKU code is required'),
    body('name').notEmpty().withMessage('Product name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity cannot be negative'),
    body('lowStockThreshold').optional().isInt({ min: 0 }).withMessage('Threshold cannot be negative'),
  ]),
  productController.createProduct
);

router.put(
  '/:id',
  authMiddleware.restrictTo('Admin'),
  validate([
    param('id').isMongoId().withMessage('Invalid product id format'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity cannot be negative'),
    body('lowStockThreshold').optional().isInt({ min: 0 }).withMessage('Threshold cannot be negative'),
  ]),
  productController.updateProduct
);

export default router;