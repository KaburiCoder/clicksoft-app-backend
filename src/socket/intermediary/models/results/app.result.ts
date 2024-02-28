export interface AppResult<T> {
  dataList?: T[];
  status: 'success' | 'error';
  message?: string;
}
