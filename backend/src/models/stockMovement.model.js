import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['IN', 'OUT'],
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);
export default StockMovement;