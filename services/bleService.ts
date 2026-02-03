
export interface HeartRateCallback {
  (bpm: number): void;
}

export const connectToHeartRateDevice = async (
  onHeartRate: HeartRateCallback,
  onDisconnect: () => void
): Promise<any> => {
  const nav = navigator as any;

  if (!nav.bluetooth) {
    throw new Error("Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Bluefy on iOS.");
  }

  try {
    console.log("Requesting Bluetooth Device...");
    const device = await nav.bluetooth.requestDevice({
      filters: [{ services: ['heart_rate'] }],
      optionalServices: ['battery_service'] // Good practice to include common services
    });

    if (!device) {
      throw new Error("No device selected");
    }

    console.log("Connecting to GATT Server...");
    device.addEventListener('gattserverdisconnected', onDisconnect);

    const server = await device.gatt.connect();
    
    console.log("Getting Heart Rate Service...");
    const service = await server.getPrimaryService('heart_rate');
    
    console.log("Getting Characteristic...");
    const characteristic = await service.getCharacteristic('heart_rate_measurement');

    await characteristic.startNotifications();
    console.log("Notifications started.");

    characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
      const value = event.target.value;
      const flags = value.getUint8(0);
      const rate16Bits = flags & 0x1;
      let bpm: number;
      
      if (rate16Bits) {
        bpm = value.getUint16(1, true); // Little Endian
      } else {
        bpm = value.getUint8(1);
      }
      
      onHeartRate(bpm);
    });

    return device;

  } catch (error: any) {
    console.error("Bluetooth connection error:", error);
    
    if (error.name === 'SecurityError' && error.message?.includes('permissions policy')) {
       throw new Error("Bluetooth blocked. The app needs 'bluetooth' permission in the iframe policy. Please ensure metadata.json is correct.");
    }
    
    if (error.name === 'NotFoundError') {
        throw new Error("User cancelled the device selection.");
    }

    throw error;
  }
};
