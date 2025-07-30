export interface BaseKartoffelUser {
    _id?: string;
    id: string;
    displayName?: string;
    entityType: 'Soldier' | 'Civilian' | 'GoalUser';
    identityCard?: string;
    personalNumber?: string;
    goalUserId?: string;
    firstName: string;
    lastName: string;
    fullName: string;
    mail?: string;
    jobTitle?: string;
    phone: string[];
    mobilePhone: string[];
    jabberPhone: string[];
    coloredClearance: string;
    clearance?: string;
    fullClearance?: string;
    directGroup?: string;
    commanderOf: string[];
    hierarchy?: string;
    hierarchyIds: string[];
    akaUnitHierarchy: string[];
    akaUnit?: string;
    address?: string;
    rank?: string;
    serviceType?: string;
    birthDate?: string;
    dischargeDay?: string;
    sex?: 'male' | 'female';
    isAmanAssociated: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface KartoffelUser extends Omit<BaseKartoffelUser, 'digitalIdentities'> {
    _id: string;
}
