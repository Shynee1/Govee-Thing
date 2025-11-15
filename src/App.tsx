import React, { useEffect, useState } from "react";
import { DeskThing } from "@deskthing/client";
import { GoveeService, type GoveeDevice } from "./services/GoveeService";
import ScanScreen from "./components/ScanScreen";
import ControlScreen from "./components/ControlScreen";

type ServerData = {
  type: string,
  payload: any
};

type Screen = 'scan' | 'control';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('scan');
  const [devices, setDevices] = useState<GoveeDevice[]>([]);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<GoveeDevice[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  useEffect(() => {
    const removeDevicesListener = DeskThing.on('devices', (data: ServerData) => {
      if (!data.payload?.devices) return;

      const updatedDevices = data.payload.devices as GoveeDevice[];
      setDevices(updatedDevices);

      // Devices are resent after connect command is completed
      // We need to update connected devices and switch screen
      if (!isConnecting) return;

      const connected = updatedDevices.filter(d => selectedDeviceIds.includes(d.id) && d.connected);

      if (connected.length > 0){
        setConnectedDevices(connected);
        setCurrentScreen('control');
        setIsConnecting(false);
      }
    });

    const removeCommandResultListener = DeskThing.on('commandResult', (data: ServerData) => {
      if (!data.payload?.results) return;

      const results = data.payload.results as boolean[];
      const allFailed = !results.some(r => r === true);
        
      if (isConnecting && allFailed) {
        setIsConnecting(false);
        setDevices([]);
        setSelectedDeviceIds([]);
      }
      
    });

    const removeScanStatusListener = DeskThing.on('scanStatus', (data: ServerData) => {
      if (data.payload?.scanning !== undefined) {
        setIsScanning(data.payload.scanning);
        if (!data.payload.scanning) {
          console.log("Scan complete");
        }
      }
    });

    return () => {
      removeDevicesListener();
      removeCommandResultListener();
      removeScanStatusListener();
    };
  }, [selectedDeviceIds, devices, isConnecting]);

  const handleScan = () => {
    GoveeService.scanForDevices();
  };

  const handleToggleSelect = (deviceId: string) => {
    setSelectedDeviceIds(prev => 
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleConnect = () => {
    const devicesToConnect = devices.filter(d => selectedDeviceIds.includes(d.id));
    if (devicesToConnect.length > 0) {
      setIsConnecting(true);
      GoveeService.connect(devicesToConnect);
    }
  };

  const handleColorChange = (r: number, g: number, b: number) => {
    if (connectedDevices.length > 0) {
      GoveeService.setColor(connectedDevices, r, g, b);
    }
  };

  const handleBrightnessChange = (brightness: number) => {
    if (connectedDevices.length > 0) {
      GoveeService.setBrightness(connectedDevices, brightness);
    }
  };

  const handlePowerToggle = (on: boolean) => {
    if (connectedDevices.length > 0) {
      GoveeService.setPower(connectedDevices, on);
    }
  };

  const handleDisconnect = () => {
    if (connectedDevices.length > 0) {
      GoveeService.disconnect(connectedDevices);
    }
    setConnectedDevices([]);
    setSelectedDeviceIds([]);
    setCurrentScreen('scan');
  };

  return (
    <div className="w-screen h-screen overflow-hidden">
      {currentScreen === 'scan' ? (
        <ScanScreen
          devices={devices}
          selectedDeviceIds={selectedDeviceIds}
          isScanning={isScanning}
          isConnecting={isConnecting}
          onScan={handleScan}
          onToggleSelect={handleToggleSelect}
          onConnect={handleConnect}
        />
      ) : (
        <ControlScreen
          devices={connectedDevices}
          onColorChange={handleColorChange}
          onBrightnessChange={handleBrightnessChange}
          onPowerToggle={handlePowerToggle}
          onDisconnect={handleDisconnect}
        />
      )}
    </div>
  );
};

export default App;
