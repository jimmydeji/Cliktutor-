import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Smartphone, Monitor, Wifi, Battery, Signal, Sun, Moon } from 'lucide-react';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState<'phone' | 'fluid'>('phone');
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start transition-colors duration-200 ${
      isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Desktop Top Switcher Bar (Hidden on mobile devices) */}
      <div className={`w-full border-b px-4 py-2 hidden md:flex items-center justify-between text-xs z-50 transition-colors ${
        isDark ? 'bg-slate-800/95 border-slate-700/80 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center space-x-2">
          <span className={`font-bold flex items-center space-x-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>EasyBook Mobile App</span>
          </span>
          <span className="text-[11px] opacity-75">| Android & iOS • SS1-SS3 Science • 2006-2026 Question Banks</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Quick Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
              isDark
                ? 'bg-slate-700 border-slate-600 text-amber-400 hover:text-white'
                : 'bg-slate-50 border-slate-200 text-indigo-600'
            }`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* OS Switcher */}
          {deviceMode === 'phone' && (
            <div className={`flex items-center p-0.5 rounded-lg border ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-300'
            }`}>
              <button
                onClick={() => setPlatform('ios')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                  platform === 'ios'
                    ? isDark ? 'bg-slate-700 text-white' : 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                iOS Frame
              </button>
              <button
                onClick={() => setPlatform('android')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                  platform === 'android'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Android Frame
              </button>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className={`flex items-center p-0.5 rounded-lg border ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-300'
          }`}>
            <button
              onClick={() => setDeviceMode('phone')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-semibold transition ${
                deviceMode === 'phone'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Phone View</span>
            </button>
            <button
              onClick={() => setDeviceMode('fluid')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-semibold transition ${
                deviceMode === 'fluid'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Responsive Fullscreen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main App Container */}
      <div className={`w-full flex justify-center ${deviceMode === 'phone' ? 'md:py-5' : 'p-0'}`}>
        {deviceMode === 'phone' ? (
          <div className={`w-full max-w-[430px] min-h-[100dvh] md:min-h-[880px] md:max-h-[920px] transition-colors ${
            isDark
              ? 'bg-slate-900 md:shadow-[0_10px_50px_-10px_rgba(0,0,0,0.5)]'
              : 'bg-white md:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)]'
          } md:rounded-[44px] md:border-[7px] ${
            isDark
              ? platform === 'ios' ? 'md:border-slate-700' : 'md:border-slate-700'
              : platform === 'ios' ? 'md:border-slate-300' : 'md:border-slate-300'
          } flex flex-col overflow-hidden relative`}>
            {/* Native Mobile Status Bar simulation on Desktop preview */}
            <div className={`hidden md:flex items-center justify-between px-6 pt-3 pb-1 text-xs select-none z-40 transition-colors ${
              isDark ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-700'
            }`}>
              <span className="font-bold text-[11px] font-mono">09:41</span>
              {/* Dynamic Island / Notch */}
              <div className={`w-24 h-4 rounded-full flex items-center justify-center space-x-1.5 border ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              </div>
              <div className="flex items-center space-x-1.5">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>

            {/* App Viewport */}
            <div className={`flex-1 overflow-y-auto px-3.5 ${
              isDark ? 'bg-slate-900' : 'bg-slate-50'
            }`}>
              {children}
            </div>

            {/* Home Indicator Bar (iOS style) on Desktop preview */}
            <div className={`hidden md:flex justify-center pb-2 pt-1 ${
              isDark ? 'bg-slate-900' : 'bg-white'
            }`}>
              <div className={`w-32 h-1 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl px-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
