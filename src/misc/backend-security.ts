import { AnyEntityManager } from "@src/controllers/entity-manager.controller";
import { RoleCode } from "@src/generated/model.types";
import { SecurityContext } from "@src/shared/security";
import { EntityManagerExtensions } from "@src/utils/utils";

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