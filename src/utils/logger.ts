type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMessage {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
}

const isDevelopment = import.meta.env.DEV;

export const logger = {
  info: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, data || '');
    }
  },

  warn: (message: string, data?: any) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  },

  error: (message: string, error?: any) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error || '');
    }
  },

  debug: (message: string, data?: any) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  },

  api: {
    request: (method: string, url: string, data?: any) => {
      if (isDevelopment) {
        console.log(`[API Request] ${method} ${url}`, data || '');
      }
    },

    response: (method: string, url: string, data?: any) => {
      if (isDevelopment) {
        console.log(`[API Response] ${method} ${url}`, data || '');
      }
    },

    error: (method: string, url: string, error: any) => {
      if (isDevelopment) {
        console.error(`[API Error] ${method} ${url}`, error);
      }
    }
  }
}; 