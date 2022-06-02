import { RoleCode } from "@src/generated/model.types";
import { EntityManager } from "@src/generated/typetta";
import { ValidationParams } from "@src/middlewares/validation.middleware";
import { isRoleBelow, OperationSecurityDomain, SecurityContext } from "@src/shared/security";

export function roleValidation(unsecureEntityManager: EntityManager, securityContext: SecurityContext, operationDomain: OperationSecurityDomain | undefined) {
  return <ValidationParams>{
    userRole: {
      roleCode: [
        async (newValue: RoleCode, filter: any, changes: any) => {
          // Don't restrict if we don't have a userId
          // Ex. if we are using the default security context
          if (!securityContext.userId)
            return true;
          
          const allUserRoles = await unsecureEntityManager.userRole.findAll({
            filter: {
              userId: securityContext.userId
            },
            projection: {
              roleCode: true
            }
          })
          let foundBelow = false;
          for (const role of allUserRoles) {
            if (isRoleBelow(newValue, role.roleCode)) {
              foundBelow = true;
              break;
            }
          }
          if (!foundBelow)
            return new Error("User can only add roles that are below their highest role.");
        }
      ]
    }, 
  }
}