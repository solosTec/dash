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

export interface BUser {
    gen: number;
    lastAccess: string; // "2020-03-23 18:52:53.00000000"
    name: string;
    privs: any;
    pwd: string;
}
