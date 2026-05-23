import movementService from '../services/stockMovement.service.js';
import catchAsync from '../utils/catch.async.js';

const adjustStock = catchAsync(async (req, res, next) => {
  const { productId, type, quantity } = req.body;
  const assignedBy = req.user.id;

  const result = await movementService.adjustStock({
    productId,
    type,
    quantity,
    assignedBy,
  });

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

const getDashboardData = catchAsync(async (req, res, next) => {
  const analytics = await movementService.getDashboardAnalytics();

  res.status(200).json({
    status: 'success',
    data: analytics,
  });
});

export default {
  adjustStock,
  getDashboardData,
};