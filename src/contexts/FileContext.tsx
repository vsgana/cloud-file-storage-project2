import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FileItem, UploadProgress, SortField, SortDirection, FilterOptions } from '../types';

interface FileContextType {
  files: FileItem[];
  uploadProgress: UploadProgress[];
  sortField: SortField;
  sortDirection: SortDirection;
  filters: FilterOptions;
  addFile: (file: Omit<FileItem, 'id' | 'uploadedAt' | 'version' | 'downloadCount'>) => void;
  removeFile: (id: string) => void;
  updateUploadProgress: (progress: UploadProgress) => void;
  setSorting: (field: SortField, direction: SortDirection) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  shareFile: (id: string) => void;
  downloadFile: (id: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFiles = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};

interface FileProviderProps {
  children: ReactNode;
}

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Project_Proposal.pdf',
      size: 2450000,
      type: 'application/pdf',
      uploadedAt: new Date('2024-01-15'),
      uploadedBy: 'john.doe@company.com',
      version: 3,
      tags: ['proposal', 'client', 'urgent'],
      shared: true,
      accessLevel: 'edit',
      downloadCount: 12
    },
    {
      id: '2',
      name: 'Design_Mockups.fig',
      size: 15670000,
      type: 'application/figma',
      uploadedAt: new Date('2024-01-14'),
      uploadedBy: 'sarah.wilson@company.com',
      version: 1,
      tags: ['design', 'mockup', 'ui'],
      shared: false,
      accessLevel: 'view',
      downloadCount: 5
    },
    {
      id: '3',
      name: 'Database_Schema.sql',
      size: 890000,
      type: 'application/sql',
      uploadedAt: new Date('2024-01-13'),
      uploadedBy: 'mike.chen@company.com',
      version: 2,
      tags: ['database', 'schema', 'backend'],
      shared: true,
      accessLevel: 'admin',
      downloadCount: 8
    }
  ]);

  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [sortField, setSortField] = useState<SortField>('uploadedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filters, setFiltersState] = useState<FilterOptions>({
    search: '',
    tags: [],
    fileTypes: [],
    dateRange: {}
  });

  const addFile = (fileData: Omit<FileItem, 'id' | 'uploadedAt' | 'version' | 'downloadCount'>) => {
    const newFile: FileItem = {
      ...fileData,
      id: Date.now().toString(),
      uploadedAt: new Date(),
      version: 1,
      downloadCount: 0
    };
    setFiles(prev => [newFile, ...prev]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const updateUploadProgress = (progress: UploadProgress) => {
    setUploadProgress(prev => {
      const existing = prev.find(p => p.fileId === progress.fileId);
      if (existing) {
        return prev.map(p => p.fileId === progress.fileId ? progress : p);
      }
      return [...prev, progress];
    });

    if (progress.status === 'completed' || progress.status === 'error') {
      setTimeout(() => {
        setUploadProgress(prev => prev.filter(p => p.fileId !== progress.fileId));
      }, 2000);
    }
  };

  const setSorting = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const setFilters = (newFilters: Partial<FilterOptions>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const shareFile = (id: string) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, shared: !file.shared } : file
    ));
  };

  const downloadFile = (id: string) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, downloadCount: file.downloadCount + 1 } : file
    ));
  };

  return (
    <FileContext.Provider value={{
      files,
      uploadProgress,
      sortField,
      sortDirection,
      filters,
      addFile,
      removeFile,
      updateUploadProgress,
      setSorting,
      setFilters,
      shareFile,
      downloadFile
    }}>
      {children}
    </FileContext.Provider>
  );
};