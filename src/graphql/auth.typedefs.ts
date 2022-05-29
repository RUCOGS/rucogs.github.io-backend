import { Permission } from "@src/generated/model.types";
import { gql } from "apollo-server";

// NOTE: graphql-codegen just isn't working with a typescript file. I've spent
//       hours researching and I couldn't find a solution. For now we, we are 
//       generating types directly from our endpoint. This involves starting
//       the server and then running the code generation.
let permFields = "";
for (const perm in Permission) {
  permFields += `  ${(<any>Permission)[perm]}: PermissionDomains\n`;
}

export default gql`
type JsonType {
  json: Json
}

type BooleanType {
  boolean: Boolean
}

union PermissionOperationDomain = JsonType | BooleanType

type SecurityDomain {
  read: PermissionOperationDomain,
  write: PermissionOperationDomain,
  update: PermissionOperationDomain,
  delete: PermissionOperationDomain
}

type SecurityDomains {
  domains: [SecurityDomain!]
}

union PermissionDomains = SecurityDomains | BooleanType

extend type Query {
  getSecurityContext(userId: ID): SecurityContext
}

type SecurityPolicies {
${permFields}}
`;