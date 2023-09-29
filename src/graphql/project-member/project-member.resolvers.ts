import { MutationResolvers, QueryResolvers, SubscriptionResolvers } from '@src/generated/graphql-endpoint.types';
import { Permission, Project, RoleCode } from '@src/generated/model.types';
import {
  EntityManager,
  ProjectDAO,
  ProjectMemberDAO,
  ProjectMemberFilter,
  ProjectMemberInsert,
  ProjectMemberUpdate,
  UserDAO,
} from '@src/generated/typetta';
import pubsub, { PubSubEvents } from '@src/graphql/utils/pubsub';
import { makeSubscriptionResolver } from '@src/graphql/utils/subscription-resolver-builder';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc, RoleType } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { assertProjectHasMember, assertProjectHasOwner } from '@src/shared/validation';
import {
  assertRequesterCanManageRoleCodes,
  assertRolesAreOfType,
  daoInsertRolesBatch,
  FuncQueue,
  isDefined,
  startEntityManagerTransaction,
} from '@src/utils';
import { PartialDeep } from 'type-fest';
import { deleteAllProjectInvites } from '../project-invite/project-invite.resolvers';
import { regenerateSecurityContext } from '@src/controllers/security.controller';

async function getRequesterRoles(unsecureEntityManager: EntityManager, requesterUserId: string, roleEntityId: string) {
  const requesterUser = await unsecureEntityManager.user.findOne({
    filter: {
      id: requesterUserId,
    },
    projection: UserDAO.projection({
      roles: {
        roleCode: true,
      },
    }),
  });
  if (!requesterUser) throw new Error('Expected user to exist!');
  let requesterRoles: RoleCode[] = requesterUser.roles.map((x) => x.roleCode);

  const projectMember = await unsecureEntityManager.projectMember.findOne({
    filter: { id: roleEntityId },
    projection: ProjectMemberDAO.projection({
      project: {
        id: true,
      },
    }),
  });
  const requesterProjectMember = await unsecureEntityManager.projectMember.findOne({
    filter: {
      projectId: projectMember?.project.id,
      userId: requesterUserId,
    },
    projection: ProjectMemberDAO.projection({
      roles: {
        roleCode: true,
      },
    }),
  });
  if (requesterProjectMember)
    requesterRoles = requesterRoles.concat(requesterProjectMember.roles.map((x) => x.roleCode));

  return requesterRoles;
}

export default {
  Mutation: {
    newProjectMember: async (parent, args, context: ApolloResolversContext, info) => {
      makePermsCalc().withContext(context.securityContext).assertPermission(Permission.CreateProjectMember);

      let projectMemberId = '';
      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager, postTransFuncQueue) => {
          await deleteAllProjectInvites({
            entityManager: context.unsecureEntityManager,
            filter: {
              userId: args.input.userId,
              projectId: args.input.projectId,
            },
            subFuncQueue: postTransFuncQueue,
          });
          const projectMember = await makeProjectMember({
            entityManager: context.unsecureEntityManager,
            record: {
              ...args.input,
            },
            subFuncQueue: postTransFuncQueue,
          });
          projectMemberId = projectMember.id;
        },
      );
      if (error instanceof Error) throw new HttpError(400, error.message);

      await regenerateSecurityContext(context.unsecureEntityManager, args.input.userId);
      
      return projectMemberId;
    },

    updateProjectMember: async (parent, args, context: ApolloResolversContext, info) => {
      const permCalc = makePermsCalc().withContext(context.securityContext).withDomain({
        projectMemberId: args.input.id,
      });

      permCalc.assertPermission(Permission.ManageProjectMember);

      const projectMember = await context.unsecureEntityManager.projectMember.findOne({
        filter: { id: args.input.id },
        projection: {
          projectId: true,
        },
      });
      if (!projectMember) throw new HttpError(400, "Project member doesn't exist!");

      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager, postTransFuncQueue) => {
          if (!context.securityContext.userId) throw new HttpError(400, 'Expected context.securityContext.userId!');

          if (isDefined(args.input.roles)) {
            permCalc.assertPermission(Permission.ManageProjectMemberRoles);
            const requesterRoleCodes = await getRequesterRoles(
              transEntityManager,
              context.securityContext.userId,
              args.input.id,
            );
            if (!args.input.roles.some((x) => x === RoleCode.ProjectMember))
              throw new HttpError(400, 'Project Member must have Project Member role!');
            assertRolesAreOfType(args.input.roles, RoleType.ProjectMember);
            assertRequesterCanManageRoleCodes(requesterRoleCodes, args.input.roles);
            const project = await transEntityManager.project.findOne({
              filter: { id: projectMember.projectId },
              projection: ProjectDAO.projection({
                members: {
                  roles: {
                    roleCode: true,
                  },
                },
              }),
            });
            if (!project) throw new HttpError(200, "Project doesn't exist! DB state may be corrupted.");

            assertProjectHasOwner(project as PartialDeep<Project>);
            assertProjectHasMember(project as PartialDeep<Project>);
          }

          await updateProjectMember({
            entityManager: transEntityManager,
            filter: { id: args.input.id },
            changes: {
              ...(isDefined(args.input.contributions) && {
                contributions: args.input.contributions,
              }),
            },
            roles: args.input.roles,
            subFuncQueue: postTransFuncQueue,
          });
        },
      );
      if (error instanceof Error) throw new HttpError(400, error.message);

      if (isDefined(args.input.roles)) {
        let projectMember = await context.unsecureEntityManager.projectMember
          .findOne({
            filter: { id: args.input.id }, 
            projection: { userId: true }
          });
        if (projectMember)
          await regenerateSecurityContext(context.unsecureEntityManager, projectMember.userId);
      }

      return true;
    },

    deleteProjectMember: async (parent, args, context: ApolloResolversContext, info) => {
      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          projectMemberId: args.id,
        })
        .assertPermission(Permission.ManageProjectMember);

      const projectMember = await context.unsecureEntityManager.projectMember.findOne({
        filter: { id: args.id },
        projection: { projectId: true, userId: true },
      });
      if (!projectMember) throw new HttpError(400, "Project member doesn't exist!");

      // Simualte what would happen if we removed this member
      const project = await context.unsecureEntityManager.project.findOne({
        filter: { id: projectMember.projectId },
        projection: ProjectDAO.projection({
          members: {
            id: true,
            roles: {
              roleCode: true,
            },
          },
        }),
      });
      if (!project) throw new HttpError(200, "Project doesn't exist! DB state may be corrupted.");
      project.members = project.members.filter((x) => x.id !== args.id);

      assertProjectHasMember(project as PartialDeep<Project>);

      const error = await startEntityManagerTransaction(
        context.unsecureEntityManager,
        context.mongoClient,
        async (transEntityManager, postTransFuncQueue) => {
          await deleteProjectMember({
            entityManager: transEntityManager,
            filter: { id: args.id },
            subFuncQueue: postTransFuncQueue,
          });
        },
      );
      if (error instanceof Error) throw new HttpError(400, error.message);

      if (projectMember)
        await regenerateSecurityContext(context.unsecureEntityManager, projectMember.userId);

      return true;
    },
  },

  Subscription: {
    projectMemberCreated: makeSubscriptionResolver()
      .pubsub(PubSubEvents.ProjectMemberCreated)
      .shallowOneToOneFilter()
      .build(),

    projectMemberUpdated: makeSubscriptionResolver()
      .pubsub(PubSubEvents.ProjectMemberUpdated)
      .shallowOneToOneFilter()
      .build(),

    projectMemberDeleted: makeSubscriptionResolver()
      .pubsub(PubSubEvents.ProjectMemberDeleted)
      .shallowOneToOneFilter()
      .build(),
  },
} as {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
  Subscription: SubscriptionResolvers;
};

export async function makeProjectMember(options: {
  entityManager: EntityManager;
  record: ProjectMemberInsert;
  additionalRoles?: RoleCode[];
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, record, additionalRoles = [], emitSubscription = true, subFuncQueue } = options;
  const member = await entityManager.projectMember.insertOne({ record });
  await daoInsertRolesBatch({
    dao: entityManager.projectMemberRole,
    roleCodes: [RoleCode.ProjectMember, ...additionalRoles],
    idKey: 'projectMemberId',
    id: member.id,
  });
  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.ProjectMemberCreated, member, subFuncQueue);
  return member;
}

export async function updateProjectMember(options: {
  entityManager: EntityManager;
  filter: ProjectMemberFilter;
  changes: ProjectMemberUpdate;
  roles?: RoleCode[] | null;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, changes, roles, emitSubscription = true, subFuncQueue } = options;
  const member = await entityManager.projectMember.findOne({ filter, projection: { id: true } });
  if (!member) throw new HttpError(400, 'Expected ProjectMember to not be null during update!');
  await entityManager.projectMember.updateOne({ filter, changes });
  if (roles)
    await daoInsertRolesBatch({
      dao: entityManager.projectMemberRole,
      roleCodes: roles,
      idKey: 'projectMemberId',
      id: member.id,
    });
  const updatedMember = await entityManager.projectMember.findOne({ filter });
  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.ProjectMemberUpdated, updatedMember, subFuncQueue);
  return member;
}

export async function deleteProjectMember(options: {
  entityManager: EntityManager;
  filter: ProjectMemberFilter;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, emitSubscription = true, subFuncQueue } = options;
  const member = await entityManager.projectMember.findOne({ filter });
  if (!member) throw new HttpError(400, 'Expected ProjectMember to not be null during delete!');
  await entityManager.projectMemberRole.deleteOne({
    filter: { projectMemberId: member.id },
  });
  await entityManager.projectMember.deleteOne({ filter });
  if (emitSubscription) pubsub.publishOrAddToFuncQueue(PubSubEvents.ProjectMemberDeleted, member, subFuncQueue);
}

export async function deleteAllProjectMembers(options: {
  entityManager: EntityManager;
  filter: ProjectMemberFilter;
  emitSubscription?: boolean;
  subFuncQueue?: FuncQueue;
}) {
  const { entityManager, filter, emitSubscription = true, subFuncQueue } = options;
  const members = await entityManager.projectMember.findAll({ filter });
  await entityManager.projectMemberRole.deleteAll({
    filter: { projectMemberId: { in: members.map((x) => x.id) } },
  });
  await entityManager.projectMember.deleteAll({ filter });
  if (emitSubscription) {
    for (const member of members)
      pubsub.publishOrAddToFuncQueue(PubSubEvents.ProjectMemberDeleted, member, subFuncQueue);
  }
}
