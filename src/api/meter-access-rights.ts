export const nonRightsCodes = [
  "nr",
  "role",
  "user",
  "010000090B00",
  "81818164010E"
];

export interface MeterAccessRights {
  srv: string; // "00:15:3b:02:17:74"
  values: { [code: string]: string | number };
}
