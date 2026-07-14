// src/services/documents.service.ts

export const documentsService = {
  upload: (file: File): Promise<{ success: boolean; fileId: string; name: string; size: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          fileId: `doc-${Math.random().toString(36).substring(7)}`,
          name: file.name,
          size: file.size
        });
      }, 1000);
    });
  }
};
