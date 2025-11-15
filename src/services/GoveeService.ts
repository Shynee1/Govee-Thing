import { DeskThing } from '@deskthing/client';

export interface GoveeDevice {
  id: string;
  name: string;
  connected: boolean;
}

export class GoveeService {
  public static async scanForDevices(): Promise<void> {
    DeskThing.send({ type: 'scan' });
  }

  public static async connect(devices: any[]): Promise<void> {
    DeskThing.send({
      type: 'connect',
      payload: { deviceIds: devices.map(device => device.id) }
    });
  }

  public static async setPower(devices: any[], on: boolean): Promise<void> {
    DeskThing.send({
      type: 'setPower',
      payload: { deviceIds: devices.map(device => device.id), on }
    });
  }

  public static async setBrightness(devices: any[], percent: number): Promise<void> {
    DeskThing.send({
      type: 'setBrightness',
      payload: { deviceIds: devices.map(device => device.id), brightness: percent }
    });
  }

  public static async setColor(devices: any[], red: number, green: number, blue: number): Promise<void> {
    DeskThing.send({
      type: 'setColor',
      payload: { deviceIds: devices.map(device => device.id), color: { r: red, g: green, b: blue } }
    });
  }

  public static async disconnect(devices: any[]): Promise<void> {
    DeskThing.send({
      type: 'disconnect',
      payload: { deviceIds: devices.map(device => device.id) }
    });
  }

  public static async getDevices(): Promise<void> {
    DeskThing.send({ type: 'getDevices' });
  }
};