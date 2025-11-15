import { DeskThing } from "@deskthing/server";
import { AppSettings, DESKTHING_EVENTS, SETTING_TYPES } from "@deskthing/types";
import { Bluetooth } from "webbluetooth";
import { GoveeDevice, SERVICE_UUID } from "./GoveeDevice";

const devices = new Map<string, GoveeDevice>();
const bluetooth = new Bluetooth();
let isScanning = false;
let keepAliveInterval: NodeJS.Timeout | null = null;

function sendDeviceList() {
  const deviceList = Array.from(devices.values()).map(device => ({
    id: device['id'],
    name: device['name'],
    connected: device['connected']
  }));

  DeskThing.send({
    type: "devices",
    payload: { devices: deviceList }
  });
}

async function scanForDevices() {
  if (isScanning) {
    console.log("Already scanning for devices.");
    return;
  }

  console.log("Scanning for Govee devices...");
  isScanning = true;
  DeskThing.send({
    type: "scanStatus",
    payload: { scanning: true }
  });

  try {
    const device = await bluetooth.requestDevice({
      filters: [
        {namePrefix: "Govee_" },
        {namePrefix: "ihoment_" },
      ],
      optionalServices: [SERVICE_UUID],
    });

    if (!device) {
      console.log("No devices found.");
      return;
    }

    const goveeDevice = new GoveeDevice(device, device.name, device.id);

    devices.set(device.id, goveeDevice);
    console.log(`Discovered device: ${device.name} (${device.id})`);

    sendDeviceList();

  } catch (error) {
    console.error("Error scanning for devices:", error);
  } finally {
    DeskThing.send({
      type: "scanStatus",
      payload: { scanning: false }
    });
    isScanning = false;
  }
}


const start = async () => {
  console.log('Server Started!')

  DeskThing.on('scan', scanForDevices);

  DeskThing.on('connect', async(msg: any) => {
    const payload = msg.payload;
    const deviceIds = payload.deviceIds as string[];
    const results: boolean[] = [];

    for (const id of deviceIds) {
      const device = devices.get(id);
      if (device) {
        const success = await device.connect();
        results.push(success);
      }
    }

    sendDeviceList();
  });

  DeskThing.on('setPower', async(msg: any) => {
    const payload = msg.payload;
    const deviceIds = payload.deviceIds as string[];
    const powerState = payload.power as boolean;

    const results: boolean[] = [];
    for (const id of deviceIds) {
      const device = devices.get(id);
      if (device) {
        const success = await device.setPower(powerState);
        results.push(success);
      }
    }

    DeskThing.send({
      type: "commandResult",
      payload: { results }
    });
  });

  DeskThing.on('setBrightness', async(msg: any) => {
    const payload = msg.payload;
    const deviceIds = payload.deviceIds as string[];
    const brightness = payload.brightness as number;

    const results: boolean[] = [];
    for (const id of deviceIds) {
      const device = devices.get(id);
      if (device) {
        const success = await device.setBrightness(brightness);
        results.push(success);
      }
    }

    DeskThing.send({
      type: "commandResult",
      payload: { results }
    });
  });

  DeskThing.on('setColor', async(msg: any) => {
    const payload = msg.payload;
    const deviceIds = payload.deviceIds as string[];
    const color = payload.color as { r: number, g: number, b: number };

    const results: boolean[] = [];
    for (const id of deviceIds) {
      const device = devices.get(id);
      if (device) {
        const success = await device.setColor(color.r, color.g, color.b);
        results.push(success);
      }
    }

    DeskThing.send({
      type: "commandResult",
      payload: { results }
    });
  });

  DeskThing.on('disconnect', async(msg: any) => {
    try {
      const payload = msg.payload;
      const deviceIds = payload.deviceIds as string[];

      // Disconnect all devices with proper error handling
      const disconnectPromises = deviceIds.map(async (id) => {
        const device = devices.get(id);
        if (device) {
          try {
            await device.disconnect();
          } catch (error) {
            console.error(`Error disconnecting device ${id}:`, error);
          }
        }
        devices.delete(id);
      });

      // Wait for all disconnects to complete
      await Promise.allSettled(disconnectPromises);

      sendDeviceList();
    } catch (error) {
      console.error('Error in disconnect handler:', error);
    }
  });

  // Keep alive interval with error handling
  keepAliveInterval = setInterval(() => {
    devices.forEach(async (device) => {
      try {
        if (device.isConnected()) {
          await device.keepAlive();
        }
      } catch (error) {
        console.error('Error in keepAlive:', error);
      }
    });
  }, 2000);
};

const stop = async () => {
  // Clear the keep alive interval
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }

  // Disconnect all devices with proper async handling
  const disconnectPromises = Array.from(devices.values()).map(async (device) => {
    try {
      await device.disconnect();
    } catch (error) {
      console.error('Error disconnecting device during stop:', error);
    }
  });

  await Promise.allSettled(disconnectPromises);
  devices.clear();
  console.log('Server Stopped');
};

// Main Entrypoint of the server
DeskThing.on(DESKTHING_EVENTS.START, start);

// Main exit point of the server
DeskThing.on(DESKTHING_EVENTS.STOP, stop);