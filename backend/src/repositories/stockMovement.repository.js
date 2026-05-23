import StockMovement from '../models/stockMovement.model.js';

const create = async (movementData) => {
  return await StockMovement.create(movementData);
};

const findRecent = async (limit = 5) => {
  return await StockMovement.find()
    .populate('productId', 'name sku')
    .populate('assignedBy', 'name')
    .sort({ timestamp: -1 })
    .limit(limit);
};

export default {
  create,
  findRecent,
};