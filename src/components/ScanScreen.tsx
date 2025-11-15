import React from 'react';
import { GoveeDevice } from '../services/GoveeService';
import DeviceCard from './DeviceCard';
import LoadingSpinner from './LoadingSpinner';

interface ScanScreenProps {
  devices: GoveeDevice[];
  selectedDeviceIds: string[];
  isScanning: boolean;
  isConnecting: boolean;
  onScan: () => void;
  onToggleSelect: (deviceId: string) => void;
  onConnect: () => void;
}

const ScanScreen: React.FC<ScanScreenProps> = ({
  devices,
  selectedDeviceIds,
  isScanning,
  isConnecting,
  onScan,
  onToggleSelect,
  onConnect
}) => {
  return (
    <div className="w-full h-full bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-3 border-b-2 border-gray-800">
        <h1 className="text-white text-3xl font-bold">Govee Thing</h1>
        
        {devices.length > 0 && !isScanning && (
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg text-sm transition-colors"
            onClick={onScan}
          >
            Scan Again
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-4">
        {devices.length === 0 && (!isScanning && !isConnecting) ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-400 text-xl">No devices found yet</p>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 px-12 rounded-xl text-xl transition-colors flex items-center gap-3 shadow-lg"
              onClick={onScan}
            >
              Scan for Devices
            </button>
          </div>
        ) : (isScanning || isConnecting) ? (
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="large" />
            <p className="text-gray-300 text-2xl font-semibold">{isScanning ? "Scanning for devices..." : "Connecting to devices..."}</p>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-300 text-xl font-semibold">
                Found {devices.length} device{devices.length !== 1 ? 's' : ''}
              </p>
              <button 
                className={`font-bold py-3 px-8 rounded-xl text-lg transition-colors shadow-lg ${
                  selectedDeviceIds.length > 0
                    ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
                onClick={selectedDeviceIds.length > 0 ? onConnect : undefined}
                disabled={selectedDeviceIds.length === 0}
              >
                Connect {selectedDeviceIds.length > 0 ? `(${selectedDeviceIds.length})` : ''}
              </button>
            </div>

            {/* Device Cards Scrollable Container */}
            <div className="overflow-x-auto pb-6">
              <div className="flex gap-6 min-w-min px-4 py-2">
                {devices.map((device) => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                    isSelected={selectedDeviceIds.includes(device.id)}
                    onToggleSelect={onToggleSelect}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanScreen;
