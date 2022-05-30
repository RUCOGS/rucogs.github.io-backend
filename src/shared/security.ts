import { AnyEntityManager } from "@src/controllers/entity-manager.controller";
import { Permission, RoleCode, RoleSortInput } from "@src/generated/model.types";
import { OneToManyTwoWayMap, TwoWayMap } from "@src/shared/utils";

export type SecurityDomain = Partial<CompleteSecurityDomain>

export type CompleteSecurityDomain = {
  userId: string;
  projectId: string;
  roleCode: string;
  projectMemberId: string;
}

export type EntityManagerMetadata = {
  securityDomain: OperationSecurityDomain;
}

export type OperationSecurityDomain = { 
  [K in keyof SecurityDomain]: CompleteSecurityDomain[K][];
}
export type SecurityContext = {

  [K in Permission]?: SecurityDomain[] | true | undefined;
}

export type SecureEntityManagerMetadata = {
  securityDomain: OperationSecurityDomain;
}

export type PermOpDomain = boolean | {
  [key: string]: boolean
}

export type PermOpDomainBundle = {
  delete: PermOpDomain,
  read: PermOpDomain,
  create: PermOpDomain,
  update: PermOpDomain
}

export type SecurityPolicies = {
  [key: string]: {
    domain: {
      [K in keyof SecurityDomain]: string
    },
    permissions: {
      [K in Permission]?: PermOpDomainBundle
    }
    defaultPermissions: PermOpDomainBundle
  }
}

export enum RoleType {
  User,
  ProjectMember,
  EBoard,
}

export const RoleData: {
  [key in RoleCode]: {
    type: RoleType,
    name: string,
    childRoles?: RoleCode[],
  }
} = {
// #region // ----- USER ROLES ----- //
  [RoleCode.User]: {
    type: RoleType.User,
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
    type: RoleType.User,
    name: "🛂 Moderator",
    childRoles: [
      RoleCode.User,

      RoleCode.Eboard,
      RoleCode.President,
      RoleCode.VicePresident,
      RoleCode.ClubGraphicArtist,
      RoleCode.Outreach,
      RoleCode.BotDeveloper,
      RoleCode.Alumni,
    ]
  },
  [RoleCode.SuperAdmin]: {
    type: RoleType.User,
    name: "😎 Super Admin",
    childRoles: [
      RoleCode.Moderator
    ]
  },

  // Cosmetics
  [RoleCode.Artist]: {
    type: RoleType.User,
    name: "🎨 Artist"
  },
  [RoleCode.SoundDesigner]: {
    type: RoleType.User,
    name: "🔊 Sound Designer"
  },
  [RoleCode.Musician]: {
    type: RoleType.User,
    name: "🎷 Musician"
  },
  [RoleCode.Programmer]: {
    type: RoleType.User,
    name: "💻 Programmer"
  },
  [RoleCode.GameDesigner]: {
    type: RoleType.User,
    name: "🏗️ Game Designer"
  },
  [RoleCode.Writer]: {
    type: RoleType.User,
    name: "📝 Writer"
  },
// #endregion // -- USER ROLES ----- //

// #region // ----- EBOARD ROLES ----- //
  // EBoard Roles (Cosmetics)
  [RoleCode.Eboard]: {
    type: RoleType.EBoard,
    name: "📘 E-Board"
  },
  [RoleCode.President]: {
    name: "👑 President",
    type: RoleType.EBoard,
  },
  [RoleCode.VicePresident]: {
    type: RoleType.EBoard,
    name: "🗜️ Vice President"
  },
  [RoleCode.ClubGraphicArtist]: {
    type: RoleType.EBoard,
    name: "🎨 Club Graphic Artist"
  },
  [RoleCode.Outreach]: {
    type: RoleType.EBoard,
    name: "📤 Outreach"
  },
  [RoleCode.BotDeveloper]: {
    type: RoleType.EBoard,
    name: "🤖 Bot Developer"
  },
  [RoleCode.Alumni]: {
    type: RoleType.EBoard,
    name: "💫 EBoard Alumni"
  },
  [RoleCode.Treasurer]: {
    type: RoleType.EBoard,
    name: "🏦 Treasurer"
  },
  [RoleCode.Webmaster]: {
    type: RoleType.EBoard,
    name: "🕸️ Webmaster"
  },
// #endregion // -- EBOARD ROLES ----- //

// #region // ----- PROJECT MEMBER ROLES ----- //
  // Project Member Roles
  [RoleCode.ProjectMember]: {
    type: RoleType.ProjectMember,
    name: "🙂 Project Member"
  },
  [RoleCode.ProjectOwner]: {
    type: RoleType.ProjectMember,
    name: "😇 Project Owner",
    childRoles: [
      RoleCode.ProjectMember
    ]
  },
// #endregion // -- PROJECT MEMBER ROLES ----- //
}