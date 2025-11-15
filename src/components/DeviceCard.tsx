import React from 'react';
import { GoveeDevice } from '../services/GoveeService';

interface DeviceCardProps {
  device: GoveeDevice;
  isSelected: boolean;
  onToggleSelect: (deviceId: string) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, isSelected, onToggleSelect }) => {
  return (
    <div 
      className={`flex-shrink-0 w-56 bg-gray-800 rounded-xl p-6 cursor-pointer transition-all ${
        isSelected ? 'ring-4 ring-blue-500 shadow-lg shadow-blue-500/50' : 'hover:bg-gray-700'
      }`}
      onClick={() => onToggleSelect(device.id)}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Device Image */}
        <div className="w-36 h-36 rounded-xl overflow-hidden bg-gray-700 flex items-center justify-center">
          <img 
            src="/light.jpg" 
            alt="Govee Light" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Device Name */}
        <div className="text-white font-bold text-lg text-center truncate w-full">
          {device.name}
        </div>
        
        {/* Device ID */}
        <div className="text-gray-400 text-sm text-center truncate w-full">
          {device.id}
        </div>
        
      </div>
    </div>
  );
};

export default DeviceCard;
