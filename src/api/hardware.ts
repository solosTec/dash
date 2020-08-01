export interface BHardwareBroker {
    port: string; // for exaple ttyAPP0, ttyAPP1, com01
    name: string;
}

export interface BHardware {
    brokers: BHardwareBroker[];
}
