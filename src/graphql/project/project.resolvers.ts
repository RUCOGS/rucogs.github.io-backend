import { MutationResolvers, Permission, QueryResolvers, NewProjectPayload, RoleCode, InviteType, NewOutgoingProjectInvitePayload, NewIncomingProjectInvitePayload, AcceptProjectInvitePayload, JoinOpenProjectPayload } from '@src/generated/graphql-endpoint.types';
import { Access } from '@src/generated/model.types';
import { EntityManager, ProjectDAO, ProjectMemberPlainModel } from '@src/generated/typetta';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { daoInsertRolesBatch, HttpError, startEntityManagerTransaction } from '@src/utils';

export default {
  Mutation: {
    newProject: async (parent, args, context: ApolloResolversContext, info) => {
      if (!context.securityContext.userId)
        throw new HttpError(200, "Expected context.securityContext.userId.");
      
      // Check permissions
      if (!makePermsCalc()
          .withContext(context.securityContext)
          .hasPermission(Permission.CreateProject)) {
        throw new HttpError(401, "Not authorized!");
      }

      const userId = context.securityContext.userId;
      let response: NewProjectPayload | undefined;
      
      const error = await startEntityManagerTransaction(context.unsecureEntityManager, context.mongoClient, async (transEntityManager) => {
        const insertedProject = await transEntityManager.project.insertOne({
          record: {
            name: args.input.name,
            pitch: args.input.pitch,
            access: args.input.access,
            createdAt: Date.now()
          }
        });

        const projectOwner = await transEntityManager.projectMember.insertOne({
          record: {
            userId,
            projectId: insertedProject.id,
            createdAt: Date.now()
          }
        })

        await daoInsertRolesBatch({
          dao: transEntityManager.projectMemberRole, 
          roleCodes: [RoleCode.ProjectMember, RoleCode.ProjectOwner],
          idKey: "projectMemberId",
          id: projectOwner.id
        });

        response = {
          projectId: insertedProject.id
        }
      });
      if (error)
        throw new HttpError(400, error.message);

      return response;
    },

    // Requesting user to accept
    newOutgoingProjectInvite: async (parent, args, context: ApolloResolversContext, info) => {
      // Check permissions
      if (!makePermsCalc()
          .withContext(context.securityContext)
          .withDomain({
            projectId: [args.projectId]
          })
          .hasPermission(Permission.UpdateProject)) {
        throw new HttpError(401, "Not authorized!");
      }

      const userExists = await context.unsecureEntityManager.user.exists({
        filter: { id: args.userId }
      })
      if (!userExists)
        throw new HttpError(400, "User doesn't exist!");

      const projectExists = await context.unsecureEntityManager.project.exists({
        filter: { id: args.projectId }
      })
      if (!projectExists)
        throw new HttpError(400, "Project doesn't exist!");

      const inviteExists = await context.unsecureEntityManager.projectInvite.exists({
        filter: {
          type: InviteType.Outgoing,
          projectId: args.projectId,
          userId: args.userId,
        }
      });
      if (inviteExists)
        throw new HttpError(400, "Outgoing invite already exists!");
      
      const insertedInvite = await context.unsecureEntityManager.projectInvite.insertOne({
        record: {
          type: InviteType.Outgoing,
          projectId: args.projectId,
          userId: args.userId,
          createdAt: Date.now()
        }
      });

      return <NewOutgoingProjectInvitePayload>{
        inviteId: insertedInvite.id
      };
    },

    // Requesting project owner to accept
    newIncomingProjectInvite: async (parent, args, context: ApolloResolversContext, info) => {
      if (!context.securityContext.userId)
        throw new HttpError(200, "Expected context.securityContext.userId.");

      const userExists = await context.unsecureEntityManager.user.exists({
        filter: { id: context.securityContext.userId }
      })
      if (!userExists)
        throw new HttpError(400, "User doesn't exist!");

      const project = await context.unsecureEntityManager.project.findOne({
        filter: { id: args.projectId },
        projection: ProjectDAO.projection({
          access: true
        })
      })
      if (!project)
        throw new HttpError(400, "Project doesn't exist!");
      if (project.access !== Access.Invite)
        throw new HttpError(403, "Cannot request invite for project whose access isn't 'INVITE'!");

      const inviteExists = await context.unsecureEntityManager.projectInvite.exists({
        filter: {
          type: InviteType.Incoming,
          projectId: args.projectId,
          userId: context.securityContext.userId,
        }
      });
      if (inviteExists)
        throw new HttpError(400, "Incoming invite already exists!");
      
      const insertedInvite = await context.unsecureEntityManager.projectInvite.insertOne({
        record: {
          type: InviteType.Incoming,
          projectId: args.projectId,
          userId: context.securityContext.userId,
          createdAt: Date.now()
        }
      });

      return <NewIncomingProjectInvitePayload>{
        inviteId: insertedInvite.id
      };
    },

    acceptProjectInvite: async (parent, args, context: ApolloResolversContext, info) => {
      const invite = await context.unsecureEntityManager.projectInvite.findOne({
        filter: { id: args.inviteId }
      })

      if (!invite)
        throw new HttpError(400, "Invite doesn't exist!");

      if (invite.type === InviteType.Incoming) {
        if (!makePermsCalc()
          .withContext(context.securityContext)
          .withDomain({ projectId: [ invite.projectId ] })
          .hasPermission(Permission.UpdateProject)
        ) {
          throw new HttpError(403, "Forbidden from accepting incoming invite!");
        }
      } else if (invite.type === InviteType.Outgoing) {
        if (!makePermsCalc()
          .withContext(context.securityContext)
          .withDomain({ userId: [ invite.userId ] })
          .hasPermission(Permission.AcceptProjectInvite)
        ) {
          throw new HttpError(403, "Forbidden from accepting incoming invite!");
        }
      }

      let projectMember: ProjectMemberPlainModel | undefined;
      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager, 
        context.mongoClient,
        async (transEntitymanager) => {
          projectMember = await makeProjectMember(transEntitymanager, invite.userId, invite.projectId);
        }
      );
      
      if (error)
        throw new HttpError(400, error.message);
      if (!projectMember)
        throw new HttpError(400, "Created project member doesn't exist!");

      return <AcceptProjectInvitePayload>{
        projectMemberId: projectMember.id
      };
    },

    joinOpenProject: async (parent, args, context: ApolloResolversContext, info) => {
      const userId = context.securityContext.userId;
      if (!userId)
        throw new HttpError(400, "Expected context.securityContext.userId!"); 

      const project = await context.unsecureEntityManager.project.findOne({
        filter: { id: args.projectId },
        projection: ProjectDAO.projection({
          access: true
        })
      })
      if (!project)
        throw new HttpError(400, "Project doesn't exist!");
      
      if (project.access !== Access.Open)
        throw new HttpError(403, "Project access is not 'OPEN'!");

      let projectMember: ProjectMemberPlainModel | undefined;
      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager) => {
          projectMember = await makeProjectMember(transEntityManager, userId, args.projectId)
        }
      );

      return <JoinOpenProjectPayload>{
        projectMemberId: projectMember?.id
      }
    }
  }
} as { Query: QueryResolvers, Mutation: MutationResolvers };

async function makeProjectMember(entityManager: EntityManager, userId: string, projectId: string) {
  const member = await entityManager.projectMember.insertOne({
    record: {
      userId: userId,
      projectId: projectId,
      createdAt: Date.now()
    }
  })
  await daoInsertRolesBatch({
    dao: entityManager.projectMemberRole, 
    roleCodes: [ RoleCode.ProjectMember ], 
    idKey: "projectMemberId", 
    id: member.projectId
  });
  return member;
}