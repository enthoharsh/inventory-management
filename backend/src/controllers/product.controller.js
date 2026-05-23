import productService from '../services/product.service.js';
import catchAsync from '../utils/catch.async.js';

const createProduct = catchAsync(async (req, res, next) => {
  const { sku, name, category, price, quantity, lowStockThreshold } = req.body;

  const product = await productService.createProduct({
    sku,
    name,
    category,
    price,
    quantity,
    lowStockThreshold,
  });

  res.status(201).json({
    status: 'success',
    data: { product },
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const { search, category, page, limit } = req.query;

  const result = await productService.getAllProducts({
    search,
    category,
    page,
    limit,
  });

  res.status(200).json({
    status: 'success',
    results: result.products.length,
    total: result.total,
    data: { products: result.products },
  });
});

const getProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await productService.getProductById(id);

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const product = await productService.updateProduct(id, updateData);

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

export default {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
};