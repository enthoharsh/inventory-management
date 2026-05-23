import movementRepository from '../repositories/stockMovement.repository.js';
import productRepository from '../repositories/product.repository.js';
import AppError from '../utils/app.error.js';

const adjustStock = async ({ productId, type, quantity, assignedBy }) => {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new AppError('Product does not exist', 404);
  }

  if (type === 'OUT' && product.quantity < quantity) {
    throw new AppError(`Insufficient stock. available: ${product.quantity}, requested: ${quantity}`, 400);
  }

  const updatedProduct = await productRepository.updateQuantityAtomic(productId, quantity, type);
  
  if (!updatedProduct) {
    throw new AppError('Failed to update product quantity', 409);
  }

  const movement = await movementRepository.create({
    productId,
    type,
    quantity,
    assignedBy,
  });

  return {
    movement,
    currentQuantity: updatedProduct.quantity,
    isLowStock: updatedProduct.quantity <= updatedProduct.lowStockThreshold,
  };
};

const getDashboardAnalytics = async () => {
  const recentMovements = await movementRepository.findRecent(5);
  
  const allProductsData = await productRepository.findAll({ page: 1, limit: 100000 });
  
  const totalProducts = allProductsData.total;
  
  const lowStockAlerts = allProductsData.products.filter(
    (prod) => prod.quantity <= prod.lowStockThreshold
  ).map(prod => ({
    id: prod._id,
    name: prod.name,
    sku: prod.sku,
    quantity: prod.quantity,
    threshold: prod.lowStockThreshold
  }));

  return {
    totalProducts,
    lowStockCount: lowStockAlerts.length,
    lowStockAlerts,
    recentMovements,
  };
};

export default {
  adjustStock,
  getDashboardAnalytics,
};