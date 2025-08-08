export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  uploadedBy: string;
  version: number;
  tags: string[];
  shared: boolean;
  accessLevel: 'view' | 'edit' | 'admin';
  downloadCount: number;
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export type SortField = 'name' | 'size' | 'uploadedAt' | 'type';
export type SortDirection = 'asc' | 'desc';

export interface FilterOptions {
  search: string;
  tags: string[];
  fileTypes: string[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
}