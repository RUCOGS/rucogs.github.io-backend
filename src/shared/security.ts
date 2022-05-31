import { Permission, RoleCode } from "@src/generated/model.types";

export type SecurityDomainTemplate = {
  userId: string;
  projectId: string;
  roleCode: string;
  projectMemberId: string;
}

/**
Represents a set of objects
 */
export type TypettaSecurityDomain = Partial<SecurityDomainTemplate>

export type EntityManagerMetadata = {
  operationSecurityDomain: TypettaOperationSecurityDomain;
}

/**
Represents the domain of entities we want to operate on.
The set of entities matched by a filter, which is stored in this.
The filter is shown in the example below:

Ex. 
const operationDomain = {
  userId: ["dsfdsf2023f8j3f", "w023f920sdfdsf", "fj230f89fjfef" ],
  roleCode: ["USER", "MODERATOR", "SUPER_ADMIN" ],
  roleCode: ["USER", "MODERATOR", "SUPER_ADMIN" ],
}

This will filter for a set of entities such that
for each entitiy:

  userId == "dsfdsf2023f8j3f", OR "w023f920sdfdsf", OR "fj230f89fjfef",
  AND
  roleCode == "USER", OR "MODERATOR", OR "SUPER_ADMIN",
  AND
  roleCode == "USER", OR "MODERATOR", OR "SUPER_ADMIN",

 */
export type TypettaOperationSecurityDomain = { 
  [K in keyof TypettaSecurityDomain]: SecurityDomainTemplate[K][];
}

export type CrudSecurityDomain = TypettaSecurityDomain[] | true | undefined;

/**
A class that stores the security 
permissions of a user. It contains all the
data needed to check if an operation is 
valid or not.

During an operation, the user will have
their own context generated at the start.
It will then be used to verify permissions
in other parts of the operation.
*/
export type SecurityContext = {
  /**
  Each permission holds to a SecurityDomain,
  which identifies the set of entities
  that this permission affects.
   */
  [K in Permission]?: SecurityDomain;
}

/**
Holds data that identifies the
set of objects a permission 
effects.
 */
export type SecurityDomain = {
  /**
  Field that can hold additional information
  for more complex identification.

  Ex.
    Q:  How could you prevent users from adding roles higher than 
        the highest role they currently have?
    A:  "data" could hold the roles that are available the user, 
        which lets us then prevent users from  adding roles that are
        not available to them.
   */
  data?: any[],

  /**
  Field that stores security domain for basic CRUD operations (read, write, update, delete)
  This domain is used directly in the security middleware that Typetta comes with.
   */
  crudDomain: CrudSecurityDomain
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
      [K in keyof TypettaSecurityDomain]: string
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

export const RoleDataList: {
  type: RoleType,
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

export function hasPermission(context: SecurityContext, permission: Permission) {
  return isPermDomainValidForOpDomain(context[permission] as CrudSecurityDomain, );
}

// Checks if a security permission matches the current domain.
// This method is used to check if a user has a certain permission,
// given what we want to access.
export function isPermDomainValidForOpDomain(permission: CrudSecurityDomain, operationDomain: TypettaOperationSecurityDomain) {
    if (permission === undefined)
      return false;
    if (permission == true)
      return true;
    const validDomains = permission as TypettaSecurityDomain[];
    for (const validDomain of validDomains) {
      let matchedAllDomainProps = true;
      for (const key in operationDomain) {
        if (validDomain.hasOwnProperty(key)) {
          // OperationSecurityDomain format:
          // const operationDomain = {
          //   userId: ["dsfdsf2023f8j3f", /*OR*/ "w023f920sdfdsf", /*OR*/ "fj230f89fjfef" ],
          //   /*AND*/
          //   roleCode: ["USER", /*OR*/ "MODERATOR", /*OR*/ "SUPER_ADMIN" ],
          //   /*AND*/
          //   roleCode: ["USER", /*OR*/ "MODERATOR", /*OR*/ "SUPER_ADMIN" ],
          // }
          // If we didn't get a match inside this array
          if (!((<any>operationDomain)[key].some((x: any) => x === (<any>validDomain)[key]))) {
            matchedAllDomainProps = false;
            break;
          }
        }
      }
      if (matchedAllDomainProps) {
        return true;
      }
    }
    return false;
  }