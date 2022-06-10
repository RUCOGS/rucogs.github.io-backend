import { RoleCode } from "@src/generated/graphql-endpoint.types";

// CONFIG: Roles
export enum RoleType {
  User,
  ProjectMember,
  EBoard,
}

export const RoleData: {
  [key in RoleCode]: {
    type: RoleType[],
    name: string,
    childRoles?: RoleCode[],
  }
} = {
// #region // ----- USER ROLES ----- //
  [RoleCode.User]: {
    type: [RoleType.User],
    name: "🙂 User",
    childRoles: [
      RoleCode.Artist, 
      RoleCode.GameDesigner, 
      RoleCode.Artist, 
      RoleCode.Musician, 
      RoleCode.SoundDesigner, 
      RoleCode.Programmer
    ]
  },
  [RoleCode.Moderator]: {
    type: [RoleType.User],
    name: "🛂 Moderator",
    childRoles: [
      // User Roles
      RoleCode.User,

      // EBoard Roles
      RoleCode.Eboard,
      RoleCode.President,
      RoleCode.VicePresident,
      RoleCode.ClubGraphicArtist,
      RoleCode.Outreach,
      RoleCode.BotDeveloper,
      RoleCode.Alumni,

      // Project Roles
      RoleCode.ProjectOwner,
    ]
  },
  [RoleCode.SuperAdmin]: {
    type: [RoleType.User],
    name: "😎 Super Admin",
    childRoles: [
      RoleCode.Moderator
    ]
  },

  // Cosmetics
  [RoleCode.Artist]: {
    type: [RoleType.User, RoleType.ProjectMember],
    name: "🎨 Artist"
  },
  [RoleCode.SoundDesigner]: {
    type: [RoleType.User, RoleType.ProjectMember],
    name: "🔊 Sound Designer"
  },
  [RoleCode.Musician]: {
    type: [RoleType.User, RoleType.ProjectMember],
    name: "🎷 Musician"
  },
  [RoleCode.Programmer]: {
    type: [RoleType.User, RoleType.ProjectMember],
    name: "💻 Programmer"
  },
  [RoleCode.GameDesigner]: {
    type: [RoleType.User, RoleType.ProjectMember],
    name: "🏗️ Game Designer"
  },
  [RoleCode.Writer]: {
    type: [RoleType.User, RoleType.ProjectMember],
    name: "📝 Writer"
  },
// #endregion // -- USER ROLES ----- //

// #region // ----- EBOARD ROLES ----- //
  // EBoard Roles (Cosmetics)
  [RoleCode.Eboard]: {
    type: [RoleType.EBoard],
    name: "📘 E-Board"
  },
  [RoleCode.President]: {
    name: "👑 President",
    type: [RoleType.EBoard],
  },
  [RoleCode.VicePresident]: {
    type: [RoleType.EBoard],
    name: "🗜️ Vice President"
  },
  [RoleCode.ClubGraphicArtist]: {
    type: [RoleType.EBoard],
    name: "🎨 Club Graphic Artist"
  },
  [RoleCode.Outreach]: {
    type: [RoleType.EBoard],
    name: "📤 Outreach"
  },
  [RoleCode.BotDeveloper]: {
    type: [RoleType.EBoard],
    name: "🤖 Bot Developer"
  },
  [RoleCode.Alumni]: {
    type: [RoleType.EBoard],
    name: "💫 EBoard Alumni"
  },
  [RoleCode.Treasurer]: {
    type: [RoleType.EBoard],
    name: "🏦 Treasurer"
  },
  [RoleCode.Webmaster]: {
    type: [RoleType.EBoard],
    name: "🕸️ Webmaster"
  },
// #endregion // -- EBOARD ROLES ----- //

// #region // ----- PROJECT MEMBER ROLES ----- //
  // Project Member Roles
  [RoleCode.ProjectMember]: {
    type: [RoleType.ProjectMember],
    name: "🙂 Project Member"
  },
  [RoleCode.ProjectOwner]: {
    type: [RoleType.ProjectMember],
    name: "😇 Project Owner",
    childRoles: [
      RoleCode.ProjectMember
    ]
  },
// #endregion // -- PROJECT MEMBER ROLES ----- //
}

export const RoleDataList: {
  type: RoleType[],
  name: string,
  roleCode: RoleCode,
  childRoles?: RoleCode[],
}[] = [];

for (const [key, value] of Object.entries(RoleData)) {
  RoleDataList.push({
    ...value,
    roleCode: key as RoleCode
  });
}

export function getRolesOfType(type: RoleType) {
  return RoleDataList.filter(x => x.type.includes(type));
}

export function isRoleAboveOrEqual(targetRole: RoleCode, currentRole: RoleCode) {
  if (targetRole == currentRole)
    return true;
  return isRoleAbove(targetRole, currentRole);
}

// Depth-first search for role
export function isRoleBelowOrEqual(targetRole: RoleCode, currentRole: RoleCode) {
  if (targetRole == currentRole)
    return true;
  const childRoles = RoleData[currentRole].childRoles;
  if (childRoles) {
    for (const childRole of childRoles) {
      if (isRoleBelowOrEqual(targetRole, childRole))
        return true;
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
    if (!validRoles.has(role))
      continue;
    
    const rolesBelow = getRolesBelow(role);
    for (const otherRole of roles) {
      if (!validRoles.has(role))
        continue;
      if (rolesBelow.includes(otherRole)) {
        validRoles.delete(otherRole);
      }
    }
  }
  return Array.from(validRoles.values());
}

export function getRolesBelowOrEqualRoles(targetRoles: RoleCode[]) {
  let checkedRoles = new Set<RoleCode>();
  let rolesBelow: RoleCode[] = [];
  for (const role of targetRoles) {
    rolesBelow = rolesBelow.concat(getRolesBelowOrEqualExitEarly(role, checkedRoles));
  }
  return rolesBelow;
}

function getRolesBelowOrEqualExitEarly(targetRole: RoleCode, checkedRoles: Set<RoleCode>) {
  if (checkedRoles.has(targetRole))
    return [];
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