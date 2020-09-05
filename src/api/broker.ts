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
