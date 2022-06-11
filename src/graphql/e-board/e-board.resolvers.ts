import { DataSize, deleteSelfHostedFile, fileUploadPromiseToCdn, isSelfHostedFile, tryDeleteFileIfSelfHosted } from '@src/controllers/cdn.controller';
import { MutationResolvers, Permission, QueryResolvers, UpdateUserSocialInput, UploadOperation } from '@src/generated/graphql-endpoint.types';
import { UserSocialFilter, UserSocialInsert } from '@src/generated/typetta';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { assertNoDuplicates } from '@src/shared/utils';
import { assertRequesterCanAddRoleCodes, daoInsertBatch, daoInsertRolesBatch, getRoleCodes, HttpError, isDefined, startEntityManagerTransaction, tryDeleteOldFileLinkFromEntity } from '@src/utils';
import { FileUpload, Upload } from 'graphql-upload';

export default {
  Mutation: {
  }
} as { Query: QueryResolvers, Mutation: MutationResolvers };