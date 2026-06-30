import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super('Too many requests', 429, 'RATE_LIMIT');
    this.name = 'RateLimitError';
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  // Handle Zod validation errors
  if (error instanceof Error && error.name === 'ZodError') {
    return NextResponse.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: (error as any).errors,
      },
      { status: 400 }
    );
  }

  // Handle database errors
  if (error instanceof Error && error.message.includes('duplicate key')) {
    return NextResponse.json(
      {
        error: 'Duplicate entry',
        code: 'DUPLICATE_ERROR',
      },
      { status: 409 }
    );
  }

  // Log unexpected errors
  console.error('Unhandled error:', error);

  // Return generic error in production
  const isProduction = process.env.NODE_ENV === 'production';
  return NextResponse.json(
    {
      error: isProduction ? 'Internal server error' : (error as Error).message,
      code: 'INTERNAL_ERROR',
    },
    { status: 500 }
  );
}

// Error logging service
export class ErrorLogger {
  static async log(error: Error, context?: any) {
    const errorLog = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      environment: process.env.NODE_ENV,
    };

    // In production, send to error tracking service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
      // await sendToErrorTrackingService(errorLog);
      console.error(JSON.stringify(errorLog));
    } else {
      console.error('Error:', errorLog);
    }

    // Store in database for audit
    try {
      // await db.insert(errorLogs).values(errorLog);
    } catch (dbError) {
      console.error('Failed to log error to database:', dbError);
    }
  }
}