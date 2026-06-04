import type { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/exceptions/app_error.js";
import { Middleware } from "./middleware.js";

export class ErrorHandlerMiddleware extends Middleware {
  static handle(err: any, _req: Request, res: Response, _next: NextFunction) {
    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof AppError) {
      statusCode = err.statusCode;
      message = err.message;
    } else if (err instanceof Error) {
      const isDevelopment = process.env.NODE_ENV !== "production";
      if (isDevelopment) {
        message = err.message;
      }
    }

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}
