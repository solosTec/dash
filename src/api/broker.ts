export interface BBrokerAddress {
    host: string;
    service: number;
}

export interface BBroker {
    hardwarePort: string;
    transparent: boolean;
    addresses: BBrokerAddress[];
}
