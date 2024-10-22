import { RoleCode } from '@src/generated/graphql-endpoint.types';

// CONFIG: Roles
export enum RoleType {
  User,
  ProjectMember,
  EBoard,
}

export const RoleData: {
  [key in RoleCode]: {
    type: RoleType[];
    name: string;
    inheritPerms?: RoleCode[];
    childRoles?: RoleCode[];
  };
} = {
  // #region // ----- USER ROLES ----- //
  [RoleCode.User]: {
    type: [RoleType.User],
    name: '🙂 User',
    childRoles: [
      RoleCode.Artist,
      RoleCode.GameDesigner,
      RoleCode.Musician,
      RoleCode.SoundDesigner,
      RoleCode.Programmer,
      RoleCode.Writer,
    ],
  },
  [RoleCode.Moderator]: {
    type: [RoleType.User],
    name: '🛂 Moderator',
    inheritPerms: [RoleCode.User],
    childRoles: [
      // User Roles
      RoleCode.User,

      // EBoard Roles
      RoleCode.President,
      RoleCode.VicePresident,
      RoleCode.Eboard,
      RoleCode.EventCoordinator,
      RoleCode.CommunityManager,
      RoleCode.Webmaster,
      RoleCode.Treasurer,
      RoleCode.SocialmediaManager,
      RoleCode.BotDeveloper,
      RoleCode.ClubGraphicArtist,
      RoleCode.CommunicationsSpecialist,
      RoleCode.PromotionsManager,
      RoleCode.MerchandiseManager,
      RoleCode.PortfolioManager,

      // Project Roles
      RoleCode.ProjectOwner,
    ],
  },
  [RoleCode.SuperAdmin]: {
    type: [RoleType.User],
    name: '😎 Super Admin',
    inheritPerms: [RoleCode.Moderator],
    childRoles: [RoleCode.Moderator],
  },

  // Cosmetics
  [RoleCode.Artist]: {
    type: [RoleType.User, RoleType.ProjectMember],
    name: '🎨 Artist',
  },
  [RoleCode.SoundDesigner]: {
    type: [RoleType.User, RoleType.ProjectMember],
    name: '🔊 Sound Designer',
  },
  [RoleCode.Musician]: {
    type: [RoleType.User, RoleType.ProjectMember],
    name: '🎷 Musician',
  },
  [RoleCode.Programmer]: {
    type: [RoleType.User, RoleType.ProjectMember],
    name: '💻 Programmer',
  },
  [RoleCode.GameDesigner]: {
    type: [RoleType.User, RoleType.ProjectMember],
    name: '🏗️ Game Designer',
  },
  [RoleCode.Writer]: {
    type: [RoleType.User, RoleType.ProjectMember],
    name: '📝 Writer',
  },
  // #endregion // -- USER ROLES ----- //

  // #region // ----- EBOARD ROLES ----- //
  // EBoard Roles (Cosmetics)
  [RoleCode.Eboard]: {
    type: [RoleType.EBoard],
    name: '📘 E-Board',
  },
  [RoleCode.President]: {
    name: '👑 President',
    type: [RoleType.EBoard],
  },
  [RoleCode.VicePresident]: {
    type: [RoleType.EBoard],
    name: '🗜️ Vice President',
  },
  [RoleCode.ClubGraphicArtist]: {
    type: [RoleType.EBoard],
    name: '🎨 Club Graphic Artist',
  },
  [RoleCode.EventCoordinator]: {
    type: [RoleType.EBoard],
    name: '🌃 Event Coordinator',
  },
  [RoleCode.CommunityManager]: {
    type: [RoleType.EBoard],
    name: '🧑‍🤝‍🧑 Community Manager',
  },
  [RoleCode.SocialmediaManager]: {
    type: [RoleType.EBoard],
    name: '📤 Social Media Manager',
  },
  [RoleCode.BotDeveloper]: {
    type: [RoleType.EBoard],
    name: '🤖 Bot Developer',
  },
  [RoleCode.Treasurer]: {
    type: [RoleType.EBoard],
    name: '🏦 Treasurer',
  },
  [RoleCode.Webmaster]: {
    type: [RoleType.EBoard],
    name: '🕸️ Webmaster',
  },
  [RoleCode.CommunicationsSpecialist]: {
    type: [RoleType.EBoard],
    name: '🗣️ Communications Specialist',
  },
  [RoleCode.PromotionsManager]: {
    type: [RoleType.EBoard],
    name: '🪧 Promotions Manager',
  },
  [RoleCode.MerchandiseManager]: {
    type: [RoleType.EBoard],
    name: '👕 Merch Manager',
  },
  [RoleCode.PortfolioManager]: {
    type: [RoleType.EBoard],
    name: '📂 Portfolio Manager'
  },
  [RoleCode.PreProfessionalManager]: {
    type: [RoleType.EBoard],
    name: '🤵 Pre-Professional Manager'
  },
  
  // #endregion // -- EBOARD ROLES ----- //

  // #region // ----- PROJECT MEMBER ROLES ----- //
  // Project Member Roles
  [RoleCode.ProjectMember]: {
    type: [RoleType.ProjectMember],
    name: '🙂 Project Member',
  },
  [RoleCode.ProjectOfficer]: {
    type: [RoleType.ProjectMember],
    name: '👮 Project Officer',
    inheritPerms: [RoleCode.ProjectMember],
    childRoles: [RoleCode.ProjectMember],
  },
  [RoleCode.ProjectOwner]: {
    type: [RoleType.ProjectMember],
    name: '😇 Project Owner',
    inheritPerms: [RoleCode.ProjectOfficer],
    childRoles: [RoleCode.ProjectOfficer],
  },
  // #endregion // -- PROJECT MEMBER ROLES ----- //
};

export const RoleDataList: {
  type: RoleType[];
  name: string;
  roleCode: RoleCode;
  childRoles?: RoleCode[];
}[] = [];

for (const [key, value] of Object.entries(RoleData)) {
  RoleDataList.push({
    ...value,
    roleCode: key as RoleCode,
  });
}

export function getRolesOfType(type: RoleType) {
  return RoleDataList.filter((x) => x.type.includes(type));
}

export function isRoleAboveOrEqual(targetRole: RoleCode, currentRole: RoleCode) {
  if (targetRole == currentRole) return true;
  return isRoleAbove(targetRole, currentRole);
}

// Depth-first search for role
export function isRoleBelowOrEqual(targetRole: RoleCode, currentRole: RoleCode) {
  if (targetRole == currentRole) return true;
  const childRoles = RoleData[currentRole].childRoles;
  if (childRoles) {
    for (const childRole of childRoles) {
      if (isRoleBelowOrEqual(targetRole, childRole)) return true;
    }
  }
  return false;
}

export function getHighestRole(roles: RoleCode[]) {
  return getHighestRoles(roles)[0];
}

export function getHighestRoles(roles: RoleCode[]): RoleCode[] {
  const validRoles = new Set<RoleCode>(roles);
  for (const role of roles) {
    if (!validRoles.has(role)) continue;

    const rolesBelow = getRolesBelow(role);
    for (const otherRole of roles) {
      if (!validRoles.has(role)) continue;
      if (rolesBelow.includes(otherRole)) {
        validRoles.delete(otherRole);
      }
    }
  }
  return Array.from(validRoles.values());
}

export function getRolesBelowRoles(targetRoles: RoleCode[]) {
  const checkedRoles = new Set<RoleCode>();
  let rolesBelow: RoleCode[] = [];
  for (const role of targetRoles) {
    const childRoles = RoleData[role].childRoles;
    if (childRoles)
      for (const childRole of childRoles)
        rolesBelow = rolesBelow.concat(getRolesBelowOrEqualExitEarly(childRole, checkedRoles));
  }
  return rolesBelow;
}

export function getRolesBelowOrEqualRoles(targetRoles: RoleCode[]) {
  const checkedRoles = new Set<RoleCode>();
  let rolesBelow: RoleCode[] = [];
  for (const role of targetRoles) {
    rolesBelow = rolesBelow.concat(getRolesBelowOrEqualExitEarly(role, checkedRoles));
  }
  return rolesBelow;
}

function getRolesBelowOrEqualExitEarly(targetRole: RoleCode, checkedRoles: Set<RoleCode>) {
  if (checkedRoles.has(targetRole)) return [];
  checkedRoles.add(targetRole);
  let rolesBelow: RoleCode[] = [];
  const roleData = RoleData[targetRole];
  if (roleData && roleData.childRoles) {
    for (const child of roleData.childRoles) {
      rolesBelow = rolesBelow.concat(getRolesBelowOrEqualExitEarly(child, checkedRoles));
    }
  }
  rolesBelow.push(targetRole);
  return rolesBelow;
}

export function getRolesBelow(targetRole: RoleCode) {
  let rolesBelow: RoleCode[] = [];
  const roleData = RoleData[targetRole];
  if (roleData && roleData.childRoles) {
    for (const child of roleData.childRoles) {
      rolesBelow = rolesBelow.concat(getRolesBelowOrEqual(child));
    }
  }
  return rolesBelow;
}

export function getRolesBelowOrEqual(targetRole: RoleCode) {
  let rolesBelowOrEqual: RoleCode[] = [];
  const roleData = RoleData[targetRole];
  if (roleData && roleData.childRoles) {
    for (const child of roleData.childRoles) {
      rolesBelowOrEqual = rolesBelowOrEqual.concat(getRolesBelowOrEqual(child));
    }
  }
  rolesBelowOrEqual.push(targetRole);
  return rolesBelowOrEqual;
}

export function isRoleAbove(targetRole: RoleCode, currentRole: RoleCode) {
  return !isRoleBelowOrEqual(targetRole, currentRole);
}

export function isRoleBelow(targetRole: RoleCode, currentRole: RoleCode) {
  return targetRole !== currentRole && isRoleBelowOrEqual(targetRole, currentRole);
}

export function getInheritedPermRolesForRoles(targetRoles: RoleCode[]) {
  const checkedRoles = new Set<RoleCode>();
  let rolesBelow: RoleCode[] = [];
  for (const role of targetRoles) {
    rolesBelow = rolesBelow.concat(getInheritedPermRolesForRolesExitEarly(role, checkedRoles));
  }
  return rolesBelow;
}

function getInheritedPermRolesForRolesExitEarly(targetRole: RoleCode, checkedRoles: Set<RoleCode>) {
  if (checkedRoles.has(targetRole)) return [];
  checkedRoles.add(targetRole);
  let rolesBelow: RoleCode[] = [];
  const roleData = RoleData[targetRole];
  if (roleData && roleData.inheritPerms) {
    for (const child of roleData.inheritPerms) {
      rolesBelow = rolesBelow.concat(getInheritedPermRolesForRolesExitEarly(child, checkedRoles));
    }
  }
  rolesBelow.push(targetRole);
  return rolesBelow;
}
