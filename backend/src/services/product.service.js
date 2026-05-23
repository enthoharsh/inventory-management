import productRepository from '../repositories/product.repository.js';
import AppError from '../utils/app.error.js';

const createProduct = async (productData) => {
  const existingProduct = await productRepository.findBySku(productData.sku);
  if (existingProduct) {
    throw new AppError('A product with this SKU already exists', 400);
  }
  return await productRepository.create(productData);
};

const getAllProducts = async (filters) => {
  return await productRepository.findAll(filters);
};

const getProductById = async (id) => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

const updateProduct = async (id, updateData) => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (updateData.sku && updateData.sku !== product.sku) {
    const existingSku = await productRepository.findBySku(updateData.sku);
    if (existingSku) {
      throw new AppError('This SKU is already assigned to another product', 400);
    }
  }

  return await productRepository.update(id, updateData);
};

export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
};