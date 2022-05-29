import { GraphQLScalarType } from 'graphql';

export default {
  Json: new GraphQLScalarType({
    name: 'Json',
    description: 'Json object scalar type',
    serialize: (value: any) => {
      return value;
    },
    parseValue: (value: any) => {
      return value;
    },
  })
}