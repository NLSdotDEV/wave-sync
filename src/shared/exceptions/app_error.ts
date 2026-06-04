export class AppError extends Error {
  public readonly statusCode: number;
  public readonly payload?: Record<any, any> | null | undefined;

  constructor(
    message: string,
    statusCode: number = 500,
    payload?: Record<any, any> | null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.payload = payload;
  }
}

export class BadRequestError extends AppError {
  constructor(
    message: string = "Bad Request",
    payload?: Record<any, any> | null,
  ) {
    super(message, 400, payload);
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message: string = "Unauthorized",
    payload?: Record<any, any> | null,
  ) {
    super(message, 401, payload);
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message: string = "Forbidden",
    payload?: Record<any, any> | null,
  ) {
    super(message, 403, payload);
  }
}

export class NotFoundError extends AppError {
  constructor(
    message: string = "Resource Not Found",
    payload?: Record<any, any> | null,
  ) {
    super(message, 404, payload);
  }
}

export class InternalServerError extends AppError {
  constructor(
    message: string = "Internal Server Error",
    payload?: Record<any, any> | null,
  ) {
    super(message, 500, payload);
  }
}
