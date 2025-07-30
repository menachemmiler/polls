export interface GroupEntity {
  id: string;
  name: string;
  source: string;
  hierarchy: string;
  isLeaf: boolean;
  ancestors: string[];
  createdAt: Date;
  updatedAt: string;
  directGroup?: string;
}

export interface UserProfile {
  _id?: string; 
  id: string;
  displayName?: string;
  entityType: "Soldier" | "Civilian" | "GoalUser";
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
  sex?: "male" | "female";
  isAmanAssociated: boolean;
  createdAt: string;
  updatedAt: string;
}

