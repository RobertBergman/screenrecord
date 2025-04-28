/**
 * Error handling utilities for the Screen Recorder application
 */

import { ERROR_MESSAGES } from '../constants';

export type ErrorType = 
  | 'permission_denied' 
  | 'not_supported' 
  | 'device_not_found'
  | 'constraints_not_satisfied'
  | 'unknown';

export interface MediaError {
  type: ErrorType;
  message: string;
  originalError?: Error;
}

/**
 * Handles media-related errors and converts them to a standardized format
 * @param error - The original error object
 * @returns A standardized MediaError object
 */
export function handleMediaError(error: unknown): MediaError {
  if (error instanceof DOMException) {
    switch (error.name) {
      case 'NotAllowedError':
        return {
          type: 'permission_denied',
          message: ERROR_MESSAGES.permissionDenied,
          originalError: error
        };
      case 'NotFoundError':
        return {
          type: 'device_not_found',
          message: ERROR_MESSAGES.deviceNotFound,
          originalError: error
        };
      case 'NotSupportedError':
        return {
          type: 'not_supported',
          message: ERROR_MESSAGES.notSupported,
          originalError: error
        };
      case 'OverconstrainedError':
        return {
          type: 'constraints_not_satisfied',
          message: ERROR_MESSAGES.constraintsNotSatisfied,
          originalError: error
        };
      default:
        return {
          type: 'unknown',
          message: error.message || ERROR_MESSAGES.unknownError,
          originalError: error
        };
    }
  }
  
  return {
    type: 'unknown',
    message: error instanceof Error ? error.message : ERROR_MESSAGES.unknownError,
    originalError: error instanceof Error ? error : undefined
  };
}

/**
 * Creates a user-friendly error message for display
 * @param error - The error to format
 * @returns A user-friendly error message
 */
export function formatErrorForUser(error: MediaError | Error | unknown): string {
  if ((error as MediaError).type) {
    return (error as MediaError).message;
  }
  
  if (error instanceof Error) {
    return error.message || ERROR_MESSAGES.unknownError;
  }
  
  return typeof error === 'string' ? error : ERROR_MESSAGES.unknownError;
}

/**
 * Logs an error to the console with additional context
 * @param error - The error to log
 * @param context - Additional context about where the error occurred
 */
export function logError(error: unknown, context?: string): void {
  const errorMsg = formatErrorForUser(error);
  const contextMsg = context ? ` [${context}]` : '';
  
  console.error(`Screen Recorder Error${contextMsg}:`, errorMsg);
  
  if (error instanceof Error || (error as MediaError).originalError) {
    const originalError = (error as MediaError).originalError || error;
    console.error('Original Error:', originalError);
  }
}
