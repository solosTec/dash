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

export interface BHardwarePort {
  databits: 5 | 6 | 7 | 8 | 9;
  parity: "odd" | "even" | "none";
  stopbits: "one" | "onepointfive" | "two";
  flowcontrol: "software" | "hardware";
}

export interface BHardwarePorts {
  [brokerName: string]: BHardwarePort;
}
