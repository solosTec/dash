import {RootAccessDevice, RootAccessRightsRole} from '@/backend-api/root-access-rights';

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
