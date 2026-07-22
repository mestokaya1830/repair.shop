import express from "express";
import { env } from "./config/env.js";
import helmet from "helmet";
import cors from "cors";
import AppError from "./utils/app.error.js";
import processHandler from "./utils/process.handler.js";
import logger from "./utils/logger.js";
import httpLogger from "./middleware/http.logger.js";
import connectMongo from './infra/connect.mongo.js';
import webRepairsRouter from './routes/web.repairs.router.js'
import authRouter from './routes/auth.router.js'
import repairsRouter from './routes/admin.repairs.router.js'
import usersRouter from './routes/users.router.js'
import customersRouter from './routes/customers.router.js'
import devicesRouter from './routes/devices.router.js'
import dashboardRouter from './routes/dashboard.router.js'

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: {policy: 'cross-origin'}
}));
app.use(cors({
  origin: ['http://localhost:5173']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/uploads"));
app.use(httpLogger);

app.use('/api/web', webRepairsRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/repairs', repairsRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/customers', customersRouter)
app.use('/api/devices', devicesRouter)


app.use((req, res, next) => {
  return next(new AppError("Page Not Found", 404, "PAGE_NOT_FOUND"));
});

app.use((err, req, res, next) => {
  console.error(err.stack)
  const statusCode = err.statusCode || 500;

  logger.error({
    success: false,
    requestId: req.id,
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    code: err.code,
    timestamp: new Date().toISOString(),
    message: err.isOperational ? err.message : "Server Error",
    stack: env.NODE_ENV === "development" ? err.stack : null,
  });

  res.status(statusCode).json({
    success: false,
    requestId: req.id,
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    code: err.code,
    message: err.isOperational ? err.message : "Server Error",
    stack: env.NODE_ENV === "development" ? err.stack : null,
  });
});


const startServer = async () => {
  try {
    await connectMongo()
    const server = app.listen(env.PORT, () =>
      console.log("Server is runnin on PORT", env.PORT),
    );
    processHandler(server)
    logger.info(`Server is runnin on PORT', ${env.PORT}`);
  } catch (error) {
    console.error(error);
    logger.error(error.message);
  }
};

startServer()