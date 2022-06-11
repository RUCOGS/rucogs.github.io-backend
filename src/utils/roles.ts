import { Permission, RoleCode } from "@src/generated/graphql-endpoint.types";
import { EntityManager } from "@src/generated/typetta";
import { ApolloResolversContext } from "@src/misc/context";
import { getHighestRoles, isRoleBelow, isRoleBelowOrEqual, makePermsCalc } from "@src/shared/security";
import { HttpError } from '@src/shared/utils';
import { AbstractDAO } from "@twinlogix/typetta";
import { camelCaseToSnakeCase, camelCaseToSpace, capitalizeFirstLetter } from "./string";

export type EntityRoleResolverOptions = {
  entityCamelCaseName?: string
  roleDao?: string
  entityName?: string
  entityIdKey?: string
  permission?: string
  getRequesterRoles: (unsecureEntityManager: EntityManager, requesterUserId: string, roleEntityId: string) => Promise<RoleCode[]>
};

export function newEntityRoleResolver(options: EntityRoleResolverOptions) {
  const concreteOptions = getEntityRoleResolverConcreteOptions(options);
  
  return async (parent: any, args: any, context: ApolloResolversContext, info: any) => {
    if (!context.securityContext.userId)
      throw new HttpError(400, "Only authenticated users can change roles!");
    
    if (!makePermsCalc()
      .withContext(context.securityContext)
      .withDomain({
        [concreteOptions.entityIdKey]: [ args.input[concreteOptions.entityIdKey] ]
      })
      .hasPermission(concreteOptions.permission as Permission))
      throw new HttpError(403, `Forbidden from changing this ${concreteOptions.entityName}'s roles!`);
    
    const roleExists = await (<any>context.unsecureEntityManager)[concreteOptions.roleDao].exists({
      filter: { 
        [concreteOptions.entityIdKey]: { eq: args.input[concreteOptions.entityIdKey] },
        roleCode: { eq: args.input.roleCode }
      }
    });
    if (roleExists)
      throw new HttpError(400, `${capitalizeFirstLetter(concreteOptions.entityName)} role already exists!`);
    
    const requesterRoleCodes = await concreteOptions.getRequesterRoles(context.unsecureEntityManager, context.securityContext.userId, args.input[concreteOptions.entityIdKey]);
    assertRequesterCanManageRoleCodes(requesterRoleCodes, [ args.input.roleCode ]);
    
    const role = await (<any>context.unsecureEntityManager)[concreteOptions.roleDao].insertOne({
      record: {
        [concreteOptions.entityIdKey]: args.input.userId,
        roleCode: args.input.roleCode
      }
    })

    return role.id;
  };
}

export function deleteEntityRoleResolver(options: EntityRoleResolverOptions) {
  const concreteOptions = getEntityRoleResolverConcreteOptions(options);
  
  return async (parent: any, args: any, context: ApolloResolversContext, info: any) => {
    if (!context.securityContext.userId)
      throw new HttpError(400, "Only authenticated users can change roles!");
    
    if (!makePermsCalc()
      .withContext(context.securityContext)
      .withDomain({
        [concreteOptions.entityIdKey]: [ args.input[concreteOptions.entityIdKey] ]
      })
      .hasPermission(Permission.ManageUserRoles))
      throw new HttpError(403, `Forbidden from changing this ${concreteOptions.entityName}'s roles!`);
    
    const role = await (<any>context.unsecureEntityManager)[concreteOptions.roleDao].findOne({
      filter: { 
        id: { eq: args.input.id },
      }
    });
    if (!role)
      throw new HttpError(400, `${capitalizeFirstLetter(concreteOptions.entityName)} role doesn't exist!`);
    
    const requesterRoleCodes = await concreteOptions.getRequesterRoles(context.unsecureEntityManager, context.securityContext.userId, role[concreteOptions.entityIdKey]);
    assertRequesterCanManageRoleCodes(requesterRoleCodes, [ role.roleCode ]);
    
    await (<any>context.unsecureEntityManager)[concreteOptions.roleDao].deleteOne({
      filter: {
        id: { eq: args.input.id }
      }
    })

    return true;
  };
}

function getEntityRoleResolverConcreteOptions(options: EntityRoleResolverOptions) {
  if (options.entityCamelCaseName) {
    if (!options.entityName)
      options.entityName = camelCaseToSpace(options.entityCamelCaseName);
    if (!options.roleDao)
      options.roleDao = options.entityCamelCaseName + "Role";
    if (!options.entityIdKey)
      options.entityIdKey = options.entityCamelCaseName + "Id";
    if (!options.permission)
      options.permission = `MANAGE_${camelCaseToSnakeCase(options.entityCamelCaseName).toUpperCase()}_ROLES`;
    if (!Object.values(Permission).includes(options.permission as Permission))
      throw new Error(`Permission ${options.permission} doesn't exist! Maybe the auto generation was wrong?`);
  } else if (!options.entityName || !options.roleDao || !options.entityIdKey || !options.permission) {
    throw new Error("Resolver must specify entityCamelCaseName for auto options generation.");
  }

  return options as {
    roleDao: string
    entityName: string
    entityIdKey: string
    permission: string
    getRequesterRoles: (unsecureEntityManager: EntityManager, requesterUserId: string, roleEntityId: string) => Promise<RoleCode[]>
  };
}

export async function getEntityRoleCodes(roleDao: AbstractDAO<any>, entityIdKey: string, entityId: string | undefined | null) {
  if (!entityId)
    return [];
  const roles = await roleDao.findAll({
    filter: {
      [entityIdKey]: { eq: entityId }
    },
    projection: {
      roleCode: true
    }
  });
  return roles.map(x => x.roleCode as RoleCode);
}

export function assertRequesterCanDeleteRoleCodes(requesterRoleCodes: RoleCode[], roleCodes: RoleCode[]) {
  const requestHighestRoleCodes = getHighestRoles(requesterRoleCodes);
  for (const roleCode of roleCodes)
    if (requestHighestRoleCodes.includes(roleCode))
      throw new HttpError(403, "Cannot remove your own highest role!");
}

export function assertRequesterCanManageRoleCodes(requesterRoleCodes: RoleCode[], roleCodes: RoleCode[]) {
  const requestHighestRoleCodes = getHighestRoles(requesterRoleCodes);
  for (const roleCode of roleCodes) {
    let isBelowAHighestRole = false;
    for (const highestRole of requestHighestRoleCodes) {
      if (isRoleBelowOrEqual(roleCode, highestRole)) {
        isBelowAHighestRole = true;
        break;
      }
    }
    if (!isBelowAHighestRole) {
      throw new HttpError(403, "Can only add roles below your current role!");
    }
  }
}