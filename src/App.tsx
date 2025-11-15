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
        GoveeService.setBrightness(connected, 100);
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

  const handleColorTemperatureChange = (kelvin: number) => {
    if (connectedDevices.length === 0) return;

    // Convert Kelvin to RGB using simplified algorithm
    let temp = kelvin / 100;
    let r, g, b;

    // Red calculation
    if (temp <= 66) {
      r = 255;
    } else {
      r = temp - 60;
      r = 329.698727446 * Math.pow(r, -0.1332047592);
      r = Math.max(0, Math.min(255, r));
    }

    // Green calculation
    if (temp <= 66) {
      g = temp;
      g = 99.4708025861 * Math.log(g) - 161.1195681661;
    } else {
      g = temp - 60;
      g = 288.1221695283 * Math.pow(g, -0.0755148492);
    }
    g = Math.max(0, Math.min(255, g));

    // Blue calculation
    if (temp >= 66) {
      b = 255;
    } else if (temp <= 19) {
      b = 0;
    } else {
      b = temp - 10;
      b = 138.5177312231 * Math.log(b) - 305.0447927307;
      b = Math.max(0, Math.min(255, b));
    }

    GoveeService.setColor(connectedDevices, Math.round(r), Math.round(g), Math.round(b));
  };

  const handlePowerToggle = (on: boolean, brightness?: number) => {
    if (connectedDevices.length > 0) {
      if (on && brightness !== undefined) {
        GoveeService.setBrightness(connectedDevices, brightness);
      }
      else {
        GoveeService.setPower(connectedDevices, on);
      }
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
          onColorTemperatureChange={handleColorTemperatureChange}
          onPowerToggle={handlePowerToggle}
          onDisconnect={handleDisconnect}
        />
      )}
    </div>
  );
};

export default App;
