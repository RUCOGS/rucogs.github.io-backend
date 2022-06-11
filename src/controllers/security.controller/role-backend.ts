import { AnyEntityManager } from "@src/controllers/entity-manager.controller/entity-manager";
import { RoleCode } from "@src/generated/model.types";
import { ProjectDAO, ProjectMemberDAO } from "@src/generated/typetta";
import { SecurityContext, PermissionCode, SecurityPermissions } from "@src/shared/security";
import { HttpError } from '@src/shared/utils';
import { mergeSecurityPermissions } from "./security-context";

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
        READ_USER_PRIVATE: [{ userId: userId }],
        UPDATE_USER: [{ userId: userId }],
        ACCEPT_PROJECT_INVITE: [{ userId: userId }],
        CREATE_PROJECT: true, 
      };
    },
  },
  [RoleCode.Moderator]: {
    async getSecurityPermissions(entityManager, userId) {
      return {
        UPDATE_USER: true,
        CREATE_PROJECT: true,
        UPDATE_PROJECT: true,
        READ_USER_PRIVATE: true,
        ACCEPT_PROJECT_INVITE: true,
      };
    }
  },
  [RoleCode.SuperAdmin]: {
    async getSecurityPermissions(entityManager, userId) {
      return {
        DELETE_USER: true,
        DELETE_PROJECT: true,
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
        projection: ProjectMemberDAO.projection({
          projectId: true
        })
      });

      if (!projectMember)
        throw new Error("Expected project member to exist!");

      const project = await entityManager.project.findOne({
        filter: {
          id: projectMember?.projectId
        },
        projection: ProjectDAO.projection({
          members: {
            id: true
          }
        })
      })
      
      if (!project)
        throw new Error("Expected project to exist!");

      let finalPermissions: SecurityPermissions = {
        UPDATE_PROJECT: [{ projectId: projectMember.projectId }],
      };

      for (const member of project.members) {
        const permissions = await RoleBackendDataDict[RoleCode.ProjectMember]?.getSecurityPermissions(entityManager, member.id);

        if (!permissions)
          throw new Error("Expected permissions to be defined!");

        finalPermissions = mergeSecurityPermissions(finalPermissions, permissions);
      }

      return finalPermissions;
    }
  },

  [RoleCode.ProjectMember]: {
    async getSecurityPermissions(entityManager, projectMemberId) {
      return {
        UPDATE_PROJECT_MEMBER: [{ projectMemberId: projectMemberId }],
      };
    }
  },
// #endregion // -- PROJECT MEMBER ROLES ----- //
}