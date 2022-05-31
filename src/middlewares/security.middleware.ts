import { Permission } from "@src/generated/model.types";

export type SecurityParams = {
  [entity: string]: {
    [field: string]: ((newValue: any) => Promise<Error | void>)[]
  }
}

export function mergeSecurityParams(... params: SecurityParams[]) {
  return mergeUnionArraysMany(...params) as SecurityParams;
}

export function mergeUnionArraysMany(... elements: any[]) {
  if (elements.length == 1)
    return elements[0];
  let finalObject: any = mergeUnionArrays(elements[0], elements[1])
  for (let i = 1; i < elements.length - 1; i++) {
    finalObject = mergeUnionArrays(elements[i], elements[i + 1]);
  }
  return finalObject;
}

export function mergeUnionArrays(one: any, two: any) {
  const checkedProps = new Set<string>();
  return {
    ...mergeUnionArraysHalf(one, two, checkedProps),
    ...mergeUnionArraysHalf(two, one, checkedProps)
  }
}

export function mergeUnionArraysHalf(one: any, two: any, checkedProps: Set<string>) {
  const finalObject: any = {};
  for (const oneProp in one) {
    if (checkedProps.has(oneProp))
      continue;
    checkedProps.add(oneProp);
    const oneValue = one[oneProp];
    const twoValue = two[oneProp]; 
    if (!oneValue)
      continue;
    if (twoValue) {
      if (Array.isArray(oneValue) && Array.isArray(twoValue)) {
        finalObject[oneProp] = [ ...oneValue, ...twoValue ];
      } else if (typeof twoValue === "object" && typeof oneValue === "object") {
        finalObject[oneProp] = mergeUnionArrays(twoValue, oneValue);
      } else {
        // We are a non mergable type, so do nothing
      }
    } else {
      finalObject[oneProp] = oneValue;
    }
  }
  return finalObject;
}

type KeyIndexable = number | string | symbol;

// Wrapper for types
export type SecurityTypes<TPermissions extends KeyIndexable, TSecurityDomain = ""> = {
  securityContext: SecurityContext<TSecurityDomain, TPermissions>
  policyPermission: PolicyPermission<TSecurityDomain, TPermissions>
  policyBlueprint: PolicyBlueprint<TSecurityDomain, TPermissions>
  policyBuilder: PolicyBuilder<TSecurityDomain, TPermissions>
}

type MANAGE_ROLE_CONTEXT = {
  
}

type UPDATE_USER_CONTEXT = {
  userId: string
}

type SEE_USER_CONTEXT = {
  userId: string
  projectMemberId: string
}

type MySecurityContext = MANAGE_ROLE_CONTEXT | UPDATE_USER_CONTEXT | SEE_USER_CONTEXT

const test: SecurityContext<MySecurityContext, Permission> = {
  CREATE_PROJECT: [{
    userId: "sdfsdf",
    extraData: "extra data!"
  }]
}

/**
A SecurityContext respents a specific user's
access to information. The class itself
contains all the permissions the user has. 
 */
type SecurityContext<TSecurityDomain, TPermissions extends KeyIndexable> = {
  [permission in TPermissions]?: Partial<TSecurityDomain>[]
}

type PolicyPermission<TSecurityDomain, TPermissions extends KeyIndexable> = {
  name: keyof TPermissions
  domainMapping?: SecurityDomainToEntityFieldMapping<TSecurityDomain>
  children?: (keyof TPermissions)[]
  operations: Operation<TSecurityDomain, TPermissions>[]
}

class PolicyBlueprint<TSecurityDomain, TPermissions extends KeyIndexable> {
  constructor(
    public name: string,
    public permissions: PolicyPermission<TSecurityDomain, TPermissions>[]
  ) {}

  getPermission(name: keyof TPermissions) {
    return this.permissions.find(x => x.name === name);
  }

  canAccessDomain(context: SecurityContext<TSecurityDomain, TPermissions>, domain: TSecurityDomain) {
    for (const permission in context) {
      const partialSecurityDomain = context[permission];
      if (partialSecurityDomain) {
        if (this.isPartialDomainContainedInDomain(partialSecurityDomain, domain));
      }
    }
  }

  private isPartialDomainContainedInDomain(partialDomain: Partial<TSecurityDomain>, domain: TSecurityDomain) {

  }
}

type SecurityDomainToEntityFieldMapping<TSecurityDomain> = {
  [domainField in keyof TSecurityDomain]: string;
}

type Operation<TSecurityDomain, TPermissions extends KeyIndexable> = {
  type: string

  /**  
  Ex. "entity.field.subfield",
      "entity.field",
      "entity" 
  */
  entityFieldPath: string
  args: any
}

class PolicyBuilder<TSecurityDomain, TPermissions extends KeyIndexable> {
  constructor(
    public context: SecurityContext<TSecurityDomain, TPermissions>
  ) {}

  policy(name: string, permissions: PolicyPermission<TSecurityDomain, TPermissions>[]) {
    return new PolicyBlueprint<TSecurityDomain, TPermissions>(
      name,
      permissions
    );
  }

  permission(
    name: keyof TPermissions, 
    settings: {
      domainMapping?: SecurityDomainToEntityFieldMapping<TSecurityDomain>,
      children?: (keyof TPermissions)[]
    }, 
    operationArrays: Operation<TSecurityDomain, TPermissions>[][]
  ) {
    return <PolicyPermission<TSecurityDomain, TPermissions>>{
      name,
      ...settings,
      // Flatten operations
      operations: ([] as Operation<TSecurityDomain, TPermissions>[]).concat(...operationArrays),
    }
  }

  crud(
    entityFieldPath: string,
    operations: {
      create?: boolean | { [field: KeyIndexable]: boolean }
      read?: boolean | { [field: KeyIndexable]: boolean }
      update?: boolean | { [field: KeyIndexable]: boolean }
      delete?: boolean | { [field: KeyIndexable]: boolean }
    }
  ): Operation<TSecurityDomain, TPermissions>[] {
    let operationsArr: Operation<TSecurityDomain, TPermissions>[] = [];
    if (operations.create)
      operationsArr = operationsArr.concat(this.create(entityFieldPath, operations.create));
    if (operations.read)
      operationsArr = operationsArr.concat(this.read(entityFieldPath, operations.read));
    if (operations.update)
      operationsArr = operationsArr.concat(this.update(entityFieldPath, operations.update));
    if (operations.delete)
      operationsArr = operationsArr.concat(this.delete(entityFieldPath, operations.delete));
    return operationsArr;
  }

  operation(
    type: string,
    entityFieldPath: string,
    args: any = {}
  ): Operation<TSecurityDomain, TPermissions>[] {
    return [{
      entityFieldPath,
      type,
      args
    }]
  }

  create(entityFieldPath: string, 
    fields: boolean | { [field: KeyIndexable]: boolean }
  ): Operation<TSecurityDomain, TPermissions>[] {
    return this.singleCrud("update", entityFieldPath, fields);
  }

  read(entityFieldPath: string, 
    fields: boolean | { [field: KeyIndexable]: boolean }
  ): Operation<TSecurityDomain, TPermissions>[] {
    return this.singleCrud("update", entityFieldPath, fields);
  }

  update(entityFieldPath: string, 
    fields: boolean | { [field: KeyIndexable]: boolean }
  ): Operation<TSecurityDomain, TPermissions>[] {
    return this.singleCrud("update", entityFieldPath, fields);
  }

  delete(entityFieldPath: string, 
    fields: boolean | { [field: KeyIndexable]: boolean }
  ): Operation<TSecurityDomain, TPermissions>[] {
    return this.singleCrud("update", entityFieldPath, fields);
  }

  singleCrud(
    operationType: string,
    entityFieldPath: string, 
    fields: boolean | { [field: KeyIndexable]: boolean }
  ): Operation<TSecurityDomain, TPermissions>[] {
    if (typeof fields === 'boolean') {
      const isOperationAllowed = fields;
      return [{
        entityFieldPath,
        type: operationType,
        args: isOperationAllowed
      }]
    }
    let operations: Operation<TSecurityDomain, TPermissions>[] = []
    for (const field in fields) {
      const isOperationAllowed: boolean = fields[field];
      operations.push({
        entityFieldPath: entityFieldPath + "." + field,
        type: operationType,
        args: isOperationAllowed
      });
    }
    return operations;
  }
}

/**
namespace perm {
  funciton read(model) => { resolver: Resolver.read, args: [ model ] };
}

namespace user {
  roles: "user.roles";
}

function policy(context): Policy {
  const P = new PolicyBuilder(context);
  return {
    name: "Hello",
    permissions: [
      {
        name: "MANAGE_USERS"
        domainMapping: {
          userId: "userId"
        },
        data: {
          
        },
        operations: [
          P.allow("user"),
          P.deny("user"),
          P.read("user"),
          P.read("user.roles"),
          P.read(user.roles),
          P.read("user", {
            roles: true,
            email: false;
          }),
          P.crud("user", {
            // Operations
            read: true
            update: true
            create: true
          })
        ],
      },
    ]
  });
}

onlyRolesBelow(conetxt) {

}

findAll(filter: {

})
 */

export function securityMiddleware(...allParams: SecurityParams[]) {
  const securityParams = mergeSecurityParams(...allParams);
  return {
    async before(args: any, context: any) {
      if (args.operation === 'read') {
        args.params.filter
      }
      let changes;
      switch(args.operation) {
        case 'insert':
          changes = args.params.record
          break;  
        case 'replace':
          changes = args.params.replace
          break;
        case 'update':
          changes = args.params.changes
          break;
        default:
          return {
            ...args,
            continue: true
          }
      }
      // Find the set of validation functions for this object
      const validationFns = securityParams[context.daoName];
      if (!validationFns) {
        return {
          ...args,
          continue: true
        }
      }
      // Apply the validation functions corresopnding to each
      // field for the fields that have changed.
      for (const key in changes) {
        if (!validationFns[key])
          continue;
        for (const validationFn of validationFns[key]) {
          const error = await validationFn(changes[key]);
          if (error) {
            error.message = `Validation failed on field "${context.daoName}.${key}": ${error.message}`;
            throw error;
          }
        }
      }
      return {
        ...args,
        continue: true
      }
    }
  }
}