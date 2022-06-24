import { AnyEntityManager } from "@src/controllers/entity-manager.controller/entity-manager";
import { RoleCode } from "@src/generated/model.types";
import { ProjectDAO, ProjectInviteDAO, ProjectMemberDAO } from "@src/generated/typetta";
import { SecurityPermissions } from "@src/shared/security";
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
      // Find all invites that belong to the user
      const invites = await entityManager.projectInvite.findAll({
        filter: { userId },
        projection: { id: true }
      });
      return {
        READ_USER_PRIVATE: [{ userId }],
        UPDATE_USER: [{ userId }],
        MANAGE_USER_ROLES: [{ userId }],
        MANAGE_EBOARD_ROLES: [{ userId }],
        MANAGE_PROJECT_INVITES: invites.map(x => ({ projectInviteId: x.id })),
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
        MANAGE_PROJECT_INVITES: true,
        MANAGE_PROJECT_MEMBER: true,
        MANAGE_USER_ROLES: true,
        MANAGE_PROJECT_MEMBER_ROLES: true,
        MANAGE_EBOARD_ROLES: true
      };
    }
  },
  [RoleCode.SuperAdmin]: {
    async getSecurityPermissions(entityManager, userId) {
      return {
        DELETE_USER: true,
        DELETE_PROJECT: true,
        MANAGE_EBOARD: true,
        TRANSFER_PROJECT_OWNERSHIP: true
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

      return {
        // Only admins can delete projects for now
        // DELETE_PROJECT: [ projectMember.projectId ]
        TRANSFER_PROJECT_OWNERSHIP: [ projectMember.projectId ]
      };
    }
  },

  [RoleCode.ProjectOfficer]: {
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

      const invites = await entityManager.projectInvite.findAll({
        filter: { projectId: projectMember.projectId },
        projection: ProjectInviteDAO.projection({
          id: true
        })
      });

      let finalPermissions: SecurityPermissions = {
        UPDATE_PROJECT: [{ projectId: projectMember.projectId }],
        MANAGE_PROJECT_INVITES: invites.map(x => ({ projectInviteId: x.id })),
      };

      // Get all member permissions, so we can edit them
      for (const member of project.members) {
        const permissions = await RoleBackendDataDict[RoleCode.ProjectMember]?.getSecurityPermissions(entityManager, member.id);

        if (!permissions)
          throw new Error("Expected ProjectMember permissions to be defined!");

        finalPermissions = mergeSecurityPermissions(finalPermissions, permissions);
      }

      return finalPermissions;
    }
  },

  [RoleCode.ProjectMember]: {
    async getSecurityPermissions(entityManager, projectMemberId) {
      return {
        MANAGE_PROJECT_MEMBER: [{ projectMemberId }],
        MANAGE_PROJECT_MEMBER_ROLES: [{ projectMemberId }]
      };
    }
  },
// #endregion // -- PROJECT MEMBER ROLES ----- //
}