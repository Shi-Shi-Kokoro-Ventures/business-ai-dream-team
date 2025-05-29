
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const { toast } = useToast();
  const {
    showToast = true,
    logError = true,
    fallbackMessage = 'An unexpected error occurred'
  } = options;

  const handleError = useCallback((
    error: Error | string,
    context?: string
  ) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const displayMessage = errorMessage || fallbackMessage;

    if (logError) {
      console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    }

    if (showToast) {
      toast({
        title: "Error",
        description: displayMessage,
        variant: "destructive"
      });
    }

    return displayMessage;
  }, [toast, showToast, logError, fallbackMessage]);

  const handleAsyncError = useCallback(async <T,>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, context);
      return null;
    }
  }, [handleError]);

  return { handleError, handleAsyncError };
};
