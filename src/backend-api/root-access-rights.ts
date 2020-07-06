export interface RootAccessRightsUser {
    [property: string]: string;
}

export interface RootAccessRightsRole {
    [user: string]: RootAccessRightsUser;
}

export interface RootAccessRights {
    srv: string; // "00:15:3b:02:17:74"
    values: {[role: string]: RootAccessRightsRole};
}

