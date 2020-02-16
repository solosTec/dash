export enum UserRole {
    SystemAdmin ="SystemAdmin",
    Viewer ="Viewer",
    DeviceManager = "DeviceManager"
}

export interface User {
    username: string;
    passwort: string;
    role: UserRole;
    lastAccess: string; // UTC ISO Date "2019-12-11 08:57:14.00000000"
}

export const ROLES = [UserRole.SystemAdmin, UserRole.Viewer, UserRole.DeviceManager];
