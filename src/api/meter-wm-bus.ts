export interface MeterWMBus {
  tag: string;
  meter: string;
  address: string;
  port: number;
  aes: string; //AES Hex String
  lastSeen?: string;
}
