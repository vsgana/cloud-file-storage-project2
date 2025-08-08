import React, { useState, useMemo } from 'react';
import { FileFilters } from '../files/FileFilters';
import { FileTable } from '../files/FileTable';
import { FileUpload } from '../upload/FileUpload';
import { UserManagement } from '../admin/UserManagement';
import { StorageOverview } from '../storage/StorageOverview';
import { Settings } from '../settings/Settings';
import { useFiles } from '../../contexts/FileContext';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardProps {
  activeSection: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ activeSection }) => {
  const { files, filters } = useFiles();
  const { user } = useAuth();

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!file.name.toLowerCase().includes(searchLower) &&
            !file.tags.some(tag => tag.toLowerCase().includes(searchLower))) {
          return false;
        }
      }

      // Tags filter
      if (filters.tags.length > 0) {
        if (!filters.tags.some(tag => file.tags.includes(tag))) {
          return false;
        }
      }

      // File types filter
      if (filters.fileTypes.length > 0) {
        const fileTypeMatch = filters.fileTypes.some(type => {
          switch (type) {
            case 'PDF': return file.type.includes('pdf');
            case 'Image': return file.type.startsWith('image/');
            case 'Video': return file.type.startsWith('video/');
            case 'Audio': return file.type.startsWith('audio/');
            case 'Document': return file.type.includes('text') || file.type.includes('document');
            case 'Figma': return file.type.includes('figma');
            default: return false;
          }
        });
        if (!fileTypeMatch) return false;
      }

      return true;
    });
  }, [files, filters]);

  const sharedFiles = useMemo(() => {
    return files.filter(file => file.shared && file.uploadedBy !== user?.email);
  }, [files, user?.email]);

  const renderContent = () => {
    switch (activeSection) {
      case 'files':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Files</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Manage and organize your uploaded files
                </p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filteredFiles.length} of {files.length} files
              </div>
            </div>
            <FileFilters />
            <FileTable files={filteredFiles} />
          </div>
        );

      case 'shared':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shared with Me</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Files that have been shared with you by other users
                </p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {sharedFiles.length} files
              </div>
            </div>
            <FileTable files={sharedFiles} />
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Files</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Upload new files to your storage
              </p>
            </div>
            <FileUpload />
          </div>
        );

      case 'users':
        return user?.role === 'admin' ? <UserManagement /> : null;

      case 'storage':
        return <StorageOverview />;

      case 'settings':
        return <Settings />;

      default:
        return (
          <div className="space-y-6">
            <FileFilters />
            <FileTable files={filteredFiles} />
          </div>
        );
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {renderContent()}
      </div>
    </div>
  );
};