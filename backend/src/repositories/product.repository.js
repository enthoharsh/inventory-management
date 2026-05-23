import Product from '../models/product.model.js';

const create = async (productData) => {
  return await Product.create(productData);
};

const findBySku = async (sku) => {
  return await Product.findOne({ sku });
};

const findById = async (id) => {
  return await Product.findById(id);
};

const findAll = async ({ search, category, page = 1, limit = 10 }) => {
  const query = {};

  if (search) {
    query.$text = { $search: search };
  }

  if (category) {
    query.category = category;
  }

  const skip = (page - 1) * limit;

  const products = await Product.find(query)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(query);

  return { products, total };
};

const updateQuantityAtomic = async (productId, quantityChange, type) => {
  const value = type === 'OUT' ? -quantityChange : quantityChange;
  const filter = { _id: productId };

  if (type === 'OUT') {
    filter.quantity = { $gte: quantityChange };
  }

  return await Product.findOneAndUpdate(
    filter,
    { $inc: { quantity: value } },
    { new: true, runValidators: true }
  );
};

const update = async (id, updateData) => {
  return await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export default {
  create,
  findBySku,
  findById,
  findAll,
  updateQuantityAtomic,
  update,
};