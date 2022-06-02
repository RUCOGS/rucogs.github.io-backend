import { AnyEntityManager } from "@src/controllers/entity-manager.controller/entity-manager";
import { RoleCode } from "@src/generated/model.types";
import { SecurityContext, PermissionCode, SecurityPermissions } from "@src/shared/security";

export type RoleBackendData = {
  getSecurityPermissions: (entityManager: AnyEntityManager, id: string) => Promise<SecurityPermissions>;
}

// CONFIG: Role backend data
export const RoleBackendDataDict: {
  [key in RoleCode]?: RoleBackendData
} = {
// #region // ----- USER ROLES ----- //
  [RoleCode.User]: {
    async getSecurityPermissions(entityManager, userId) {
      return {
        READ_PROFILE_PRIVATE: [{ userId: userId }],
        UPDATE_PROFILE: [{ userId: userId }],
        MANAGE_USER_ROLES: [{ userId: userId }],
        CREATE_PROJECT: true, 
      };
    },
  },
  [RoleCode.Moderator]: {
    async getSecurityPermissions(entityManager, userId) {
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
    async getSecurityPermissions(entityManager, userId) {
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
    async getSecurityPermissions(entityManager, projectMemberId) {
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