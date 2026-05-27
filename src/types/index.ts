export interface TPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TActionResponse<T = unknown, F = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: TPaginationMeta;
  errors?: { field: string; message: string }[];
  formData?: F;
}