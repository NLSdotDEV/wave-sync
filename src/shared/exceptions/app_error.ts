export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly payload?: Record<any, any> | null | undefined;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string,
    payload?: Record<any, any> | null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.payload = payload;
  }
}

export class BadRequestError extends AppError {
  constructor(
    message: string = "Bad Request",
    payload?: Record<any, any> | null,
  ) {
    super(message, 400, 'BAD_REQUEST', payload);
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message: string = "Unauthorized",
    payload?: Record<any, any> | null,
  ) {
    super(message, 401, 'UNAUTHORIZED', payload);
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message: string = "Forbidden",
    payload?: Record<any, any> | null,
  ) {
    super(message, 403, 'FORBIDDEN', payload);
  }
}

export class NotFoundError extends AppError {
  constructor(
    message: string = "Resource Not Found",
    payload?: Record<any, any> | null,
  ) {
    super(message, 404, 'NOT_FOUND', payload);
  }
}

export class InternalServerError extends AppError {
  constructor(
    message: string = "Internal Server Error",
    payload?: Record<any, any> | null,
  ) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', payload);
  }
}
