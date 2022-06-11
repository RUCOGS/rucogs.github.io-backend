import { gql } from "apollo-server";

// NOTE: graphql-codegen just isn't working with a typescript file. I've spent
//       hours researching and I couldn't find a solution. For now we, we are 
//       generating types directly from our endpoint. This involves starting
//       the server and then running the code generation.

export default gql`
extend type Query {
  isAuthTokenValid: Boolean
  securityContext(userId: ID): Json
  securityPolicy: Json
}
`;