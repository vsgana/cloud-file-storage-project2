import React, { useMemo } from 'react';
import { 
  Download, 
  Share2, 
  MoreVertical, 
  ChevronUp, 
  ChevronDown,
  Eye,
  Edit3,
  Shield,
  Trash2
} from 'lucide-react';
import { FileItem, SortField, SortDirection } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useFiles } from '../../contexts/FileContext';

interface FileTableProps {
  files: FileItem[];
}

export const FileTable: React.FC<FileTableProps> = ({ files }) => {
  const { user } = useAuth();
  const { sortField, sortDirection, setSorting, shareFile, downloadFile } = useFiles();

  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getFileIcon = (type: string): string => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎵';
    if (type.includes('text') || type.includes('application/sql')) return '📝';
    if (type.includes('figma')) return '🎨';
    return '📁';
  };

  const getAccessIcon = (level: string) => {
    switch (level) {
      case 'admin': return <Shield className="w-4 h-4 text-red-500" />;
      case 'edit': return <Edit3 className="w-4 h-4 text-blue-500" />;
      case 'view': return <Eye className="w-4 h-4 text-gray-500" />;
      default: return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAccessLabel = (level: string) => {
    switch (level) {
      case 'admin': return 'Full Access';
      case 'edit': return 'Can Edit';
      case 'view': return 'Can View';
      default: return 'Can View';
    }
  };

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'uploadedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [files, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSorting(field, newDirection);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const canUserEdit = (file: FileItem): boolean => {
    return user?.role === 'admin' || 
           (user?.role === 'editor' && ['edit', 'admin'].includes(file.accessLevel));
  };

  const canUserDelete = (file: FileItem): boolean => {
    return user?.role === 'admin' || file.uploadedBy === user?.email;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <span>Name</span>
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('size')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <span>Size</span>
                  <SortIcon field="size" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('type')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <span>Type</span>
                  <SortIcon field="type" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tags
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Access
                </span>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('uploadedAt')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <span>Modified</span>
                  <SortIcon field="uploadedAt" />
                </button>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedFiles.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        v{file.version} • {file.downloadCount} downloads
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.size)}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {file.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                      >
                        {tag}
                      </span>
                    ))}
                    {file.tags.length > 2 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{file.tags.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {getAccessIcon(file.accessLevel)}
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {getAccessLabel(file.accessLevel)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(file.uploadedAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => downloadFile(file.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    {canUserEdit(file) && (
                      <button
                        onClick={() => shareFile(file.id)}
                        className={`p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          file.shared 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                        title={file.shared ? 'Shared' : 'Share'}
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    )}

                    {canUserDelete(file) && (
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {files.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Files className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No files found</p>
        </div>
      )}
    </div>
  );
};