// src/services/contracts.service.ts

export const contractsService = {
  generateTemplate: (type: string): Promise<{ success: boolean; docUrl: string; title: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          docUrl: `/downloads/mock_${type}_contract.docx`,
          title: `${type.toUpperCase()} Agreement Template`
        });
      }, 1200);
    });
  }
};
