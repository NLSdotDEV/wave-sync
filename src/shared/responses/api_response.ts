import type { Response } from "express";

export function sendSuccess(
  res: Response,
  message: string,
  data: any = null,
  statusCode: number = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}
