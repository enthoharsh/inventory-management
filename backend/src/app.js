import express from 'express';
import cors from 'cors';
import globalErrorHandler from './middlewares/error.middleware.js';
import apiRouter from './routes/index.js';
import AppError from './utils/app.error.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', apiRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;