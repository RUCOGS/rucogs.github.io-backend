import { AnyEntityManager } from "@src/controllers/entity-manager.controller";
import { RoleCode } from "@src/generated/model.types";
import { SecurityContext, PermissionCode } from "@src/shared/security";
import { PERMISSION } from "@twinlogix/typetta";

export const RoleBackendData: {
  [key in RoleCode]?: {
    getSecurityContext: (entityManager: AnyEntityManager, id: string) => Promise<SecurityContext>;
  }
} = {
// #region // ----- USER ROLES ----- //
  [RoleCode.User]: {
    async getSecurityContext(entityManager, userId) {
      return {
        READ_PROFILE_PRIVATE: [{ userId: userId }],
        UPDATE_PROFILE: [{ userId: userId }],
        MANAGE_USER_ROLES: [{ userId: userId }],
        CREATE_PROJECT: true, 
      };
    },
  },
  [RoleCode.Moderator]: {
    async getSecurityContext(entityManager, userId) {
      return {
        UPDATE_PROFILE: true,
        CREATE_PROJECT: true,
        UPDATE_PROJECT: true,
        READ_PROFILE_PRIVATE: true,
        MANAGE_USER_ROLES: true,
        MANAGE_PROJECT_MEMBER_ROLES: true,
      };
    }
  },
  [RoleCode.SuperAdmin]: {
    async getSecurityContext(entityManager, userId) {
      return {
        DELETE_PROFILE: true,
        DELETE_PROJECT: true,
        MANAGE_USER_ROLES: true,
        MANAGE_EBOARD: true,
      }
    }
  },
// #endregion // -- USER ROLES ----- //

// #region // ----- PROJECT MEMBER ROLES ----- //
  [RoleCode.ProjectOwner]: {
    async getSecurityContext(entityManager, projectMemberId) {
      const projectMember = await entityManager.projectMember.findOne({
        filter: {
          id: projectMemberId,
        },
        projection: {
          projectId: true
        }
      });

      return {
        MANAGE_PROJECT_MEMBER_ROLES: [{ projectMemberId: projectMemberId }] ,
        UPDATE_PROJECT: [{ projectId: projectMember?.projectId }],
      }
    }
  }
// #endregion // -- PROJECT MEMBER ROLES ----- //
}

export const SecurityPolicies = {
  user: {
    domain: {
      userId: "id",
    },
    permissions: {
      UPDATE_PROFILE: PERMISSION.UPDATE_ONLY,
      DELETE_PROFILE: PERMISSION.DELETE_ONLY,
      READ_PROFILE_PRIVATE: PERMISSION.READ_ONLY
    }, 
    defaultPermissions: {
      read: {
        __typename: true,
        avatarLink: true,
        bannerLink: true,
        createdAt: true,
        id: true,
        username: true,
        displayName: true,
        projectMembers: true,
        roles: true,
        socials: true,
        bio: true,
        
        email: false,
        loginIdentities: false,
      }
    },
  },
  project: {
    domain: {
      projectId: "id",
    },
    permissions: {
      CREATE_PROJECT: PERMISSION.CREATE_ONLY,
      DELETE_PROJECT: PERMISSION.DELETE_ONLY,
      UPDATE_PROJECT: PERMISSION.UPDATE_ONLY,
    },
    defaultPermissions: PERMISSION.READ_ONLY
  },
  userLoginIdentity: {
    domain: {
      userId: "userId",
    },
    permissions: {
      UPDATE_PROFILE: PERMISSION.ALLOW,
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  userSocial: {
    domain: {
      userId: "userId",
    },
    permissions: {
      UPDATE_PROFILE: PERMISSION.ALLOW,
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  userRole: {
    domain: {
      userId: "userId",
    },
    permissions: {
      MANAGE_USER_ROLES: PERMISSION.ALLOW,
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  projectMemberRole: {
    domain: {
      projectMemberId: "projectMemberId",
    },
    permissions: {
      MANAGE_PROJECT_MEMBER_ROLES: PERMISSION.ALLOW,
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  eBoard: {
    domain: {
      userId: "userId"
    },
    permissions: {
      MANAGE_EBOARD: PERMISSION.ALLOW
    },
    defaultPermissions: PERMISSION.READ_ONLY 
  },
  eBoardRole: {
    domain: {
      eboardId: "eboardId",
    },
    permissions: {
      MANAGE_EBOARD: PERMISSION.ALLOW,
    },
    defaultPermissions: PERMISSION.READ_ONLY
  },
};

export const ExtraData: {
  [key in PermissionCode]?: {
    getSecurityContext: (entityManager: AnyEntityManager, id: string) => Promise<SecurityContext>;
  }
} = {
}