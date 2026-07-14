// src/services/auth.service.ts

export const authService = {
  login: (email: string): Promise<{ success: boolean; token: string; email: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          token: `mock-jwt-token-${Math.random().toString(36).substring(7)}`,
          email
        });
      }, 1000);
    });
  }
};
