export type ApiFailure = {
  success: false;
  error: string;
  message: string;
  details?: {
    fields?: Record<string, string[]>;
    issues?: Array<{ field: string; message: string; code: string }>;
  };
  request_id: string;
};

/** @deprecated Legacy envelope — backend now returns direct payloads. */
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
};
