import { MutationResolvers, QueryResolvers, SubscriptionResolvers } from '@src/generated/graphql-endpoint.types';
import { Permission, Project, RoleCode } from '@src/generated/model.types';
import { EntityManager, ProjectDAO, ProjectMemberDAO, ProjectMemberFilter, UserDAO } from '@src/generated/typetta';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc, RoleType } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { assertProjectHasMember, assertProjectHasOwner } from '@src/shared/validation';
import {
  assertRequesterCanManageRoleCodes,
  assertRolesAreOfType,
  daoInsertRolesBatch,
  isDefined,
  startEntityManagerTransaction,
} from '@src/utils';
import { PartialDeep } from 'type-fest';
import pubsub, { PubSubEvents } from '../pubsub';
import { makeSubscriptionResolver } from '../subscription-resolver-builder';

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
    updateProjectMember: async (parent, args, context: ApolloResolversContext, info) => {
      const permCalc = makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          projectMemberId: [args.input.id],
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
        async (transEntityManager) => {
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

            await daoInsertRolesBatch({
              dao: transEntityManager.projectMemberRole,
              roleCodes: args.input.roles,
              idKey: 'projectMemberId',
              id: args.input.id,
            });
          }

          await transEntityManager.projectMember.updateOne({
            filter: { id: args.input.id },
            changes: {
              ...(isDefined(args.input.contributions) && {
                contributions: args.input.contributions,
              }),
            },
          });
        },
      );
      if (error) throw error;

      const updatedProjectMember = await context.unsecureEntityManager.projectMember.findOne({
        filter: { id: args.input.id },
      });
      pubsub.publish(PubSubEvents.ProjectMemberUpdated, updatedProjectMember);
      return true;
    },

    deleteProjectMember: async (parent, args, context: ApolloResolversContext, info) => {
      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          projectMemberId: [args.id],
        })
        .assertPermission(Permission.ManageProjectMember);

      const projectMember = await context.unsecureEntityManager.projectMember.findOne({
        filter: { id: args.id },
        projection: { projectId: true },
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
        async (transEntityManager) => {
          await deleteProjectMembers(transEntityManager, { id: args.id });
        },
      );
      if (error) throw error;

      return true;
    },
  },

  Subscription: {
    projectMemberCreated: makeSubscriptionResolver()
      .pubsub(PubSubEvents.ProjectMemberCreated)
      .shallowOneToOneFilter()
      .mapId()
      .build(),

    projectMemberUpdated: makeSubscriptionResolver()
      .pubsub(PubSubEvents.ProjectMemberUpdated)
      .shallowOneToOneFilter()
      .mapId()
      .build(),

    projectMemberDeleted: makeSubscriptionResolver()
      .pubsub(PubSubEvents.ProjectMemberDeleted)
      .shallowOneToOneFilter()
      .mapId()
      .build(),
  },
} as {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
  Subscription: SubscriptionResolvers;
};

export async function deleteProjectMembers(
  entityManager: EntityManager,
  filter: ProjectMemberFilter,
  emitSubscription: boolean = true,
) {
  const members = await entityManager.projectMember.findAll({
    filter,
  });

  if (!members) throw new HttpError(500, "Project member doesn't exist!");

  await entityManager.projectMemberRole.deleteAll({
    filter: { projectMemberId: { in: members.map((x) => x.id) } },
  });

  await entityManager.projectMember.deleteAll({
    filter,
  });

  if (emitSubscription) {
    for (const member of members) pubsub.publish(PubSubEvents.ProjectMemberDeleted, member);
  }
}
