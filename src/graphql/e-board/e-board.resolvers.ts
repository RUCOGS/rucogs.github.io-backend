import { MutationResolvers, QueryResolvers } from '@src/generated/graphql-endpoint.types';
import { EBoardInsertInput, Permission, ProjectInsertInput, RoleCode } from '@src/generated/model.types';
import { EBoardDAO, EntityManager, UserDAO } from '@src/generated/typetta';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { HttpError } from '@src/shared/utils';
import { assertRequesterCanManageRoleCodes, daoInsertRolesBatch, deleteEntityRoleResolver, EntityRoleResolverOptions, getEntityRoleCodes, getRoleCodes, isDefined, newEntityRoleResolver, startEntityManagerTransaction } from '@src/utils';

const roleResolverOptions = <EntityRoleResolverOptions>{
  entityCamelCaseName: "eBoard",
  entityName: "e-board",
  permission: Permission.ManageEboardRoles,
  async getRequesterRoles(unsecureEntityManager: EntityManager, requesterUserId: string, roleEntityId: string) {
    const requesterUser = await unsecureEntityManager.user.findOne({
      filter: {
        id: requesterUserId
      },
      projection: UserDAO.projection({
        roles: {
          roleCode: true
        }
      })
    })
    if (!requesterUser)
      throw new Error("Expected user to exist!");
    let requesterRoles: RoleCode[] = requesterUser.roles.map(x => x.roleCode);

    const requesterEboard = await unsecureEntityManager.eBoard.findOne({
      filter: {
        userId: requesterUserId
      },
      projection: EBoardDAO.projection({
        roles: {
          roleCode: true
        }
      })
    })
    if (requesterEboard)
      requesterRoles = requesterRoles.concat(requesterEboard.roles.map(x => x.roleCode));
    
    return requesterRoles;
  }
};

export default {
  Mutation: {
    newEBoard: async (parent, args, context: ApolloResolversContext, info) => {
      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: [ args.input.userId ]
        }).assertPermission(Permission.ManageEboard);
      
      const exists = await context.unsecureEntityManager.eBoard.exists({
        filter: { userId: args.input.userId }
      });
      if (exists)
        throw new HttpError(400, "EBoard already exists for this user!");
      
      let eBoardId: string = "";
      const error = await startEntityManagerTransaction(context.unsecureEntityManager, context.mongoClient, async (transEntitymanager) => {
        eBoardId = await makeEBoard(transEntitymanager, args.input);
      });

      if (error)
        throw error;
      
      return eBoardId;
    },

    updateEBoard: async (parent, args, context: ApolloResolversContext, info) => {
      const eBoard = await context.unsecureEntityManager.eBoard.findOne({
        filter: { id: args.input.id },
        projection: { userId: true }
      });
      if (!eBoard)
        throw new HttpError(400, "EBoard doesn't exist!");

      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: [ eBoard.userId ]
        }).assertPermission(Permission.ManageEboard);
      
      const error = await startEntityManagerTransaction(context.unsecureEntityManager, context.mongoClient, async (transEntityManager) => {
        if (!context.securityContext.userId)
          throw new HttpError(400, "Expected context.securityContext.userId!");
        
        if (isDefined(args.input.roles)) {
          const requesterRoleCodes = await roleResolverOptions.getRequesterRoles(transEntityManager, context.securityContext.userId, args.input.id);
          if (!args.input.roles.some(x => x === RoleCode.Eboard))
            throw new HttpError(400, "Eboard must have Eboard role!");
          assertRequesterCanManageRoleCodes(requesterRoleCodes, args.input.roles);
          await daoInsertRolesBatch({
            dao: transEntityManager.eBoardRole,
            roleCodes: args.input.roles,
            idKey: "eBoardId",
            id: args.input.id
          });
        }

        await transEntityManager.eBoard.updateOne({
          filter: { id: args.input.id },
          changes: {
            ...(isDefined(args.input.graduatedAt) && { graduatedAt: args.input.graduatedAt })
          }
        })
      });
      if (error)
        throw error;

      return true;
    },

    deleteEBoard: async (parent, args, context: ApolloResolversContext, info) => {
      const eBoard = await context.unsecureEntityManager.eBoard.findOne({
        filter: { id: args.id },
        projection: { userId: true }
      });
      if (!eBoard)
        throw new HttpError(400, "EBoard doesn't exist!");
      
      makePermsCalc()
        .withContext(context.securityContext)
        .withDomain({
          userId: [ eBoard.userId ]
        }).assertPermission(Permission.ManageEboard);
      
      const error = await startEntityManagerTransaction(context.unsecureEntityManager, context.mongoClient, async (transEntityManager) => {
        await deleteEBoard(transEntityManager, args.id);
      });
      if (error)
        throw error;
      
      return true;
    },

    newEBoardRole: newEntityRoleResolver(roleResolverOptions),
    deleteEBoardRole: deleteEntityRoleResolver(roleResolverOptions),
  }
} as { Query: QueryResolvers, Mutation: MutationResolvers };

export async function makeEBoard(entityManager: EntityManager, record: EBoardInsertInput) {
  const eBoard = await entityManager.eBoard.insertOne({
    record: {
      ...record,
      createdAt: Date.now()
    }
  })

  await daoInsertRolesBatch({
    dao: entityManager.eBoardRole, 
    roleCodes: [RoleCode.Eboard],
    idKey: "eBoardId",
    id: eBoard.id
  });
  return eBoard.id;
}

export async function deleteEBoard(entityManager: EntityManager, id: string) {
  await entityManager.eBoardRole.deleteAll({
    filter: { eBoardId: id }
  })
  await entityManager.eBoard.deleteOne({
    filter: { id: id }
  })
}