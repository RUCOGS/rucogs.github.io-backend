import { fileUploadPromiseToCdn } from '@src/controllers/cdn.controller';
import { MutationResolvers, QueryResolvers } from '@src/generated/graphql-endpoint.types';
import { ApolloResolversContext } from '@src/misc/context';

export default {
  Mutation: {
    updateUser: async (parent, args, context: ApolloResolversContext, info) => {
      if (args.input) {
        console.log('file uploading...');

        // Invoking the `createReadStream` will return a Readable Stream.
        // See https://nodejs.org/api/stream.html#stream_readable_streams
        await fileUploadPromiseToCdn(args.input.avatar);

        console.log('file uploaded!');
      }
      
      return true;
    }
  }
} as { Query: QueryResolvers, Mutation: MutationResolvers };