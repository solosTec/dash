export interface RootAccessDevice {
    id: string; // "01-e61e-57140621-36-03"
    nr: number; // 14
    raw: string; //"01e61e571406213603"
    type: number; //1 All devices of type 11 can be ignored. Type 4 is the gateway itself
}

export interface RootAccessRightsRole {
    role: number;
    user: number;
    ACCESS_PASSWORD: string;
    ACCESS_PUBLIC_KEY: string;
    ACCESS_USER_NAME: string;
    devices: RootAccessDevice[];
}

export interface RootAccessRights {
    srv: string; // "00:15:3b:02:17:74"
    values: {[roleName: string]: RootAccessRightsRole};
}

export interface UIRootAccessRightsRole extends RootAccessRightsRole {
    roleName: string;
}

export interface UIRootAccessUser {
    userName: string;
    userId: number;
}

export interface UIRootAccessMeter extends RootAccessDevice {
}

export interface UIRootAccessRights {
    server: string;
    roles: UIRootAccessRightsRole[];
    users: UIRootAccessUser[];
    meters: UIRootAccessMeter[]; // no type 11 and no type 4
}
