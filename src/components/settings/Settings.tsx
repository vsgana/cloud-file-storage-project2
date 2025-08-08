import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  HardDrive, 
  Globe, 
  Lock,
  Save
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    fileSharing: true,
    autoBackup: false,
    twoFactorAuth: false,
    downloadNotifications: true,
    storageAlerts: true
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingsSections = [
    {
      title: 'Profile',
      icon: User,
      items: [
        {
          label: 'Full Name',
          value: user?.name || '',
          type: 'input'
        },
        {
          label: 'Email Address',
          value: user?.email || '',
          type: 'input'
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Email Notifications',
          description: 'Receive email notifications for file activities',
          value: settings.emailNotifications,
          type: 'toggle',
          key: 'emailNotifications'
        },
        {
          label: 'Download Notifications',
          description: 'Get notified when someone downloads your files',
          value: settings.downloadNotifications,
          type: 'toggle',
          key: 'downloadNotifications'
        },
        {
          label: 'Storage Alerts',
          description: 'Receive alerts when storage is running low',
          value: settings.storageAlerts,
          type: 'toggle',
          key: 'storageAlerts'
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        {
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          value: settings.twoFactorAuth,
          type: 'toggle',
          key: 'twoFactorAuth'
        },
        {
          label: 'File Sharing',
          description: 'Allow others to share files with you',
          value: settings.fileSharing,
          type: 'toggle',
          key: 'fileSharing'
        }
      ]
    },
    {
      title: 'Storage',
      icon: HardDrive,
      items: [
        {
          label: 'Auto Backup',
          description: 'Automatically backup files to secondary storage',
          value: settings.autoBackup,
          type: 'toggle',
          key: 'autoBackup'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account preferences and security settings
        </p>
      </div>

      {settingsSections.map((section) => {
        const Icon = section.icon;
        return (
          <div key={section.title} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {section.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <label className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.label}
                      </label>
                      {item.type === 'toggle' && (
                        <button
                          onClick={() => handleSettingChange(item.key!, !item.value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                  
                  {item.type === 'input' && (
                    <div className="w-64">
                      <input
                        type="text"
                        value={item.value as string}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};