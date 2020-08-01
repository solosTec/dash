export interface BBrokerAddress {
    host: string;
    service: number | undefined;
}

export interface BBroker {
    hardwarePort: string;
    transparent: boolean;
    addresses: BBrokerAddress[];
}
