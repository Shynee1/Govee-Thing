import React, { useState } from 'react';
import { GoveeDevice } from '../services/GoveeService';
import ColorWheel from './ColorWheel';
import ConfirmDialog from './ConfirmDialog';

interface ControlScreenProps {
  devices: GoveeDevice[];
  onColorChange: (r: number, g: number, b: number) => void;
  onBrightnessChange: (brightness: number) => void;
  onColorTemperatureChange: (kelvin: number) => void;
  onPowerToggle: (on: boolean, brightness?: number) => void;
  onDisconnect: () => void;
}

const ControlScreen: React.FC<ControlScreenProps> = ({
  devices,
  onColorChange,
  onBrightnessChange,
  onColorTemperatureChange,
  onPowerToggle,
  onDisconnect
}) => {
  const [brightness, setBrightness] = useState(100);
  const [colorTemperature, setColorTemperature] = useState(4000);
  const [isPoweredOn, setIsPoweredOn] = useState(true);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setBrightness(value);
    onBrightnessChange(value);
  };

  const handleColorTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setColorTemperature(value);
    onColorTemperatureChange(value);
  };

  const handlePowerToggle = () => {
    const newState = !isPoweredOn;
    setIsPoweredOn(newState);
    if (newState) {
      onPowerToggle(newState, brightness);
    } else {
      onPowerToggle(newState);
    }
  };

  const handlePresetColor = (r: number, g: number, b: number) => {
    onColorChange(r, g, b);
  };

  const handleDisconnectClick = () => {
    setShowDisconnectConfirm(true);
  };

  const handleConfirmDisconnect = () => {
    setShowDisconnectConfirm(false);
    onDisconnect();
  };

  const handleCancelDisconnect = () => {
    setShowDisconnectConfirm(false);
  };

  return (
    <div className="w-full h-full bg-black flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-gray-800">
        {/* Back Arrow */}
        <button 
          className="p-3 hover:bg-gray-800 rounded-xl transition-colors"
          onClick={handleDisconnectClick}
          title="Disconnect"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
        </button>

        {/* Title */}
        <div className="text-white text-2xl font-bold">Govee Thing</div>

        {/* Power Button */}
        <button 
          className={`p-4 rounded-full transition-all ${
            isPoweredOn 
              ? 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/50' 
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={handlePowerToggle}
          title="Power"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M12 6V4m0 2a4 4 0 100 8 4 4 0 000-8zm0 0v2m0 6v2m0-2a4 4 0 100-8 4 4 0 000 8z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M12 2v4m0 12v4" 
            />
          </svg>
        </button>
      </div>

      <div className="flex flew-row w-full h-full">

        {/* Left Panel - Color Wheel */}
        <div className="w-[35%] flex items-center justify-center bg-gray-900 p-6">
          <ColorWheel
            onColorChange={onColorChange}
            size={Math.min(window.innerHeight - 120, 280)}
          />
        </div>
        
        
        {/* Right Panel - Controls */}
        <div className="bg-black flex flex-col px-6 py-3 justify-around flex-1">
        
          {/* Top - Preset Colors */}
          <div className="flex flex-col gap-2">
            <h3 className="text-white font-bold text-lg">Preset Colors</h3>
            <div className="flex gap-3 justify-between">
              {/* Red */}
              <button
                className="flex-1 bg-red-500 aspect-square rounded-lg border-2 border-gray-700 hover:border-white transition-all hover:scale-105 active:scale-95 shadow-lg max-w-[200px]"
                onClick={() => handlePresetColor(255, 0, 0)}
              />
              {/* Green */}
              <button
                className="flex-1 bg-green-500 aspect-square rounded-lg border-2 border-gray-700 hover:border-white transition-all hover:scale-105 active:scale-95 shadow-lg max-w-[200px]"
                onClick={() => handlePresetColor(0, 255, 0)}
              />
              {/* Blue */}
              <button
                className="flex-1 bg-blue-500 aspect-square rounded-lg border-2 border-gray-700 hover:border-white transition-all hover:scale-105 active:scale-95 shadow-lg max-w-[200px]"
                onClick={() => handlePresetColor(0, 0, 255)}
              />
              {/* Yellow */}
              <button
                className="flex-1 bg-yellow-500 aspect-square rounded-lg border-2 border-gray-700 hover:border-white transition-all hover:scale-105 active:scale-95 shadow-lg max-w-[200px]"
                onClick={() => handlePresetColor(255, 255, 0)}
              />
              {/* Purple */}
              <button
                className="flex-1 bg-purple-500 aspect-square rounded-lg border-2 border-gray-700 hover:border-white transition-all hover:scale-105 active:scale-95 shadow-lg max-w-[200px]"
                onClick={() => handlePresetColor(128, 0, 128)}
              />
              {/* White */}
              <button
                className="flex-1 bg-stone-50 aspect-square rounded-lg border-2 border-gray-700 hover:border-white transition-all hover:scale-105 active:scale-95 shadow-lg max-w-[200px]"
                onClick={() => handlePresetColor(255, 255, 255)}
              />
            </div>
          </div>

          {/* Middle - Brightness Slider */}
          <div className="flex flex-col gap-2">
            <h3 className="text-white font-bold text-lg">Brightness</h3>
            <div className="flex items-center gap-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={handleBrightnessChange}
                className="flex-1 h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-white font-bold text-xl min-w-[4rem] text-right">
                {brightness}%
              </span>
            </div>
          </div>

          {/* Bottom - Color Temperature Slider */}
          <div className="flex flex-col gap-2">
            <h3 className="text-white font-bold text-lg">Color Temperature</h3>
            <div className="flex items-center gap-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-orange-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                />
              </svg>
              <input
                type="range"
                min="2700"
                max="6500"
                value={colorTemperature}
                onChange={handleColorTemperatureChange}
                className="flex-1 h-3 bg-gradient-to-r from-orange-400 via-yellow-100 to-blue-300 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-white font-bold text-xl min-w-[4rem] text-right">
                {colorTemperature}K
              </span>
            </div>
          </div>

          {/* Connected Devices Info */}
          <div className="border-t border-gray-800 pt-2">
            <p className="text-gray-400 text-sm">
              Connected to {devices.length} device{devices.length !== 1 ? 's' : ''}
            </p>
          </div>

        </div>
      </div>
    
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDisconnectConfirm}
        title="Disconnect Devices?"
        message="Are you sure you want to disconnect all devices and return to the scan screen?"
        onConfirm={handleConfirmDisconnect}
        onCancel={handleCancelDisconnect}
      />
    </div>
  );
};

export default ControlScreen;
