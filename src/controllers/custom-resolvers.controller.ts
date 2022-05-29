import { GraphQLScalarType, Kind } from 'graphql';

export const resolvers = {
  Json: new GraphQLScalarType({
    name: 'Json',
    description: 'Json object scalar type',
    serialize: (value: any) => {
      return JSON.stringify(value);
    },
    parseValue: (value: string) => {
      return JSON.parse(value);
    },
  })
}