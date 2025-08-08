import React from 'react';
import { HardDrive, TrendingUp, Users, Files } from 'lucide-react';

export const StorageOverview: React.FC = () => {
  const storageData = {
    used: 45.2, // GB
    total: 100, // GB
    filesCount: 127,
    usersCount: 12,
    monthlyUpload: 8.3 // GB
  };

  const usagePercentage = (storageData.used / storageData.total) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Storage Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Monitor your storage usage and statistics
        </p>
      </div>

      {/* Storage Usage */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Storage Usage</h2>
          <HardDrive className="w-6 h-6 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Used Storage</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {storageData.used} GB of {storageData.total} GB
            </span>
          </div>
          
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                usagePercentage > 80 ? 'bg-red-500' : 
                usagePercentage > 60 ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>0 GB</span>
            <span>{usagePercentage.toFixed(1)}% used</span>
            <span>{storageData.total} GB</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Files</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {storageData.filesCount}
              </p>
            </div>
            <Files className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-4 flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400">+12% this month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {storageData.usersCount}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-4 flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400">+2 new users</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Upload</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {storageData.monthlyUpload} GB
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-4 flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400">+18% from last month</span>
          </div>
        </div>
      </div>

      {/* Storage Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Storage Breakdown</h2>
        
        <div className="space-y-4">
          {[
            { type: 'Documents', size: 15.2, color: 'bg-blue-500', percentage: 33.6 },
            { type: 'Images', size: 12.8, color: 'bg-green-500', percentage: 28.3 },
            { type: 'Videos', size: 8.4, color: 'bg-purple-500', percentage: 18.6 },
            { type: 'Audio', size: 5.1, color: 'bg-yellow-500', percentage: 11.3 },
            { type: 'Other', size: 3.7, color: 'bg-gray-500', percentage: 8.2 }
          ].map((item) => (
            <div key={item.type} className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.type}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.size} GB ({item.percentage}%)
                  </span>
                </div>
                <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};