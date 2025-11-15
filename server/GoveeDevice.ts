export const SERVICE_UUID = '00010203-0405-0607-0809-0a0b0c0d1910';
export const CHARACTERISTIC_UUID = '00010203-0405-0607-0809-0a0b0c0d2b11';

export class GoveeDevice {
    private device: any;            // BluetoothDevice
    private characteristic: any;    // BluetoothRemoteGATTCharacteristic
    private name: string;
    private id: string;
    private connected: boolean;

    public constructor(device: any, name: string, id: string) {
        this.device = device;
        this.characteristic = null;
        this.name = name.split('_')[1];
        console.log("Device name original:", name, " cleaned:", this.name);
        this.id = id;
        this.connected = false;
    }

    private async sendPacket(packet: Uint8Array) : Promise<boolean> {
        if (!this.connected || !this.characteristic) {
            console.log(`Device ${this.name} is not connected.`);
            return false;   
        }

        packet[packet.length - 1] = this.calculateChecksum(packet);

        try {
            await this.characteristic.writeValueWithoutResponse(packet);
            return true;
        } catch (error) {
            console.log(`Error sending packet to device ${this.name}: ${error}`);
            return false;
        }
    }

    private calculateChecksum(packet: Uint8Array): number {
        let checksum = 0;
        for (let i = 0; i < packet.length - 1; i++) {
            checksum ^= packet[i];
        }
        return checksum;
    }

    public async connect(): Promise<boolean> {
        if (this.connected) {
            console.log(`Device ${this.name} is already connected.`);
            return true;
        }

        const server = await this.device.gatt.connect();
        if (!server) {
            console.log(`Failed to connect to device ${this.name}`);
            return false;
        }

        const service = await server.getPrimaryService(SERVICE_UUID);
        if (!service) {
            console.log(`Service not found on device ${this.name}`);
            return false;
        }

        this.characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
        if (!this.characteristic) {
            console.log(`Characteristic not found on device ${this.name}`);
            return false;
        }

        this.connected = true;
        return true;
    }

    public async disconnect(): Promise<void> {
        if (!this.connected) return;

        console.log(`Disconnecting device ${this.name}...`);

        try {
            await this.setPower(false);
        } catch (error) {
            console.log(`Could not power off device ${this.name} before disconnect:`, error);
        }

        this.connected = false;
        this.characteristic = null;
    }

    public async keepAlive(): Promise<boolean> {
        const packet = new Uint8Array(20);
        packet[0] = 0xaa;
        packet[1] = 0x01;

        return await this.sendPacket(packet);
    }

    public async setPower(on: boolean): Promise<boolean> {
        const packet = new Uint8Array(20);
        packet[0] = 0x33;
        packet[1] = 0x01;
        packet[2] = on ? 0x01 : 0x00;
        
        return await this.sendPacket(packet);
    }

    public async setBrightness(brightness: number): Promise<boolean> {
        const clampedBrightness = Math.max(0, Math.min(100, brightness));

        const packet = new Uint8Array(20);
        packet[0] = 0x33;
        packet[1] = 0x04;
        packet[2] = clampedBrightness;

        return await this.sendPacket(packet);
    }

    public async setColor(r: number, g: number, b: number): Promise<boolean> {
        const packet = new Uint8Array(20);
        packet[0] = 0x33;
        packet[1] = 0x05;
        packet[2] = 0x0D;
        packet[3] = r;
        packet[4] = g;
        packet[5] = b;

        return await this.sendPacket(packet);
    }

    public isConnected(): boolean {
        return this.connected;
    }
}