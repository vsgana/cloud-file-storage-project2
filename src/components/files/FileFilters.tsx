import React from 'react';
import { Search, Filter, Tag, Calendar, X } from 'lucide-react';
import { FilterOptions } from '../../types';
import { useFiles } from '../../contexts/FileContext';

export const FileFilters: React.FC = () => {
  const { filters, setFilters } = useFiles();

  const availableTags = ['proposal', 'client', 'urgent', 'design', 'mockup', 'ui', 'database', 'schema', 'backend'];
  const availableFileTypes = ['PDF', 'Image', 'Video', 'Audio', 'Document', 'Figma'];

  const handleSearchChange = (value: string) => {
    setFilters({ search: value });
  };

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags;
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    setFilters({ tags: newTags });
  };

  const toggleFileType = (type: string) => {
    const currentTypes = filters.fileTypes;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    setFilters({ fileTypes: newTypes });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      tags: [],
      fileTypes: [],
      dateRange: {}
    });
  };

  const hasActiveFilters = filters.search || filters.tags.length > 0 || filters.fileTypes.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Filters:</span>
          </div>

          {/* Tags Filter */}
          <div className="relative group">
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Tag className="w-4 h-4" />
              <span className="text-sm">Tags</span>
              {filters.tags.length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {filters.tags.length}
                </span>
              )}
            </button>
            
            <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-2 rounded-md text-sm transition-colors ${
                        filters.tags.includes(tag)
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* File Types Filter */}
          <div className="relative group">
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <span className="text-sm">Types</span>
              {filters.fileTypes.length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {filters.fileTypes.length}
                </span>
              )}
            </button>
            
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <div className="p-3 space-y-2">
                {availableFileTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleFileType(type)}
                    className={`w-full px-3 py-2 rounded-md text-sm text-left transition-colors ${
                      filters.fileTypes.includes(type)
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="text-sm">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm"
            >
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
              <button
                onClick={() => toggleTag(tag)}
                className="hover:text-blue-600 dark:hover:text-blue-300"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.fileTypes.map((type) => (
            <span
              key={type}
              className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded-full text-sm"
            >
              <span>{type}</span>
              <button
                onClick={() => toggleFileType(type)}
                className="hover:text-purple-600 dark:hover:text-purple-300"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};