export interface BBrokerAddress {
    host: string;
    service: number | undefined;
    pwd?: string;
    user?: string;
}

export interface BBroker {
    hardwarePort: string;
    addresses: BBrokerAddress[];
    login: boolean;
}

export interface BBrokerPortHardwareConfig {
    bitsPerSecond: 75 | 110 | 300 | 1200 | 2400 | 4800 | 9600 | 19200 | 38400 | 57600 | 115200;
    dataBits: 5 | 6 | 7 | 8 | 9;
    parity: 'None' | 'Odd' | 'Even' | 'Mark' | 'Space';
    stopBits: 1 | 1.5 | 2;
    flowControl: 'None';
}
