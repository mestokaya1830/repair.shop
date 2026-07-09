import mongoose from "mongoose";
import logger from "../logger/logger.js";

const processHandler = (server) => {
  const shutDown = async (signal, err = null) => {
    if (err) {
      logger.error(`${signal} - App shutting down due to error`, err);
    } else {
      logger.info(`${signal} - App shutting down gracefully`);
    }

    if (server) {
      await new Promise((resolve) => {
        server.close(() => {
          logger.info("HTTP server closed!");

          resolve();
        });
      });
    }

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();

      logger.info("MongoDB connection closed!");
    }

    setTimeout(() => {
      process.exit(err ? 1 : 0);
    }, 500);
  };

  process.once("SIGINT", () => shutDown("SIGINT"));
  process.once("SIGTERM", () => shutDown("SIGTERM"));
  process.once("uncaughtException", (err) => shutDown("uncaughtException", err));
  process.once("unhandledRejection", (err) => shutDown("unhandledRejection", err));
};

export default processHandler;
