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
extend type Query {
  securityContext(userId: ID): Json
  securityPolicy: Json
}
`;