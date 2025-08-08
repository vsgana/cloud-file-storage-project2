import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, File } from 'lucide-react';
import { useFiles } from '../../contexts/FileContext';
import { useAuth } from '../../contexts/AuthContext';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export const FileUpload: React.FC = () => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [tags, setTags] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { addFile, updateUploadProgress } = useFiles();
  const { user } = useAuth();

  const validateFile = (file: File): string | null => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/figma',
      'application/sql',
      'text/plain',
      'application/json',
      'application/zip'
    ];

    if (file.size > maxSize) {
      return 'File size must be less than 100MB';
    }

    if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
      return 'File type not supported';
    }

    return null;
  };

  const processFiles = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    const newUploadFiles: UploadFile[] = [];

    fileArray.forEach((file) => {
      const error = validateFile(file);
      const uploadFile: UploadFile = {
        file,
        id: Date.now().toString() + Math.random().toString(36),
        progress: 0,
        status: error ? 'error' : 'pending',
        error
      };
      newUploadFiles.push(uploadFile);
    });

    setUploadFiles(prev => [...prev, ...newUploadFiles]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const simulateUpload = async (uploadFile: UploadFile) => {
    setUploadFiles(prev => 
      prev.map(f => f.id === uploadFile.id ? { ...f, status: 'uploading' } : f)
    );

    updateUploadProgress({
      fileId: uploadFile.id,
      progress: 0,
      status: 'uploading'
    });

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setUploadFiles(prev => 
        prev.map(f => f.id === uploadFile.id ? { ...f, progress } : f)
      );

      updateUploadProgress({
        fileId: uploadFile.id,
        progress,
        status: 'uploading'
      });
    }

    // Complete upload
    setUploadFiles(prev => 
      prev.map(f => f.id === uploadFile.id ? { ...f, status: 'completed', progress: 100 } : f)
    );

    updateUploadProgress({
      fileId: uploadFile.id,
      progress: 100,
      status: 'completed'
    });

    // Add to file list
    const fileTags = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    addFile({
      name: uploadFile.file.name,
      size: uploadFile.file.size,
      type: uploadFile.file.type,
      uploadedBy: user?.email || '',
      tags: fileTags,
      shared: false,
      accessLevel: 'edit'
    });

    // Remove from upload list after delay
    setTimeout(() => {
      setUploadFiles(prev => prev.filter(f => f.id !== uploadFile.id));
    }, 2000);
  };

  const uploadPendingFiles = () => {
    uploadFiles
      .filter(f => f.status === 'pending')
      .forEach(uploadFile => {
        simulateUpload(uploadFile);
      });
  };

  const removeUploadFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className={`w-12 h-12 ${dragOver ? 'text-blue-500' : 'text-gray-400'} transition-colors`} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {dragOver ? 'Drop files here' : 'Upload files'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Drag and drop files here, or click to browse
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Choose Files
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Maximum file size: 100MB. Supported formats: PDF, Images, Videos, Documents
          </p>
        </div>
      </div>

      {/* Tags Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags (optional)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter tags separated by commas (e.g., project, client, urgent)"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
        />
      </div>

      {/* Upload Queue */}
      {uploadFiles.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Upload Queue</h3>
            {uploadFiles.some(f => f.status === 'pending') && (
              <button
                onClick={uploadPendingFiles}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Upload All
              </button>
            )}
          </div>

          <div className="space-y-3">
            {uploadFiles.map((uploadFile) => (
              <div key={uploadFile.id} className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                {getStatusIcon(uploadFile.status)}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {uploadFile.file.name}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(uploadFile.file.size / 1024)} KB
                    </p>
                    {uploadFile.status === 'uploading' && (
                      <div className="flex-1 max-w-32">
                        <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadFile.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {uploadFile.status === 'uploading' && (
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        {uploadFile.progress}%
                      </span>
                    )}
                  </div>
                  {uploadFile.error && (
                    <p className="text-xs text-red-500 mt-1">{uploadFile.error}</p>
                  )}
                </div>

                <button
                  onClick={() => removeUploadFile(uploadFile.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};