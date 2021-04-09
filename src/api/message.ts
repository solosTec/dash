export type MessageSeverity =
  | "TRACE"
  | "DEBUG"
  | "INFO"
  | "WARNING"
  | "ERROR"
  | "FATAL";

export interface Message {
  gen: number;
  msg: string;
  severity: MessageSeverity;
  ts: string; //"2021-04-07T09:47:43+0000"
}
