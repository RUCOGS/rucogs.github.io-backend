import * as T from '@twinlogix/typetta'
import * as types from './model.types'
import * as M from 'mongodb'

export type ScalarsSpecification = {
      ID: { type: types.Scalars['ID'], isTextual: false, isQuantitative: false },String: { type: types.Scalars['String'], isTextual: true, isQuantitative: false },Boolean: { type: types.Scalars['Boolean'], isTextual: false, isQuantitative: false },Int: { type: types.Scalars['Int'], isTextual: false, isQuantitative: true },Float: { type: types.Scalars['Float'], isTextual: false, isQuantitative: true },Access: { type: types.Access, isTextual: false, isQuantitative: false },Date: { type: types.Scalars['Date'], isTextual: false, isQuantitative: false },InviteType: { type: types.InviteType, isTextual: false, isQuantitative: false },Json: { type: types.Scalars['Json'], isTextual: false, isQuantitative: false },Permission: { type: types.Permission, isTextual: false, isQuantitative: false },RoleCode: { type: types.RoleCode, isTextual: false, isQuantitative: false },SortDirection: { type: types.SortDirection, isTextual: false, isQuantitative: false },StringFilterMode: { type: types.StringFilterMode, isTextual: false, isQuantitative: false },Upload: { type: types.Scalars['Upload'], isTextual: false, isQuantitative: false },UploadOperation: { type: types.UploadOperation, isTextual: false, isQuantitative: false },
    }

export type AST = {
    EBoard: {
          fields: { avatarLink: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
bio: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
createdAt: { type: 'scalar', 
      isList: false, 
      astName: 'Date', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
id: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: true,
      generationStrategy: 'db' },
terms: { type: 'relation', relation: 'foreign', 
      isList: true, 
      astName: 'EBoardTerm', 
      isRequired: true, 
      isListElementRequired: true,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
updatedAt: { type: 'scalar', 
      isList: false, 
      astName: 'Date', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
user: { type: 'relation', relation: 'inner', 
      isList: false, 
      astName: 'User', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
userId: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' } }, 
          driverSpecification: { 
            rawFilter: () => M.Filter<M.Document>, 
            rawUpdate: () => M.UpdateFilter<M.Document>, 
            rawSorts: () => M.Sort }
          },
EBoardTerm: {
          fields: { eBoard: { type: 'relation', relation: 'inner', 
      isList: false, 
      astName: 'EBoard', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
eBoardId: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
id: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: true,
      generationStrategy: 'db' },
roles: { type: 'relation', relation: 'foreign', 
      isList: true, 
      astName: 'EBoardTermRole', 
      isRequired: true, 
      isListElementRequired: true,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
year: { type: 'scalar', 
      isList: false, 
      astName: 'Int', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' } }, 
          driverSpecification: { 
            rawFilter: () => M.Filter<M.Document>, 
            rawUpdate: () => M.UpdateFilter<M.Document>, 
            rawSorts: () => M.Sort }
          },
EBoardTermRole: {
          fields: { id: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: true,
      generationStrategy: 'db' },
roleCode: { type: 'scalar', 
      isList: false, 
      astName: 'RoleCode', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
term: { type: 'relation', relation: 'inner', 
      isList: false, 
      astName: 'EBoardTerm', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
termId: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' } }, 
          driverSpecification: { 
            rawFilter: () => M.Filter<M.Document>, 
            rawUpdate: () => M.UpdateFilter<M.Document>, 
            rawSorts: () => M.Sort }
          },
Project: {
          fields: { access: { type: 'scalar', 
      isList: false, 
      astName: 'Access', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
bannerLink: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
cardImageLink: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
completedAt: { type: 'scalar', 
      isList: false, 
      astName: 'Date', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
createdAt: { type: 'scalar', 
      isList: false, 
      astName: 'Date', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
description: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
discordConfig: { type: 'relation', relation: 'foreign', 
      isList: false, 
      astName: 'ProjectDiscordConfig', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
downloadLinks: { type: 'scalar', 
      isList: true, 
      astName: 'String', 
      isRequired: false, 
      isListElementRequired: true,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
galleryImageLinks: { type: 'scalar', 
      isList: true, 
      astName: 'String', 
      isRequired: false, 
      isListElementRequired: true,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
id: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: true,
      generationStrategy: 'db' },
invites: { type: 'relation', relation: 'foreign', 
      isList: true, 
      astName: 'ProjectInvite', 
      isRequired: true, 
      isListElementRequired: true,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
members: { type: 'relation', relation: 'foreign', 
      isList: true, 
      astName: 'ProjectMember', 
      isRequired: true, 
      isListElementRequired: true,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
name: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
pitch: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
soundcloudEmbedSrc: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
tags: { type: 'scalar', 
      isList: true, 
      astName: 'String', 
      isRequired: false, 
      isListElementRequired: true,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
updatedAt: { type: 'scalar', 
      isList: false, 
      astName: 'Date', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' } }, 
          driverSpecification: { 
            rawFilter: () => M.Filter<M.Document>, 
            rawUpdate: () => M.UpdateFilter<M.Document>, 
            rawSorts: () => M.Sort }
          },
ProjectDiscordConfig: {
          fields: { categoryId: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
createdAt: { type: 'scalar', 
      isList: false, 
      astName: 'Date', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
id: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: true,
      generationStrategy: 'db' },
project: { type: 'relation', relation: 'inner', 
      isList: false, 
      astName: 'Project', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
projectId: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
updatedAt: { type: 'scalar', 
      isList: false, 
      astName: 'Date', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' } }, 
          driverSpecification: { 
            rawFilter: () => M.Filter<M.Document>, 
            rawUpdate: () => M.UpdateFilter<M.Document>, 
            rawSorts: () => M.Sort }
          },
ProjectInvite: {
          fields: { createdAt: { type: 'scalar', 
      isList: false, 
      astName: 'Date', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
id: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: true,
      generationStrategy: 'db' },
project: { type: 'relation', relation: 'inner', 
      isList: false, 
      astName: 'Project', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
projectId: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
type: { type: 'scalar', 
      isList: false, 
      astName: 'InviteType', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
user: { type: 'relation', relation: 'inner', 
      isList: false, 
      astName: 'User', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
userId: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' } }, 
          driverSpecification: { 
            rawFilter: () => M.Filter<M.Document>, 
            rawUpdate: () => M.UpdateFilter<M.Document>, 
            rawSorts: () => M.Sort }
          },
ProjectMember: {
          fields: { contributions: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
createdAt: { type: 'scalar', 
      isList: false, 
      astName: 'Date', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
id: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: true,
      generationStrategy: 'db' },
project: { type: 'relation', relation: 'inner', 
      isList: false, 
      astName: 'Project', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
projectId: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
roles: { type: 'relation', relation: 'foreign', 
      isList: true, 
      astName: 'ProjectMemberRole', 
      isRequired: true, 
      isListElementRequired: true,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
updatedAt: { type: 'scalar', 
      isList: false, 
      astName: 'Date', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
user: { type: 'relation', relation: 'inner', 
      isList: false, 
      astName: 'User', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
userId: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' } }, 
          driverSpecification: { 
            rawFilter: () => M.Filter<M.Document>, 
            rawUpdate: () => M.UpdateFilter<M.Document>, 
            rawSorts: () => M.Sort }
          },
ProjectMemberRole: {
          fields: { id: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: true,
      generationStrategy: 'db' },
projectMember: { type: 'relation', relation: 'inner', 
      isList: false, 
      astName: 'ProjectMember', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
projectMemberId: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
roleCode: { type: 'scalar', 
      isList: false, 
      astName: 'RoleCode', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' } }, 
          driverSpecification: { 
            rawFilter: () => M.Filter<M.Document>, 
            rawUpdate: () => M.UpdateFilter<M.Document>, 
            rawSorts: () => M.Sort }
          },
Subscription: {
          fields: { eBoardCreated: { type: 'embedded', 
      isList: false, 
      astName: 'EBoard', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
eBoardDeleted: { type: 'embedded', 
      isList: false, 
      astName: 'EBoard', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
eBoardTermCreated: { type: 'embedded', 
      isList: false, 
      astName: 'EBoardTerm', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
eBoardTermDeleted: { type: 'embedded', 
      isList: false, 
      astName: 'EBoardTerm', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
eBoardTermUpdated: { type: 'embedded', 
      isList: false, 
      astName: 'EBoardTerm', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
eBoardUpdated: { type: 'embedded', 
      isList: false, 
      astName: 'EBoard', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
projectCreated: { type: 'embedded', 
      isList: false, 
      astName: 'Project', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
projectDeleted: { type: 'embedded', 
      isList: false, 
      astName: 'Project', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
projectInviteCreated: { type: 'embedded', 
      isList: false, 
      astName: 'ProjectInvite', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
projectInviteDeleted: { type: 'embedded', 
      isList: false, 
      astName: 'ProjectInvite', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
projectMemberCreated: { type: 'embedded', 
      isList: false, 
      astName: 'ProjectMember', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
projectMemberDeleted: { type: 'embedded', 
      isList: false, 
      astName: 'ProjectMember', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
projectMemberUpdated: { type: 'embedded', 
      isList: false, 
      astName: 'ProjectMember', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
projectUpdated: { type: 'embedded', 
      isList: false, 
      astName: 'Project', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
userCreated: { type: 'embedded', 
      isList: false, 
      astName: 'User', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
userDeleted: { type: 'embedded', 
      isList: false, 
      astName: 'User', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
userLoginIdentityCreated: { type: 'embedded', 
      isList: false, 
      astName: 'UserLoginIdentity', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
userLoginIdentityDeleted: { type: 'embedded', 
      isList: false, 
      astName: 'UserLoginIdentity', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
userLoginIdentityUpdated: { type: 'embedded', 
      isList: false, 
      astName: 'UserLoginIdentity', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
userUpdated: { type: 'embedded', 
      isList: false, 
      astName: 'User', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' } }, 
          driverSpecification: { 
            rawFilter: never, 
            rawUpdate: never, 
            rawSorts: never }
          },
User: {
          fields: { avatarLink: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
bannerLink: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
bio: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
classYear: { type: 'scalar', 
      isList: false, 
      astName: 'Int', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
createdAt: { type: 'scalar', 
      isList: false, 
      astName: 'Date', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
displayName: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
eBoard: { type: 'relation', relation: 'foreign', 
      isList: false, 
      astName: 'EBoard', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
email: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
id: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: true,
      generationStrategy: 'db' },
loginIdentities: { type: 'relation', relation: 'foreign', 
      isList: true, 
      astName: 'UserLoginIdentity', 
      isRequired: true, 
      isListElementRequired: true,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
projectInvites: { type: 'relation', relation: 'foreign', 
      isList: true, 
      astName: 'ProjectInvite', 
      isRequired: true, 
      isListElementRequired: true,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
projectMembers: { type: 'relation', relation: 'foreign', 
      isList: true, 
      astName: 'ProjectMember', 
      isRequired: true, 
      isListElementRequired: true,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
roles: { type: 'relation', relation: 'foreign', 
      isList: true, 
      astName: 'UserRole', 
      isRequired: true, 
      isListElementRequired: true,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
socials: { type: 'relation', relation: 'foreign', 
      isList: true, 
      astName: 'UserSocial', 
      isRequired: true, 
      isListElementRequired: true,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
updatedAt: { type: 'scalar', 
      isList: false, 
      astName: 'Date', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
username: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' } }, 
          driverSpecification: { 
            rawFilter: () => M.Filter<M.Document>, 
            rawUpdate: () => M.UpdateFilter<M.Document>, 
            rawSorts: () => M.Sort }
          },
UserLoginIdentity: {
          fields: { data: { type: 'scalar', 
      isList: false, 
      astName: 'Json', 
      isRequired: false, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
id: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: true,
      generationStrategy: 'db' },
identityId: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
name: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
user: { type: 'relation', relation: 'inner', 
      isList: false, 
      astName: 'User', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
userId: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' } }, 
          driverSpecification: { 
            rawFilter: () => M.Filter<M.Document>, 
            rawUpdate: () => M.UpdateFilter<M.Document>, 
            rawSorts: () => M.Sort }
          },
UserRole: {
          fields: { id: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: true,
      generationStrategy: 'db' },
roleCode: { type: 'scalar', 
      isList: false, 
      astName: 'RoleCode', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
user: { type: 'relation', relation: 'inner', 
      isList: false, 
      astName: 'User', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
userId: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' } }, 
          driverSpecification: { 
            rawFilter: () => M.Filter<M.Document>, 
            rawUpdate: () => M.UpdateFilter<M.Document>, 
            rawSorts: () => M.Sort }
          },
UserSocial: {
          fields: { id: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: true,
      generationStrategy: 'db' },
link: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
platform: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
user: { type: 'relation', relation: 'inner', 
      isList: false, 
      astName: 'User', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
userId: { type: 'scalar', 
      isList: false, 
      astName: 'ID', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' },
username: { type: 'scalar', 
      isList: false, 
      astName: 'String', 
      isRequired: true, 
      isListElementRequired: false,
      isExcluded: false,
      isId: false,
      generationStrategy: 'undefined' } }, 
          driverSpecification: { 
            rawFilter: () => M.Filter<M.Document>, 
            rawUpdate: () => M.UpdateFilter<M.Document>, 
            rawSorts: () => M.Sort }
          }
  }

export const schemas = {
      EBoard: eBoardSchema,
EBoardTerm: eBoardTermSchema,
EBoardTermRole: eBoardTermRoleSchema,
Project: projectSchema,
ProjectDiscordConfig: projectDiscordConfigSchema,
ProjectInvite: projectInviteSchema,
ProjectMember: projectMemberSchema,
ProjectMemberRole: projectMemberRoleSchema,
Subscription: subscriptionSchema,
User: userSchema,
UserLoginIdentity: userLoginIdentitySchema,
UserRole: userRoleSchema,
UserSocial: userSocialSchema
    } as const

export function eBoardSchema(): T.Schema<ScalarsSpecification> {
  return {
  'avatarLink': {
              type: 'scalar',
              scalar: 'String',
              directives: {  }
            },
  'bio': {
              type: 'scalar',
              scalar: 'String',
              directives: {  }
            },
  'createdAt': {
              type: 'scalar',
              scalar: 'Date',
              directives: { 'createdAt': {  } }
            },
  'id': {
              type: 'scalar',
              scalar: 'ID',
              isId: true,generationStrategy: 'db',required: true,alias: '_id',directives: {  }
            },
  'terms':{
                type: 'relation',
                astName: 'EBoardTerm',
                relation: 'foreign',
                schema: () => eBoardTermSchema(),
                refFrom: 'eBoardId',
                refTo: 'id',
                dao: 'eBoardTerm',
                isListElementRequired: true,required: true,isList: true,directives: {  }
              },
  'updatedAt': {
              type: 'scalar',
              scalar: 'Date',
              directives: { 'updatedAt': {  } }
            },
  'user': {
                type: 'relation',
                astName: 'User',
                relation: 'inner',
                schema: () => userSchema(),
                refFrom: 'userId',
                refTo: 'id',
                dao: 'user',
                required: true,directives: {  }
              },
  'userId': {
              type: 'scalar',
              scalar: 'ID',
              required: true,directives: {  }
            }
  }
}

type EBoardDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'EBoard', AST, ScalarsSpecification, EBoardCachedTypes, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type EBoardDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<EBoardDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryEBoardDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<EBoardDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>


    export type EBoardIdFields = T.IdFields<'EBoard', AST>
    export interface EBoardModel extends types.EBoard {}
    export interface EBoardInsert extends T.Insert<'EBoard', AST, ScalarsSpecification> {}
    export interface EBoardPlainModel extends T.GenerateModel<'EBoard', AST, ScalarsSpecification, 'relation'> {}
    export interface EBoardProjection extends T.Projection<'EBoard', AST> {}
    export interface EBoardUpdate extends T.Update<'EBoard', AST, ScalarsSpecification> {}
    export interface EBoardFilter extends T.Filter<'EBoard', AST, ScalarsSpecification> {}
    export interface EBoardSortElement extends T.SortElement<'EBoard', AST> {}
    export interface EBoardRelationsFindParams extends T.RelationsFindParams<'EBoard', AST, ScalarsSpecification> {}
    export type EBoardParams<P extends EBoardProjection> = T.Params<'EBoard', AST, ScalarsSpecification, P>
    export type EBoardCachedTypes = T.CachedTypes<EBoardIdFields, EBoardModel, EBoardInsert, EBoardPlainModel, EBoardProjection, EBoardUpdate, EBoardFilter, EBoardSortElement, EBoardRelationsFindParams>

export class EBoardDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<EBoardDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'EBoard', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'EBoard', AST>, P2 extends T.Projection<'EBoard', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'EBoard', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'EBoard', AST>, P1, P2>
        }
        public constructor(params: EBoardDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: eBoardSchema() 
    })
  }
  }

export class InMemoryEBoardDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<EBoardDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'EBoard', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'EBoard', AST>, P2 extends T.Projection<'EBoard', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'EBoard', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'EBoard', AST>, P1, P2>
        }
        public constructor(params: InMemoryEBoardDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: eBoardSchema() 
    })
  }
  }
export function eBoardTermSchema(): T.Schema<ScalarsSpecification> {
  return {
  'eBoard': {
                type: 'relation',
                astName: 'EBoard',
                relation: 'inner',
                schema: () => eBoardSchema(),
                refFrom: 'eBoardId',
                refTo: 'id',
                dao: 'eBoard',
                required: true,directives: {  }
              },
  'eBoardId': {
              type: 'scalar',
              scalar: 'ID',
              required: true,directives: {  }
            },
  'id': {
              type: 'scalar',
              scalar: 'ID',
              isId: true,generationStrategy: 'db',required: true,alias: '_id',directives: {  }
            },
  'roles':{
                type: 'relation',
                astName: 'EBoardTermRole',
                relation: 'foreign',
                schema: () => eBoardTermRoleSchema(),
                refFrom: 'termId',
                refTo: 'id',
                dao: 'eBoardTermRole',
                isListElementRequired: true,required: true,isList: true,directives: {  }
              },
  'year': {
              type: 'scalar',
              scalar: 'Int',
              required: true,directives: {  }
            }
  }
}

type EBoardTermDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'EBoardTerm', AST, ScalarsSpecification, EBoardTermCachedTypes, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type EBoardTermDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<EBoardTermDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryEBoardTermDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<EBoardTermDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>


    export type EBoardTermIdFields = T.IdFields<'EBoardTerm', AST>
    export interface EBoardTermModel extends types.EBoardTerm {}
    export interface EBoardTermInsert extends T.Insert<'EBoardTerm', AST, ScalarsSpecification> {}
    export interface EBoardTermPlainModel extends T.GenerateModel<'EBoardTerm', AST, ScalarsSpecification, 'relation'> {}
    export interface EBoardTermProjection extends T.Projection<'EBoardTerm', AST> {}
    export interface EBoardTermUpdate extends T.Update<'EBoardTerm', AST, ScalarsSpecification> {}
    export interface EBoardTermFilter extends T.Filter<'EBoardTerm', AST, ScalarsSpecification> {}
    export interface EBoardTermSortElement extends T.SortElement<'EBoardTerm', AST> {}
    export interface EBoardTermRelationsFindParams extends T.RelationsFindParams<'EBoardTerm', AST, ScalarsSpecification> {}
    export type EBoardTermParams<P extends EBoardTermProjection> = T.Params<'EBoardTerm', AST, ScalarsSpecification, P>
    export type EBoardTermCachedTypes = T.CachedTypes<EBoardTermIdFields, EBoardTermModel, EBoardTermInsert, EBoardTermPlainModel, EBoardTermProjection, EBoardTermUpdate, EBoardTermFilter, EBoardTermSortElement, EBoardTermRelationsFindParams>

export class EBoardTermDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<EBoardTermDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'EBoardTerm', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'EBoardTerm', AST>, P2 extends T.Projection<'EBoardTerm', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'EBoardTerm', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'EBoardTerm', AST>, P1, P2>
        }
        public constructor(params: EBoardTermDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: eBoardTermSchema() 
    })
  }
  }

export class InMemoryEBoardTermDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<EBoardTermDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'EBoardTerm', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'EBoardTerm', AST>, P2 extends T.Projection<'EBoardTerm', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'EBoardTerm', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'EBoardTerm', AST>, P1, P2>
        }
        public constructor(params: InMemoryEBoardTermDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: eBoardTermSchema() 
    })
  }
  }
export function eBoardTermRoleSchema(): T.Schema<ScalarsSpecification> {
  return {
  'id': {
              type: 'scalar',
              scalar: 'ID',
              isId: true,generationStrategy: 'db',required: true,alias: '_id',directives: {  }
            },
  'roleCode': {
              type: 'scalar',
              scalar: 'String',
              required: true,isEnum: true,directives: {  }
            },
  'term': {
                type: 'relation',
                astName: 'EBoardTerm',
                relation: 'inner',
                schema: () => eBoardTermSchema(),
                refFrom: 'termId',
                refTo: 'id',
                dao: 'eBoardTerm',
                required: true,directives: {  }
              },
  'termId': {
              type: 'scalar',
              scalar: 'ID',
              required: true,directives: {  }
            }
  }
}

type EBoardTermRoleDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'EBoardTermRole', AST, ScalarsSpecification, EBoardTermRoleCachedTypes, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type EBoardTermRoleDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<EBoardTermRoleDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryEBoardTermRoleDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<EBoardTermRoleDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>


    export type EBoardTermRoleIdFields = T.IdFields<'EBoardTermRole', AST>
    export interface EBoardTermRoleModel extends types.EBoardTermRole {}
    export interface EBoardTermRoleInsert extends T.Insert<'EBoardTermRole', AST, ScalarsSpecification> {}
    export interface EBoardTermRolePlainModel extends T.GenerateModel<'EBoardTermRole', AST, ScalarsSpecification, 'relation'> {}
    export interface EBoardTermRoleProjection extends T.Projection<'EBoardTermRole', AST> {}
    export interface EBoardTermRoleUpdate extends T.Update<'EBoardTermRole', AST, ScalarsSpecification> {}
    export interface EBoardTermRoleFilter extends T.Filter<'EBoardTermRole', AST, ScalarsSpecification> {}
    export interface EBoardTermRoleSortElement extends T.SortElement<'EBoardTermRole', AST> {}
    export interface EBoardTermRoleRelationsFindParams extends T.RelationsFindParams<'EBoardTermRole', AST, ScalarsSpecification> {}
    export type EBoardTermRoleParams<P extends EBoardTermRoleProjection> = T.Params<'EBoardTermRole', AST, ScalarsSpecification, P>
    export type EBoardTermRoleCachedTypes = T.CachedTypes<EBoardTermRoleIdFields, EBoardTermRoleModel, EBoardTermRoleInsert, EBoardTermRolePlainModel, EBoardTermRoleProjection, EBoardTermRoleUpdate, EBoardTermRoleFilter, EBoardTermRoleSortElement, EBoardTermRoleRelationsFindParams>

export class EBoardTermRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<EBoardTermRoleDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'EBoardTermRole', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'EBoardTermRole', AST>, P2 extends T.Projection<'EBoardTermRole', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'EBoardTermRole', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'EBoardTermRole', AST>, P1, P2>
        }
        public constructor(params: EBoardTermRoleDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: eBoardTermRoleSchema() 
    })
  }
  }

export class InMemoryEBoardTermRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<EBoardTermRoleDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'EBoardTermRole', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'EBoardTermRole', AST>, P2 extends T.Projection<'EBoardTermRole', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'EBoardTermRole', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'EBoardTermRole', AST>, P1, P2>
        }
        public constructor(params: InMemoryEBoardTermRoleDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: eBoardTermRoleSchema() 
    })
  }
  }
export function projectSchema(): T.Schema<ScalarsSpecification> {
  return {
  'access': {
              type: 'scalar',
              scalar: 'String',
              required: true,isEnum: true,directives: {  }
            },
  'bannerLink': {
              type: 'scalar',
              scalar: 'String',
              directives: {  }
            },
  'cardImageLink': {
              type: 'scalar',
              scalar: 'String',
              directives: {  }
            },
  'completedAt': {
              type: 'scalar',
              scalar: 'Date',
              directives: {  }
            },
  'createdAt': {
              type: 'scalar',
              scalar: 'Date',
              directives: { 'createdAt': {  } }
            },
  'description': {
              type: 'scalar',
              scalar: 'String',
              directives: {  }
            },
  'discordConfig':{
                type: 'relation',
                astName: 'ProjectDiscordConfig',
                relation: 'foreign',
                schema: () => projectDiscordConfigSchema(),
                refFrom: 'projectId',
                refTo: 'id',
                dao: 'projectDiscordConfig',
                directives: {  }
              },
  'downloadLinks': {
              type: 'scalar',
              scalar: 'String',
              isListElementRequired: true,isList: true,directives: {  }
            },
  'galleryImageLinks': {
              type: 'scalar',
              scalar: 'String',
              isListElementRequired: true,isList: true,directives: {  }
            },
  'id': {
              type: 'scalar',
              scalar: 'ID',
              isId: true,generationStrategy: 'db',required: true,alias: '_id',directives: {  }
            },
  'invites':{
                type: 'relation',
                astName: 'ProjectInvite',
                relation: 'foreign',
                schema: () => projectInviteSchema(),
                refFrom: 'projectId',
                refTo: 'id',
                dao: 'projectInvite',
                isListElementRequired: true,required: true,isList: true,directives: {  }
              },
  'members':{
                type: 'relation',
                astName: 'ProjectMember',
                relation: 'foreign',
                schema: () => projectMemberSchema(),
                refFrom: 'projectId',
                refTo: 'id',
                dao: 'projectMember',
                isListElementRequired: true,required: true,isList: true,directives: {  }
              },
  'name': {
              type: 'scalar',
              scalar: 'String',
              required: true,directives: {  }
            },
  'pitch': {
              type: 'scalar',
              scalar: 'String',
              required: true,directives: {  }
            },
  'soundcloudEmbedSrc': {
              type: 'scalar',
              scalar: 'String',
              directives: {  }
            },
  'tags': {
              type: 'scalar',
              scalar: 'String',
              isListElementRequired: true,isList: true,directives: {  }
            },
  'updatedAt': {
              type: 'scalar',
              scalar: 'Date',
              directives: { 'updatedAt': {  } }
            }
  }
}

type ProjectDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'Project', AST, ScalarsSpecification, ProjectCachedTypes, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type ProjectDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<ProjectDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryProjectDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<ProjectDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>


    export type ProjectIdFields = T.IdFields<'Project', AST>
    export interface ProjectModel extends types.Project {}
    export interface ProjectInsert extends T.Insert<'Project', AST, ScalarsSpecification> {}
    export interface ProjectPlainModel extends T.GenerateModel<'Project', AST, ScalarsSpecification, 'relation'> {}
    export interface ProjectProjection extends T.Projection<'Project', AST> {}
    export interface ProjectUpdate extends T.Update<'Project', AST, ScalarsSpecification> {}
    export interface ProjectFilter extends T.Filter<'Project', AST, ScalarsSpecification> {}
    export interface ProjectSortElement extends T.SortElement<'Project', AST> {}
    export interface ProjectRelationsFindParams extends T.RelationsFindParams<'Project', AST, ScalarsSpecification> {}
    export type ProjectParams<P extends ProjectProjection> = T.Params<'Project', AST, ScalarsSpecification, P>
    export type ProjectCachedTypes = T.CachedTypes<ProjectIdFields, ProjectModel, ProjectInsert, ProjectPlainModel, ProjectProjection, ProjectUpdate, ProjectFilter, ProjectSortElement, ProjectRelationsFindParams>

export class ProjectDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ProjectDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'Project', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'Project', AST>, P2 extends T.Projection<'Project', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Project', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Project', AST>, P1, P2>
        }
        public constructor(params: ProjectDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: projectSchema() 
    })
  }
  }

export class InMemoryProjectDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ProjectDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'Project', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'Project', AST>, P2 extends T.Projection<'Project', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Project', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Project', AST>, P1, P2>
        }
        public constructor(params: InMemoryProjectDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: projectSchema() 
    })
  }
  }
export function projectDiscordConfigSchema(): T.Schema<ScalarsSpecification> {
  return {
  'categoryId': {
              type: 'scalar',
              scalar: 'String',
              directives: {  }
            },
  'createdAt': {
              type: 'scalar',
              scalar: 'Date',
              directives: { 'createdAt': {  } }
            },
  'id': {
              type: 'scalar',
              scalar: 'ID',
              isId: true,generationStrategy: 'db',required: true,alias: '_id',directives: {  }
            },
  'project': {
                type: 'relation',
                astName: 'Project',
                relation: 'inner',
                schema: () => projectSchema(),
                refFrom: 'projectId',
                refTo: 'id',
                dao: 'project',
                required: true,directives: {  }
              },
  'projectId': {
              type: 'scalar',
              scalar: 'ID',
              required: true,directives: {  }
            },
  'updatedAt': {
              type: 'scalar',
              scalar: 'Date',
              directives: { 'updatedAt': {  } }
            }
  }
}

type ProjectDiscordConfigDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'ProjectDiscordConfig', AST, ScalarsSpecification, ProjectDiscordConfigCachedTypes, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type ProjectDiscordConfigDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<ProjectDiscordConfigDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryProjectDiscordConfigDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<ProjectDiscordConfigDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>


    export type ProjectDiscordConfigIdFields = T.IdFields<'ProjectDiscordConfig', AST>
    export interface ProjectDiscordConfigModel extends types.ProjectDiscordConfig {}
    export interface ProjectDiscordConfigInsert extends T.Insert<'ProjectDiscordConfig', AST, ScalarsSpecification> {}
    export interface ProjectDiscordConfigPlainModel extends T.GenerateModel<'ProjectDiscordConfig', AST, ScalarsSpecification, 'relation'> {}
    export interface ProjectDiscordConfigProjection extends T.Projection<'ProjectDiscordConfig', AST> {}
    export interface ProjectDiscordConfigUpdate extends T.Update<'ProjectDiscordConfig', AST, ScalarsSpecification> {}
    export interface ProjectDiscordConfigFilter extends T.Filter<'ProjectDiscordConfig', AST, ScalarsSpecification> {}
    export interface ProjectDiscordConfigSortElement extends T.SortElement<'ProjectDiscordConfig', AST> {}
    export interface ProjectDiscordConfigRelationsFindParams extends T.RelationsFindParams<'ProjectDiscordConfig', AST, ScalarsSpecification> {}
    export type ProjectDiscordConfigParams<P extends ProjectDiscordConfigProjection> = T.Params<'ProjectDiscordConfig', AST, ScalarsSpecification, P>
    export type ProjectDiscordConfigCachedTypes = T.CachedTypes<ProjectDiscordConfigIdFields, ProjectDiscordConfigModel, ProjectDiscordConfigInsert, ProjectDiscordConfigPlainModel, ProjectDiscordConfigProjection, ProjectDiscordConfigUpdate, ProjectDiscordConfigFilter, ProjectDiscordConfigSortElement, ProjectDiscordConfigRelationsFindParams>

export class ProjectDiscordConfigDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ProjectDiscordConfigDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'ProjectDiscordConfig', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'ProjectDiscordConfig', AST>, P2 extends T.Projection<'ProjectDiscordConfig', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'ProjectDiscordConfig', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'ProjectDiscordConfig', AST>, P1, P2>
        }
        public constructor(params: ProjectDiscordConfigDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: projectDiscordConfigSchema() 
    })
  }
  }

export class InMemoryProjectDiscordConfigDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ProjectDiscordConfigDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'ProjectDiscordConfig', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'ProjectDiscordConfig', AST>, P2 extends T.Projection<'ProjectDiscordConfig', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'ProjectDiscordConfig', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'ProjectDiscordConfig', AST>, P1, P2>
        }
        public constructor(params: InMemoryProjectDiscordConfigDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: projectDiscordConfigSchema() 
    })
  }
  }
export function projectInviteSchema(): T.Schema<ScalarsSpecification> {
  return {
  'createdAt': {
              type: 'scalar',
              scalar: 'Date',
              directives: { 'createdAt': {  } }
            },
  'id': {
              type: 'scalar',
              scalar: 'ID',
              isId: true,generationStrategy: 'db',required: true,alias: '_id',directives: {  }
            },
  'project': {
                type: 'relation',
                astName: 'Project',
                relation: 'inner',
                schema: () => projectSchema(),
                refFrom: 'projectId',
                refTo: 'id',
                dao: 'project',
                required: true,directives: {  }
              },
  'projectId': {
              type: 'scalar',
              scalar: 'ID',
              required: true,directives: { 'unique': {  } }
            },
  'type': {
              type: 'scalar',
              scalar: 'String',
              required: true,isEnum: true,directives: {  }
            },
  'user': {
                type: 'relation',
                astName: 'User',
                relation: 'inner',
                schema: () => userSchema(),
                refFrom: 'userId',
                refTo: 'id',
                dao: 'user',
                required: true,directives: {  }
              },
  'userId': {
              type: 'scalar',
              scalar: 'ID',
              required: true,directives: { 'unique': {  } }
            }
  }
}

type ProjectInviteDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'ProjectInvite', AST, ScalarsSpecification, ProjectInviteCachedTypes, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type ProjectInviteDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<ProjectInviteDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryProjectInviteDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<ProjectInviteDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>


    export type ProjectInviteIdFields = T.IdFields<'ProjectInvite', AST>
    export interface ProjectInviteModel extends types.ProjectInvite {}
    export interface ProjectInviteInsert extends T.Insert<'ProjectInvite', AST, ScalarsSpecification> {}
    export interface ProjectInvitePlainModel extends T.GenerateModel<'ProjectInvite', AST, ScalarsSpecification, 'relation'> {}
    export interface ProjectInviteProjection extends T.Projection<'ProjectInvite', AST> {}
    export interface ProjectInviteUpdate extends T.Update<'ProjectInvite', AST, ScalarsSpecification> {}
    export interface ProjectInviteFilter extends T.Filter<'ProjectInvite', AST, ScalarsSpecification> {}
    export interface ProjectInviteSortElement extends T.SortElement<'ProjectInvite', AST> {}
    export interface ProjectInviteRelationsFindParams extends T.RelationsFindParams<'ProjectInvite', AST, ScalarsSpecification> {}
    export type ProjectInviteParams<P extends ProjectInviteProjection> = T.Params<'ProjectInvite', AST, ScalarsSpecification, P>
    export type ProjectInviteCachedTypes = T.CachedTypes<ProjectInviteIdFields, ProjectInviteModel, ProjectInviteInsert, ProjectInvitePlainModel, ProjectInviteProjection, ProjectInviteUpdate, ProjectInviteFilter, ProjectInviteSortElement, ProjectInviteRelationsFindParams>

export class ProjectInviteDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ProjectInviteDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'ProjectInvite', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'ProjectInvite', AST>, P2 extends T.Projection<'ProjectInvite', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'ProjectInvite', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'ProjectInvite', AST>, P1, P2>
        }
        public constructor(params: ProjectInviteDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: projectInviteSchema() 
    })
  }
  }

export class InMemoryProjectInviteDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ProjectInviteDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'ProjectInvite', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'ProjectInvite', AST>, P2 extends T.Projection<'ProjectInvite', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'ProjectInvite', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'ProjectInvite', AST>, P1, P2>
        }
        public constructor(params: InMemoryProjectInviteDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: projectInviteSchema() 
    })
  }
  }
export function projectMemberSchema(): T.Schema<ScalarsSpecification> {
  return {
  'contributions': {
              type: 'scalar',
              scalar: 'String',
              directives: {  }
            },
  'createdAt': {
              type: 'scalar',
              scalar: 'Date',
              directives: { 'createdAt': {  } }
            },
  'id': {
              type: 'scalar',
              scalar: 'ID',
              isId: true,generationStrategy: 'db',required: true,alias: '_id',directives: {  }
            },
  'project': {
                type: 'relation',
                astName: 'Project',
                relation: 'inner',
                schema: () => projectSchema(),
                refFrom: 'projectId',
                refTo: 'id',
                dao: 'project',
                required: true,directives: {  }
              },
  'projectId': {
              type: 'scalar',
              scalar: 'ID',
              required: true,directives: {  }
            },
  'roles':{
                type: 'relation',
                astName: 'ProjectMemberRole',
                relation: 'foreign',
                schema: () => projectMemberRoleSchema(),
                refFrom: 'projectMemberId',
                refTo: 'id',
                dao: 'projectMemberRole',
                isListElementRequired: true,required: true,isList: true,directives: {  }
              },
  'updatedAt': {
              type: 'scalar',
              scalar: 'Date',
              directives: { 'updatedAt': {  } }
            },
  'user': {
                type: 'relation',
                astName: 'User',
                relation: 'inner',
                schema: () => userSchema(),
                refFrom: 'userId',
                refTo: 'id',
                dao: 'user',
                required: true,directives: {  }
              },
  'userId': {
              type: 'scalar',
              scalar: 'ID',
              required: true,directives: { 'unique': {  } }
            }
  }
}

type ProjectMemberDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'ProjectMember', AST, ScalarsSpecification, ProjectMemberCachedTypes, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type ProjectMemberDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryProjectMemberDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>


    export type ProjectMemberIdFields = T.IdFields<'ProjectMember', AST>
    export interface ProjectMemberModel extends types.ProjectMember {}
    export interface ProjectMemberInsert extends T.Insert<'ProjectMember', AST, ScalarsSpecification> {}
    export interface ProjectMemberPlainModel extends T.GenerateModel<'ProjectMember', AST, ScalarsSpecification, 'relation'> {}
    export interface ProjectMemberProjection extends T.Projection<'ProjectMember', AST> {}
    export interface ProjectMemberUpdate extends T.Update<'ProjectMember', AST, ScalarsSpecification> {}
    export interface ProjectMemberFilter extends T.Filter<'ProjectMember', AST, ScalarsSpecification> {}
    export interface ProjectMemberSortElement extends T.SortElement<'ProjectMember', AST> {}
    export interface ProjectMemberRelationsFindParams extends T.RelationsFindParams<'ProjectMember', AST, ScalarsSpecification> {}
    export type ProjectMemberParams<P extends ProjectMemberProjection> = T.Params<'ProjectMember', AST, ScalarsSpecification, P>
    export type ProjectMemberCachedTypes = T.CachedTypes<ProjectMemberIdFields, ProjectMemberModel, ProjectMemberInsert, ProjectMemberPlainModel, ProjectMemberProjection, ProjectMemberUpdate, ProjectMemberFilter, ProjectMemberSortElement, ProjectMemberRelationsFindParams>

export class ProjectMemberDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'ProjectMember', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'ProjectMember', AST>, P2 extends T.Projection<'ProjectMember', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'ProjectMember', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'ProjectMember', AST>, P1, P2>
        }
        public constructor(params: ProjectMemberDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: projectMemberSchema() 
    })
  }
  }

export class InMemoryProjectMemberDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'ProjectMember', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'ProjectMember', AST>, P2 extends T.Projection<'ProjectMember', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'ProjectMember', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'ProjectMember', AST>, P1, P2>
        }
        public constructor(params: InMemoryProjectMemberDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: projectMemberSchema() 
    })
  }
  }
export function projectMemberRoleSchema(): T.Schema<ScalarsSpecification> {
  return {
  'id': {
              type: 'scalar',
              scalar: 'ID',
              isId: true,generationStrategy: 'db',required: true,alias: '_id',directives: {  }
            },
  'projectMember': {
                type: 'relation',
                astName: 'ProjectMember',
                relation: 'inner',
                schema: () => projectMemberSchema(),
                refFrom: 'projectMemberId',
                refTo: 'id',
                dao: 'projectMember',
                required: true,directives: {  }
              },
  'projectMemberId': {
              type: 'scalar',
              scalar: 'ID',
              required: true,directives: {  }
            },
  'roleCode': {
              type: 'scalar',
              scalar: 'String',
              required: true,isEnum: true,directives: { 'unique': {  } }
            }
  }
}

type ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'ProjectMemberRole', AST, ScalarsSpecification, ProjectMemberRoleCachedTypes, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type ProjectMemberRoleDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryProjectMemberRoleDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>


    export type ProjectMemberRoleIdFields = T.IdFields<'ProjectMemberRole', AST>
    export interface ProjectMemberRoleModel extends types.ProjectMemberRole {}
    export interface ProjectMemberRoleInsert extends T.Insert<'ProjectMemberRole', AST, ScalarsSpecification> {}
    export interface ProjectMemberRolePlainModel extends T.GenerateModel<'ProjectMemberRole', AST, ScalarsSpecification, 'relation'> {}
    export interface ProjectMemberRoleProjection extends T.Projection<'ProjectMemberRole', AST> {}
    export interface ProjectMemberRoleUpdate extends T.Update<'ProjectMemberRole', AST, ScalarsSpecification> {}
    export interface ProjectMemberRoleFilter extends T.Filter<'ProjectMemberRole', AST, ScalarsSpecification> {}
    export interface ProjectMemberRoleSortElement extends T.SortElement<'ProjectMemberRole', AST> {}
    export interface ProjectMemberRoleRelationsFindParams extends T.RelationsFindParams<'ProjectMemberRole', AST, ScalarsSpecification> {}
    export type ProjectMemberRoleParams<P extends ProjectMemberRoleProjection> = T.Params<'ProjectMemberRole', AST, ScalarsSpecification, P>
    export type ProjectMemberRoleCachedTypes = T.CachedTypes<ProjectMemberRoleIdFields, ProjectMemberRoleModel, ProjectMemberRoleInsert, ProjectMemberRolePlainModel, ProjectMemberRoleProjection, ProjectMemberRoleUpdate, ProjectMemberRoleFilter, ProjectMemberRoleSortElement, ProjectMemberRoleRelationsFindParams>

export class ProjectMemberRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'ProjectMemberRole', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'ProjectMemberRole', AST>, P2 extends T.Projection<'ProjectMemberRole', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'ProjectMemberRole', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'ProjectMemberRole', AST>, P1, P2>
        }
        public constructor(params: ProjectMemberRoleDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: projectMemberRoleSchema() 
    })
  }
  }

export class InMemoryProjectMemberRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'ProjectMemberRole', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'ProjectMemberRole', AST>, P2 extends T.Projection<'ProjectMemberRole', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'ProjectMemberRole', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'ProjectMemberRole', AST>, P1, P2>
        }
        public constructor(params: InMemoryProjectMemberRoleDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: projectMemberRoleSchema() 
    })
  }
  }
export function subscriptionSchema(): T.Schema<ScalarsSpecification> {
  return {
  'eBoardCreated': {
              type: 'embedded',
              astName: 'EBoard',
              schema: () => eBoardSchema(),
              directives: {  }
            },
  'eBoardDeleted': {
              type: 'embedded',
              astName: 'EBoard',
              schema: () => eBoardSchema(),
              directives: {  }
            },
  'eBoardTermCreated': {
              type: 'embedded',
              astName: 'EBoardTerm',
              schema: () => eBoardTermSchema(),
              directives: {  }
            },
  'eBoardTermDeleted': {
              type: 'embedded',
              astName: 'EBoardTerm',
              schema: () => eBoardTermSchema(),
              directives: {  }
            },
  'eBoardTermUpdated': {
              type: 'embedded',
              astName: 'EBoardTerm',
              schema: () => eBoardTermSchema(),
              directives: {  }
            },
  'eBoardUpdated': {
              type: 'embedded',
              astName: 'EBoard',
              schema: () => eBoardSchema(),
              directives: {  }
            },
  'projectCreated': {
              type: 'embedded',
              astName: 'Project',
              schema: () => projectSchema(),
              directives: {  }
            },
  'projectDeleted': {
              type: 'embedded',
              astName: 'Project',
              schema: () => projectSchema(),
              directives: {  }
            },
  'projectInviteCreated': {
              type: 'embedded',
              astName: 'ProjectInvite',
              schema: () => projectInviteSchema(),
              directives: {  }
            },
  'projectInviteDeleted': {
              type: 'embedded',
              astName: 'ProjectInvite',
              schema: () => projectInviteSchema(),
              directives: {  }
            },
  'projectMemberCreated': {
              type: 'embedded',
              astName: 'ProjectMember',
              schema: () => projectMemberSchema(),
              directives: {  }
            },
  'projectMemberDeleted': {
              type: 'embedded',
              astName: 'ProjectMember',
              schema: () => projectMemberSchema(),
              directives: {  }
            },
  'projectMemberUpdated': {
              type: 'embedded',
              astName: 'ProjectMember',
              schema: () => projectMemberSchema(),
              directives: {  }
            },
  'projectUpdated': {
              type: 'embedded',
              astName: 'Project',
              schema: () => projectSchema(),
              directives: {  }
            },
  'userCreated': {
              type: 'embedded',
              astName: 'User',
              schema: () => userSchema(),
              directives: {  }
            },
  'userDeleted': {
              type: 'embedded',
              astName: 'User',
              schema: () => userSchema(),
              directives: {  }
            },
  'userLoginIdentityCreated': {
              type: 'embedded',
              astName: 'UserLoginIdentity',
              schema: () => userLoginIdentitySchema(),
              directives: {  }
            },
  'userLoginIdentityDeleted': {
              type: 'embedded',
              astName: 'UserLoginIdentity',
              schema: () => userLoginIdentitySchema(),
              directives: {  }
            },
  'userLoginIdentityUpdated': {
              type: 'embedded',
              astName: 'UserLoginIdentity',
              schema: () => userLoginIdentitySchema(),
              directives: {  }
            },
  'userUpdated': {
              type: 'embedded',
              astName: 'User',
              schema: () => userSchema(),
              directives: {  }
            }
  }
}


    export interface SubscriptionModel extends types.Subscription {}
    export interface SubscriptionPlainModel extends T.GenerateModel<'Subscription', AST, ScalarsSpecification, 'relation'> {}
export function userSchema(): T.Schema<ScalarsSpecification> {
  return {
  'avatarLink': {
              type: 'scalar',
              scalar: 'String',
              directives: {  }
            },
  'bannerLink': {
              type: 'scalar',
              scalar: 'String',
              directives: {  }
            },
  'bio': {
              type: 'scalar',
              scalar: 'String',
              directives: {  }
            },
  'classYear': {
              type: 'scalar',
              scalar: 'Int',
              directives: {  }
            },
  'createdAt': {
              type: 'scalar',
              scalar: 'Date',
              directives: { 'createdAt': {  } }
            },
  'displayName': {
              type: 'scalar',
              scalar: 'String',
              required: true,directives: {  }
            },
  'eBoard':{
                type: 'relation',
                astName: 'EBoard',
                relation: 'foreign',
                schema: () => eBoardSchema(),
                refFrom: 'userId',
                refTo: 'id',
                dao: 'eBoard',
                directives: {  }
              },
  'email': {
              type: 'scalar',
              scalar: 'String',
              directives: {  }
            },
  'id': {
              type: 'scalar',
              scalar: 'ID',
              isId: true,generationStrategy: 'db',required: true,alias: '_id',directives: {  }
            },
  'loginIdentities':{
                type: 'relation',
                astName: 'UserLoginIdentity',
                relation: 'foreign',
                schema: () => userLoginIdentitySchema(),
                refFrom: 'userId',
                refTo: 'id',
                dao: 'userLoginIdentity',
                isListElementRequired: true,required: true,isList: true,directives: {  }
              },
  'projectInvites':{
                type: 'relation',
                astName: 'ProjectInvite',
                relation: 'foreign',
                schema: () => projectInviteSchema(),
                refFrom: 'userId',
                refTo: 'id',
                dao: 'projectInvite',
                isListElementRequired: true,required: true,isList: true,directives: {  }
              },
  'projectMembers':{
                type: 'relation',
                astName: 'ProjectMember',
                relation: 'foreign',
                schema: () => projectMemberSchema(),
                refFrom: 'userId',
                refTo: 'id',
                dao: 'projectMember',
                isListElementRequired: true,required: true,isList: true,directives: {  }
              },
  'roles':{
                type: 'relation',
                astName: 'UserRole',
                relation: 'foreign',
                schema: () => userRoleSchema(),
                refFrom: 'userId',
                refTo: 'id',
                dao: 'userRole',
                isListElementRequired: true,required: true,isList: true,directives: {  }
              },
  'socials':{
                type: 'relation',
                astName: 'UserSocial',
                relation: 'foreign',
                schema: () => userSocialSchema(),
                refFrom: 'userId',
                refTo: 'id',
                dao: 'userSocial',
                isListElementRequired: true,required: true,isList: true,directives: {  }
              },
  'updatedAt': {
              type: 'scalar',
              scalar: 'Date',
              directives: { 'updatedAt': {  } }
            },
  'username': {
              type: 'scalar',
              scalar: 'String',
              required: true,directives: {  }
            }
  }
}

type UserDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'User', AST, ScalarsSpecification, UserCachedTypes, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryUserDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>


    export type UserIdFields = T.IdFields<'User', AST>
    export interface UserModel extends types.User {}
    export interface UserInsert extends T.Insert<'User', AST, ScalarsSpecification> {}
    export interface UserPlainModel extends T.GenerateModel<'User', AST, ScalarsSpecification, 'relation'> {}
    export interface UserProjection extends T.Projection<'User', AST> {}
    export interface UserUpdate extends T.Update<'User', AST, ScalarsSpecification> {}
    export interface UserFilter extends T.Filter<'User', AST, ScalarsSpecification> {}
    export interface UserSortElement extends T.SortElement<'User', AST> {}
    export interface UserRelationsFindParams extends T.RelationsFindParams<'User', AST, ScalarsSpecification> {}
    export type UserParams<P extends UserProjection> = T.Params<'User', AST, ScalarsSpecification, P>
    export type UserCachedTypes = T.CachedTypes<UserIdFields, UserModel, UserInsert, UserPlainModel, UserProjection, UserUpdate, UserFilter, UserSortElement, UserRelationsFindParams>

export class UserDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'User', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'User', AST>, P2 extends T.Projection<'User', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'User', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'User', AST>, P1, P2>
        }
        public constructor(params: UserDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: userSchema() 
    })
  }
  }

export class InMemoryUserDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'User', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'User', AST>, P2 extends T.Projection<'User', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'User', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'User', AST>, P1, P2>
        }
        public constructor(params: InMemoryUserDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: userSchema() 
    })
  }
  }
export function userLoginIdentitySchema(): T.Schema<ScalarsSpecification> {
  return {
  'data': {
              type: 'scalar',
              scalar: 'Json',
              directives: {  }
            },
  'id': {
              type: 'scalar',
              scalar: 'ID',
              isId: true,generationStrategy: 'db',required: true,alias: '_id',directives: {  }
            },
  'identityId': {
              type: 'scalar',
              scalar: 'String',
              required: true,directives: {  }
            },
  'name': {
              type: 'scalar',
              scalar: 'String',
              required: true,directives: { 'unique': {  } }
            },
  'user': {
                type: 'relation',
                astName: 'User',
                relation: 'inner',
                schema: () => userSchema(),
                refFrom: 'userId',
                refTo: 'id',
                dao: 'user',
                required: true,directives: {  }
              },
  'userId': {
              type: 'scalar',
              scalar: 'ID',
              required: true,directives: {  }
            }
  }
}

type UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'UserLoginIdentity', AST, ScalarsSpecification, UserLoginIdentityCachedTypes, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type UserLoginIdentityDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryUserLoginIdentityDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>


    export type UserLoginIdentityIdFields = T.IdFields<'UserLoginIdentity', AST>
    export interface UserLoginIdentityModel extends types.UserLoginIdentity {}
    export interface UserLoginIdentityInsert extends T.Insert<'UserLoginIdentity', AST, ScalarsSpecification> {}
    export interface UserLoginIdentityPlainModel extends T.GenerateModel<'UserLoginIdentity', AST, ScalarsSpecification, 'relation'> {}
    export interface UserLoginIdentityProjection extends T.Projection<'UserLoginIdentity', AST> {}
    export interface UserLoginIdentityUpdate extends T.Update<'UserLoginIdentity', AST, ScalarsSpecification> {}
    export interface UserLoginIdentityFilter extends T.Filter<'UserLoginIdentity', AST, ScalarsSpecification> {}
    export interface UserLoginIdentitySortElement extends T.SortElement<'UserLoginIdentity', AST> {}
    export interface UserLoginIdentityRelationsFindParams extends T.RelationsFindParams<'UserLoginIdentity', AST, ScalarsSpecification> {}
    export type UserLoginIdentityParams<P extends UserLoginIdentityProjection> = T.Params<'UserLoginIdentity', AST, ScalarsSpecification, P>
    export type UserLoginIdentityCachedTypes = T.CachedTypes<UserLoginIdentityIdFields, UserLoginIdentityModel, UserLoginIdentityInsert, UserLoginIdentityPlainModel, UserLoginIdentityProjection, UserLoginIdentityUpdate, UserLoginIdentityFilter, UserLoginIdentitySortElement, UserLoginIdentityRelationsFindParams>

export class UserLoginIdentityDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'UserLoginIdentity', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'UserLoginIdentity', AST>, P2 extends T.Projection<'UserLoginIdentity', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'UserLoginIdentity', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'UserLoginIdentity', AST>, P1, P2>
        }
        public constructor(params: UserLoginIdentityDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: userLoginIdentitySchema() 
    })
  }
  }

export class InMemoryUserLoginIdentityDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'UserLoginIdentity', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'UserLoginIdentity', AST>, P2 extends T.Projection<'UserLoginIdentity', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'UserLoginIdentity', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'UserLoginIdentity', AST>, P1, P2>
        }
        public constructor(params: InMemoryUserLoginIdentityDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: userLoginIdentitySchema() 
    })
  }
  }
export function userRoleSchema(): T.Schema<ScalarsSpecification> {
  return {
  'id': {
              type: 'scalar',
              scalar: 'ID',
              isId: true,generationStrategy: 'db',required: true,alias: '_id',directives: {  }
            },
  'roleCode': {
              type: 'scalar',
              scalar: 'String',
              required: true,isEnum: true,directives: { 'unique': {  } }
            },
  'user': {
                type: 'relation',
                astName: 'User',
                relation: 'inner',
                schema: () => userSchema(),
                refFrom: 'userId',
                refTo: 'id',
                dao: 'user',
                required: true,directives: {  }
              },
  'userId': {
              type: 'scalar',
              scalar: 'ID',
              required: true,directives: { 'unique': {  } }
            }
  }
}

type UserRoleDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'UserRole', AST, ScalarsSpecification, UserRoleCachedTypes, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type UserRoleDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<UserRoleDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryUserRoleDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<UserRoleDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>


    export type UserRoleIdFields = T.IdFields<'UserRole', AST>
    export interface UserRoleModel extends types.UserRole {}
    export interface UserRoleInsert extends T.Insert<'UserRole', AST, ScalarsSpecification> {}
    export interface UserRolePlainModel extends T.GenerateModel<'UserRole', AST, ScalarsSpecification, 'relation'> {}
    export interface UserRoleProjection extends T.Projection<'UserRole', AST> {}
    export interface UserRoleUpdate extends T.Update<'UserRole', AST, ScalarsSpecification> {}
    export interface UserRoleFilter extends T.Filter<'UserRole', AST, ScalarsSpecification> {}
    export interface UserRoleSortElement extends T.SortElement<'UserRole', AST> {}
    export interface UserRoleRelationsFindParams extends T.RelationsFindParams<'UserRole', AST, ScalarsSpecification> {}
    export type UserRoleParams<P extends UserRoleProjection> = T.Params<'UserRole', AST, ScalarsSpecification, P>
    export type UserRoleCachedTypes = T.CachedTypes<UserRoleIdFields, UserRoleModel, UserRoleInsert, UserRolePlainModel, UserRoleProjection, UserRoleUpdate, UserRoleFilter, UserRoleSortElement, UserRoleRelationsFindParams>

export class UserRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserRoleDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'UserRole', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'UserRole', AST>, P2 extends T.Projection<'UserRole', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'UserRole', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'UserRole', AST>, P1, P2>
        }
        public constructor(params: UserRoleDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: userRoleSchema() 
    })
  }
  }

export class InMemoryUserRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserRoleDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'UserRole', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'UserRole', AST>, P2 extends T.Projection<'UserRole', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'UserRole', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'UserRole', AST>, P1, P2>
        }
        public constructor(params: InMemoryUserRoleDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: userRoleSchema() 
    })
  }
  }
export function userSocialSchema(): T.Schema<ScalarsSpecification> {
  return {
  'id': {
              type: 'scalar',
              scalar: 'ID',
              isId: true,generationStrategy: 'db',required: true,alias: '_id',directives: {  }
            },
  'link': {
              type: 'scalar',
              scalar: 'String',
              required: true,directives: {  }
            },
  'platform': {
              type: 'scalar',
              scalar: 'String',
              required: true,directives: {  }
            },
  'user': {
                type: 'relation',
                astName: 'User',
                relation: 'inner',
                schema: () => userSchema(),
                refFrom: 'userId',
                refTo: 'id',
                dao: 'user',
                required: true,directives: {  }
              },
  'userId': {
              type: 'scalar',
              scalar: 'ID',
              required: true,directives: {  }
            },
  'username': {
              type: 'scalar',
              scalar: 'String',
              required: true,directives: {  }
            }
  }
}

type UserSocialDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<'UserSocial', AST, ScalarsSpecification, UserSocialCachedTypes, MetadataType, OperationMetadataType, EntityManager<MetadataType, OperationMetadataType>>
export type UserSocialDAOParams<MetadataType, OperationMetadataType> = Omit<T.MongoDBDAOParams<UserSocialDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>
export type InMemoryUserSocialDAOParams<MetadataType, OperationMetadataType> = Omit<T.InMemoryDAOParams<UserSocialDAOGenerics<MetadataType, OperationMetadataType>>, 'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'>


    export type UserSocialIdFields = T.IdFields<'UserSocial', AST>
    export interface UserSocialModel extends types.UserSocial {}
    export interface UserSocialInsert extends T.Insert<'UserSocial', AST, ScalarsSpecification> {}
    export interface UserSocialPlainModel extends T.GenerateModel<'UserSocial', AST, ScalarsSpecification, 'relation'> {}
    export interface UserSocialProjection extends T.Projection<'UserSocial', AST> {}
    export interface UserSocialUpdate extends T.Update<'UserSocial', AST, ScalarsSpecification> {}
    export interface UserSocialFilter extends T.Filter<'UserSocial', AST, ScalarsSpecification> {}
    export interface UserSocialSortElement extends T.SortElement<'UserSocial', AST> {}
    export interface UserSocialRelationsFindParams extends T.RelationsFindParams<'UserSocial', AST, ScalarsSpecification> {}
    export type UserSocialParams<P extends UserSocialProjection> = T.Params<'UserSocial', AST, ScalarsSpecification, P>
    export type UserSocialCachedTypes = T.CachedTypes<UserSocialIdFields, UserSocialModel, UserSocialInsert, UserSocialPlainModel, UserSocialProjection, UserSocialUpdate, UserSocialFilter, UserSocialSortElement, UserSocialRelationsFindParams>

export class UserSocialDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserSocialDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'UserSocial', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'UserSocial', AST>, P2 extends T.Projection<'UserSocial', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'UserSocial', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'UserSocial', AST>, P1, P2>
        }
        public constructor(params: UserSocialDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: userSocialSchema() 
    })
  }
  }

export class InMemoryUserSocialDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserSocialDAOGenerics<MetadataType, OperationMetadataType>> {  
  
        public static projection<P extends T.Projection<'UserSocial', AST>>(p: P) {
          return p
        }
        public static mergeProjection<P1 extends T.Projection<'UserSocial', AST>, P2 extends T.Projection<'UserSocial', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'UserSocial', AST>, P1, P2> {
          return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'UserSocial', AST>, P1, P2>
        }
        public constructor(params: InMemoryUserSocialDAOParams<MetadataType, OperationMetadataType>){
    super({   
      ...params, 
      schema: userSocialSchema() 
    })
  }
  }


export type EntityManagerParams<MetadataType, OperationMetadataType, Permissions extends string, SecurityDomain extends Record<string, unknown>> = {
  metadata?: MetadataType
  middlewares?: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  overrides?: { 
    eBoard?: Pick<Partial<EBoardDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    eBoardTerm?: Pick<Partial<EBoardTermDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    eBoardTermRole?: Pick<Partial<EBoardTermRoleDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    project?: Pick<Partial<ProjectDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    projectDiscordConfig?: Pick<Partial<ProjectDiscordConfigDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    projectInvite?: Pick<Partial<ProjectInviteDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    projectMember?: Pick<Partial<ProjectMemberDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    projectMemberRole?: Pick<Partial<ProjectMemberRoleDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    userLoginIdentity?: Pick<Partial<UserLoginIdentityDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    userRole?: Pick<Partial<UserRoleDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>,
    userSocial?: Pick<Partial<UserSocialDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
  },
  mongodb: Record<'default', M.Db | 'mock'>,
  scalars?: T.UserInputDriverDataTypeAdapterMap<ScalarsSpecification, 'mongo'>,
  log?: T.LogInput<'EBoard' | 'EBoardTerm' | 'EBoardTermRole' | 'Project' | 'ProjectDiscordConfig' | 'ProjectInvite' | 'ProjectMember' | 'ProjectMemberRole' | 'User' | 'UserLoginIdentity' | 'UserRole' | 'UserSocial'>,
  awaitLog?: boolean,
  security?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}
type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>
export class EntityManager<MetadataType = never, OperationMetadataType = never, Permissions extends string = never, SecurityDomain extends Record<string, unknown> = never> extends T.AbstractEntityManager<'default', never, ScalarsSpecification, MetadataType>  {

  private _eBoard: EBoardDAO<MetadataType, OperationMetadataType> | undefined
  private _eBoardTerm: EBoardTermDAO<MetadataType, OperationMetadataType> | undefined
  private _eBoardTermRole: EBoardTermRoleDAO<MetadataType, OperationMetadataType> | undefined
  private _project: ProjectDAO<MetadataType, OperationMetadataType> | undefined
  private _projectDiscordConfig: ProjectDiscordConfigDAO<MetadataType, OperationMetadataType> | undefined
  private _projectInvite: ProjectInviteDAO<MetadataType, OperationMetadataType> | undefined
  private _projectMember: ProjectMemberDAO<MetadataType, OperationMetadataType> | undefined
  private _projectMemberRole: ProjectMemberRoleDAO<MetadataType, OperationMetadataType> | undefined
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined
  private _userLoginIdentity: UserLoginIdentityDAO<MetadataType, OperationMetadataType> | undefined
  private _userRole: UserRoleDAO<MetadataType, OperationMetadataType> | undefined
  private _userSocial: UserSocialDAO<MetadataType, OperationMetadataType> | undefined
  
  private params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>
  
  private overrides: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides']
  private mongodb: Record<'default', M.Db | 'mock'>
  
  private middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  
  private logger?: T.LogFunction<'EBoard' | 'EBoardTerm' | 'EBoardTermRole' | 'Project' | 'ProjectDiscordConfig' | 'ProjectInvite' | 'ProjectMember' | 'ProjectMemberRole' | 'User' | 'UserLoginIdentity' | 'UserRole' | 'UserSocial'>
  
  get eBoard(): EBoardDAO<MetadataType, OperationMetadataType> {
    if(!this._eBoard) {
      const db = this.mongodb.default
      this._eBoard = db === 'mock' ? (new InMemoryEBoardDAO({ entityManager: this, datasource: null, metadata: this.metadata, ...this.overrides?.eBoard, middlewares: [...(this.overrides?.eBoard?.middlewares || []), ...selectMiddleware('eBoard', this.middlewares) as T.DAOMiddleware<EBoardDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'EBoard', logger: this.logger, awaitLog: this.params.awaitLog }) as unknown as EBoardDAO<MetadataType, OperationMetadataType>) : new EBoardDAO({ entityManager: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.eBoard, collection: db.collection('eBoards'), middlewares: [...(this.overrides?.eBoard?.middlewares || []), ...selectMiddleware('eBoard', this.middlewares) as T.DAOMiddleware<EBoardDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'EBoard', logger: this.logger, awaitLog: this.params.awaitLog })
    }
    return this._eBoard
  }
  get eBoardTerm(): EBoardTermDAO<MetadataType, OperationMetadataType> {
    if(!this._eBoardTerm) {
      const db = this.mongodb.default
      this._eBoardTerm = db === 'mock' ? (new InMemoryEBoardTermDAO({ entityManager: this, datasource: null, metadata: this.metadata, ...this.overrides?.eBoardTerm, middlewares: [...(this.overrides?.eBoardTerm?.middlewares || []), ...selectMiddleware('eBoardTerm', this.middlewares) as T.DAOMiddleware<EBoardTermDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'EBoardTerm', logger: this.logger, awaitLog: this.params.awaitLog }) as unknown as EBoardTermDAO<MetadataType, OperationMetadataType>) : new EBoardTermDAO({ entityManager: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.eBoardTerm, collection: db.collection('eBoardTerms'), middlewares: [...(this.overrides?.eBoardTerm?.middlewares || []), ...selectMiddleware('eBoardTerm', this.middlewares) as T.DAOMiddleware<EBoardTermDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'EBoardTerm', logger: this.logger, awaitLog: this.params.awaitLog })
    }
    return this._eBoardTerm
  }
  get eBoardTermRole(): EBoardTermRoleDAO<MetadataType, OperationMetadataType> {
    if(!this._eBoardTermRole) {
      const db = this.mongodb.default
      this._eBoardTermRole = db === 'mock' ? (new InMemoryEBoardTermRoleDAO({ entityManager: this, datasource: null, metadata: this.metadata, ...this.overrides?.eBoardTermRole, middlewares: [...(this.overrides?.eBoardTermRole?.middlewares || []), ...selectMiddleware('eBoardTermRole', this.middlewares) as T.DAOMiddleware<EBoardTermRoleDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'EBoardTermRole', logger: this.logger, awaitLog: this.params.awaitLog }) as unknown as EBoardTermRoleDAO<MetadataType, OperationMetadataType>) : new EBoardTermRoleDAO({ entityManager: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.eBoardTermRole, collection: db.collection('eBoardTermRoles'), middlewares: [...(this.overrides?.eBoardTermRole?.middlewares || []), ...selectMiddleware('eBoardTermRole', this.middlewares) as T.DAOMiddleware<EBoardTermRoleDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'EBoardTermRole', logger: this.logger, awaitLog: this.params.awaitLog })
    }
    return this._eBoardTermRole
  }
  get project(): ProjectDAO<MetadataType, OperationMetadataType> {
    if(!this._project) {
      const db = this.mongodb.default
      this._project = db === 'mock' ? (new InMemoryProjectDAO({ entityManager: this, datasource: null, metadata: this.metadata, ...this.overrides?.project, middlewares: [...(this.overrides?.project?.middlewares || []), ...selectMiddleware('project', this.middlewares) as T.DAOMiddleware<ProjectDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'Project', logger: this.logger, awaitLog: this.params.awaitLog }) as unknown as ProjectDAO<MetadataType, OperationMetadataType>) : new ProjectDAO({ entityManager: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.project, collection: db.collection('projects'), middlewares: [...(this.overrides?.project?.middlewares || []), ...selectMiddleware('project', this.middlewares) as T.DAOMiddleware<ProjectDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'Project', logger: this.logger, awaitLog: this.params.awaitLog })
    }
    return this._project
  }
  get projectDiscordConfig(): ProjectDiscordConfigDAO<MetadataType, OperationMetadataType> {
    if(!this._projectDiscordConfig) {
      const db = this.mongodb.default
      this._projectDiscordConfig = db === 'mock' ? (new InMemoryProjectDiscordConfigDAO({ entityManager: this, datasource: null, metadata: this.metadata, ...this.overrides?.projectDiscordConfig, middlewares: [...(this.overrides?.projectDiscordConfig?.middlewares || []), ...selectMiddleware('projectDiscordConfig', this.middlewares) as T.DAOMiddleware<ProjectDiscordConfigDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'ProjectDiscordConfig', logger: this.logger, awaitLog: this.params.awaitLog }) as unknown as ProjectDiscordConfigDAO<MetadataType, OperationMetadataType>) : new ProjectDiscordConfigDAO({ entityManager: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.projectDiscordConfig, collection: db.collection('projectDiscordConfigs'), middlewares: [...(this.overrides?.projectDiscordConfig?.middlewares || []), ...selectMiddleware('projectDiscordConfig', this.middlewares) as T.DAOMiddleware<ProjectDiscordConfigDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'ProjectDiscordConfig', logger: this.logger, awaitLog: this.params.awaitLog })
    }
    return this._projectDiscordConfig
  }
  get projectInvite(): ProjectInviteDAO<MetadataType, OperationMetadataType> {
    if(!this._projectInvite) {
      const db = this.mongodb.default
      this._projectInvite = db === 'mock' ? (new InMemoryProjectInviteDAO({ entityManager: this, datasource: null, metadata: this.metadata, ...this.overrides?.projectInvite, middlewares: [...(this.overrides?.projectInvite?.middlewares || []), ...selectMiddleware('projectInvite', this.middlewares) as T.DAOMiddleware<ProjectInviteDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'ProjectInvite', logger: this.logger, awaitLog: this.params.awaitLog }) as unknown as ProjectInviteDAO<MetadataType, OperationMetadataType>) : new ProjectInviteDAO({ entityManager: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.projectInvite, collection: db.collection('projectInvites'), middlewares: [...(this.overrides?.projectInvite?.middlewares || []), ...selectMiddleware('projectInvite', this.middlewares) as T.DAOMiddleware<ProjectInviteDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'ProjectInvite', logger: this.logger, awaitLog: this.params.awaitLog })
    }
    return this._projectInvite
  }
  get projectMember(): ProjectMemberDAO<MetadataType, OperationMetadataType> {
    if(!this._projectMember) {
      const db = this.mongodb.default
      this._projectMember = db === 'mock' ? (new InMemoryProjectMemberDAO({ entityManager: this, datasource: null, metadata: this.metadata, ...this.overrides?.projectMember, middlewares: [...(this.overrides?.projectMember?.middlewares || []), ...selectMiddleware('projectMember', this.middlewares) as T.DAOMiddleware<ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'ProjectMember', logger: this.logger, awaitLog: this.params.awaitLog }) as unknown as ProjectMemberDAO<MetadataType, OperationMetadataType>) : new ProjectMemberDAO({ entityManager: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.projectMember, collection: db.collection('projectMembers'), middlewares: [...(this.overrides?.projectMember?.middlewares || []), ...selectMiddleware('projectMember', this.middlewares) as T.DAOMiddleware<ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'ProjectMember', logger: this.logger, awaitLog: this.params.awaitLog })
    }
    return this._projectMember
  }
  get projectMemberRole(): ProjectMemberRoleDAO<MetadataType, OperationMetadataType> {
    if(!this._projectMemberRole) {
      const db = this.mongodb.default
      this._projectMemberRole = db === 'mock' ? (new InMemoryProjectMemberRoleDAO({ entityManager: this, datasource: null, metadata: this.metadata, ...this.overrides?.projectMemberRole, middlewares: [...(this.overrides?.projectMemberRole?.middlewares || []), ...selectMiddleware('projectMemberRole', this.middlewares) as T.DAOMiddleware<ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'ProjectMemberRole', logger: this.logger, awaitLog: this.params.awaitLog }) as unknown as ProjectMemberRoleDAO<MetadataType, OperationMetadataType>) : new ProjectMemberRoleDAO({ entityManager: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.projectMemberRole, collection: db.collection('projectMemberRoles'), middlewares: [...(this.overrides?.projectMemberRole?.middlewares || []), ...selectMiddleware('projectMemberRole', this.middlewares) as T.DAOMiddleware<ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'ProjectMemberRole', logger: this.logger, awaitLog: this.params.awaitLog })
    }
    return this._projectMemberRole
  }
  get user(): UserDAO<MetadataType, OperationMetadataType> {
    if(!this._user) {
      const db = this.mongodb.default
      this._user = db === 'mock' ? (new InMemoryUserDAO({ entityManager: this, datasource: null, metadata: this.metadata, ...this.overrides?.user, middlewares: [...(this.overrides?.user?.middlewares || []), ...selectMiddleware('user', this.middlewares) as T.DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'User', logger: this.logger, awaitLog: this.params.awaitLog }) as unknown as UserDAO<MetadataType, OperationMetadataType>) : new UserDAO({ entityManager: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.user, collection: db.collection('users'), middlewares: [...(this.overrides?.user?.middlewares || []), ...selectMiddleware('user', this.middlewares) as T.DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'User', logger: this.logger, awaitLog: this.params.awaitLog })
    }
    return this._user
  }
  get userLoginIdentity(): UserLoginIdentityDAO<MetadataType, OperationMetadataType> {
    if(!this._userLoginIdentity) {
      const db = this.mongodb.default
      this._userLoginIdentity = db === 'mock' ? (new InMemoryUserLoginIdentityDAO({ entityManager: this, datasource: null, metadata: this.metadata, ...this.overrides?.userLoginIdentity, middlewares: [...(this.overrides?.userLoginIdentity?.middlewares || []), ...selectMiddleware('userLoginIdentity', this.middlewares) as T.DAOMiddleware<UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'UserLoginIdentity', logger: this.logger, awaitLog: this.params.awaitLog }) as unknown as UserLoginIdentityDAO<MetadataType, OperationMetadataType>) : new UserLoginIdentityDAO({ entityManager: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.userLoginIdentity, collection: db.collection('userLoginIdentitys'), middlewares: [...(this.overrides?.userLoginIdentity?.middlewares || []), ...selectMiddleware('userLoginIdentity', this.middlewares) as T.DAOMiddleware<UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'UserLoginIdentity', logger: this.logger, awaitLog: this.params.awaitLog })
    }
    return this._userLoginIdentity
  }
  get userRole(): UserRoleDAO<MetadataType, OperationMetadataType> {
    if(!this._userRole) {
      const db = this.mongodb.default
      this._userRole = db === 'mock' ? (new InMemoryUserRoleDAO({ entityManager: this, datasource: null, metadata: this.metadata, ...this.overrides?.userRole, middlewares: [...(this.overrides?.userRole?.middlewares || []), ...selectMiddleware('userRole', this.middlewares) as T.DAOMiddleware<UserRoleDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'UserRole', logger: this.logger, awaitLog: this.params.awaitLog }) as unknown as UserRoleDAO<MetadataType, OperationMetadataType>) : new UserRoleDAO({ entityManager: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.userRole, collection: db.collection('userRoles'), middlewares: [...(this.overrides?.userRole?.middlewares || []), ...selectMiddleware('userRole', this.middlewares) as T.DAOMiddleware<UserRoleDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'UserRole', logger: this.logger, awaitLog: this.params.awaitLog })
    }
    return this._userRole
  }
  get userSocial(): UserSocialDAO<MetadataType, OperationMetadataType> {
    if(!this._userSocial) {
      const db = this.mongodb.default
      this._userSocial = db === 'mock' ? (new InMemoryUserSocialDAO({ entityManager: this, datasource: null, metadata: this.metadata, ...this.overrides?.userSocial, middlewares: [...(this.overrides?.userSocial?.middlewares || []), ...selectMiddleware('userSocial', this.middlewares) as T.DAOMiddleware<UserSocialDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'UserSocial', logger: this.logger, awaitLog: this.params.awaitLog }) as unknown as UserSocialDAO<MetadataType, OperationMetadataType>) : new UserSocialDAO({ entityManager: this, datasource: 'default', metadata: this.metadata, ...this.overrides?.userSocial, collection: db.collection('userSocials'), middlewares: [...(this.overrides?.userSocial?.middlewares || []), ...selectMiddleware('userSocial', this.middlewares) as T.DAOMiddleware<UserSocialDAOGenerics<MetadataType, OperationMetadataType>>[]], name: 'UserSocial', logger: this.logger, awaitLog: this.params.awaitLog })
    }
    return this._userSocial
  }
  
  constructor(params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>) {
    super({
      ...params,
      scalars: params.scalars ? T.userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Access', 'Date', 'InviteType', 'Json', 'Permission', 'RoleCode', 'SortDirection', 'StringFilterMode', 'Upload', 'UploadOperation', 'ID', 'String', 'Boolean', 'Int', 'Float']) : undefined
    })
    this.overrides = params.overrides
    this.mongodb = params.mongodb
    this.middlewares = params.middlewares || []
    this.logger = T.logInputToLogger(params.log)
    if(params.security && params.security.applySecurity !== false) {
      const securityMiddlewares = T.createSecurityPolicyMiddlewares(params.security)
      const defaultMiddleware = securityMiddlewares.others ? [groupMiddleware.excludes(Object.fromEntries(Object.keys(securityMiddlewares.middlewares).map(k => [k, true])) as any, securityMiddlewares.others as any)] : []
      this.middlewares = [...(params.middlewares ?? []), ...defaultMiddleware, ...Object.entries(securityMiddlewares.middlewares).map(([name, middleware]) => groupMiddleware.includes({[name]: true} as any, middleware as any))]
    }
    this.params = params
  }
  
  public async execQuery<T>(run: (dbs: { mongodb: Record<'default', M.Db | 'mock'> }, entities: { eBoard: M.Collection<M.Document> | null, eBoardTerm: M.Collection<M.Document> | null, eBoardTermRole: M.Collection<M.Document> | null, project: M.Collection<M.Document> | null, projectDiscordConfig: M.Collection<M.Document> | null, projectInvite: M.Collection<M.Document> | null, projectMember: M.Collection<M.Document> | null, projectMemberRole: M.Collection<M.Document> | null, user: M.Collection<M.Document> | null, userLoginIdentity: M.Collection<M.Document> | null, userRole: M.Collection<M.Document> | null, userSocial: M.Collection<M.Document> | null }) => Promise<T>): Promise<T> {
    return run({ mongodb: this.mongodb }, { eBoard: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('eBoards'), eBoardTerm: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('eBoardTerms'), eBoardTermRole: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('eBoardTermRoles'), project: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('projects'), projectDiscordConfig: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('projectDiscordConfigs'), projectInvite: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('projectInvites'), projectMember: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('projectMembers'), projectMemberRole: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('projectMemberRoles'), user: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('users'), userLoginIdentity: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('userLoginIdentitys'), userRole: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('userRoles'), userSocial: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('userSocials') })
  }
  
  protected clone(): this {
    return new EntityManager<MetadataType, OperationMetadataType, Permissions, SecurityDomain>(this.params) as this
  }
  
  

}

type DAOName = keyof DAOGenericsMap<never, never>
type DAOGenericsMap<MetadataType, OperationMetadataType> = {
  eBoard: EBoardDAOGenerics<MetadataType, OperationMetadataType>
  eBoardTerm: EBoardTermDAOGenerics<MetadataType, OperationMetadataType>
  eBoardTermRole: EBoardTermRoleDAOGenerics<MetadataType, OperationMetadataType>
  project: ProjectDAOGenerics<MetadataType, OperationMetadataType>
  projectDiscordConfig: ProjectDiscordConfigDAOGenerics<MetadataType, OperationMetadataType>
  projectInvite: ProjectInviteDAOGenerics<MetadataType, OperationMetadataType>
  projectMember: ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>
  projectMemberRole: ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>
  user: UserDAOGenerics<MetadataType, OperationMetadataType>
  userLoginIdentity: UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType>
  userRole: UserRoleDAOGenerics<MetadataType, OperationMetadataType>
  userSocial: UserSocialDAOGenerics<MetadataType, OperationMetadataType>
}
type DAOGenericsUnion<MetadataType, OperationMetadataType> = DAOGenericsMap<MetadataType, OperationMetadataType>[DAOName]
type GroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> =
  | IncludeGroupMiddleware<N, MetadataType, OperationMetadataType>
  | ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType>
type IncludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  include: { [K in N]: true }
  middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[N]>
}
type ExcludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  exclude: { [K in N]: true }
  middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[Exclude<DAOName, N>]>
}
export const groupMiddleware = {
  includes<N extends DAOName, MetadataType, OperationMetadataType>(
    include: { [K in N]: true },
    middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[N]>,
  ): IncludeGroupMiddleware<N, MetadataType, OperationMetadataType> {
    return { include, middleware }
  },
  excludes<N extends DAOName, MetadataType, OperationMetadataType>(
    exclude: { [K in N]: true },
    middleware: ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType>['middleware'],
  ): ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType> {
    return { exclude, middleware }
  },
}
function selectMiddleware<MetadataType, OperationMetadataType>(
  name: DAOName,
  middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<DAOName, MetadataType, OperationMetadataType>)[],
): EntityManagerMiddleware<MetadataType, OperationMetadataType>[] {
  return middlewares.flatMap((m) =>
    'include' in m
      ? Object.keys(m.include).includes(name)
        ? [m.middleware]
        : []
      : 'exclude' in m
      ? !Object.keys(m.exclude).includes(name)
        ? [m.middleware as EntityManagerMiddleware<MetadataType, OperationMetadataType>]
        : []
      : [m],
  )
}
