import type { Response } from "express";

export abstract class Controller {
  protected success(res: Response, message: string, data?: Record<any, any> | null) {
    return res.status(200).json({
      success: true,
      message,
      data: {
        ...data,
      },
    });
  }

  protected unauthorized(res: Response, message: string) {
    return res.status(401).json({
      success: false,
      message,
    });
  }

  protected forbidden(res: Response, message: string) {
    return res.status(403).json({
      success: false,
      message,
    });
  }

  protected notFound(res: Response, message: string) {
    return res.status(404).json({
      success: false,
      message,
    });
  }
}
