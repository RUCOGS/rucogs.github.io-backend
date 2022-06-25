import { PartialDeep } from 'type-fest'
import * as types from './model.types'
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> }

export type ResolverTypeWrapper<T> = PartialDeep<T>

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (parent: TParent, context: TContext, info: GraphQLResolveInfo) => types.Maybe<TTypes> | Promise<types.Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Access: types.Access
  AccessFilterInput: types.AccessFilterInput
  Boolean: ResolverTypeWrapper<types.Scalars['Boolean']>
  BooleanFilterInput: types.BooleanFilterInput
  Date: ResolverTypeWrapper<types.Scalars['Date']>
  DateFilterInput: types.DateFilterInput
  EBoard: ResolverTypeWrapper<types.EBoard>
  EBoardFilterInput: types.EBoardFilterInput
  EBoardFindInput: types.EBoardFindInput
  EBoardInsertInput: types.EBoardInsertInput
  EBoardRelationsFilterInput: types.EBoardRelationsFilterInput
  EBoardSortInput: types.EBoardSortInput
  EBoardSubscriptionFilter: types.EBoardSubscriptionFilter
  EBoardTerm: ResolverTypeWrapper<types.EBoardTerm>
  EBoardTermFilterInput: types.EBoardTermFilterInput
  EBoardTermFindInput: types.EBoardTermFindInput
  EBoardTermInsertInput: types.EBoardTermInsertInput
  EBoardTermRelationsFilterInput: types.EBoardTermRelationsFilterInput
  EBoardTermRole: ResolverTypeWrapper<types.EBoardTermRole>
  EBoardTermRoleFilterInput: types.EBoardTermRoleFilterInput
  EBoardTermRoleFindInput: types.EBoardTermRoleFindInput
  EBoardTermRoleInsertInput: types.EBoardTermRoleInsertInput
  EBoardTermRoleRelationsFilterInput: types.EBoardTermRoleRelationsFilterInput
  EBoardTermRoleSortInput: types.EBoardTermRoleSortInput
  EBoardTermRoleUpdateInput: types.EBoardTermRoleUpdateInput
  EBoardTermSortInput: types.EBoardTermSortInput
  EBoardTermSubscriptionFilter: types.EBoardTermSubscriptionFilter
  EBoardTermUpdateInput: types.EBoardTermUpdateInput
  EBoardUpdateInput: types.EBoardUpdateInput
  Float: ResolverTypeWrapper<types.Scalars['Float']>
  FloatFilterInput: types.FloatFilterInput
  ID: ResolverTypeWrapper<types.Scalars['ID']>
  IDFilterInput: types.IdFilterInput
  Int: ResolverTypeWrapper<types.Scalars['Int']>
  IntFilterInput: types.IntFilterInput
  InviteType: types.InviteType
  InviteTypeFilterInput: types.InviteTypeFilterInput
  Json: ResolverTypeWrapper<types.Scalars['Json']>
  JsonFilterInput: types.JsonFilterInput
  Mutation: ResolverTypeWrapper<{}>
  NewEBoardInput: types.NewEBoardInput
  NewEBoardTermInput: types.NewEBoardTermInput
  NewProjectInput: types.NewProjectInput
  NewProjectInviteInput: types.NewProjectInviteInput
  NewProjectMemberRoleInput: types.NewProjectMemberRoleInput
  NewUserRoleInput: types.NewUserRoleInput
  Permission: types.Permission
  PermissionFilterInput: types.PermissionFilterInput
  Project: ResolverTypeWrapper<types.Project>
  ProjectFilterInput: types.ProjectFilterInput
  ProjectFindInput: types.ProjectFindInput
  ProjectInsertInput: types.ProjectInsertInput
  ProjectInvite: ResolverTypeWrapper<types.ProjectInvite>
  ProjectInviteFilterInput: types.ProjectInviteFilterInput
  ProjectInviteFindInput: types.ProjectInviteFindInput
  ProjectInviteInsertInput: types.ProjectInviteInsertInput
  ProjectInviteRelationsFilterInput: types.ProjectInviteRelationsFilterInput
  ProjectInviteSortInput: types.ProjectInviteSortInput
  ProjectInviteSubscriptionFilter: types.ProjectInviteSubscriptionFilter
  ProjectInviteUpdateInput: types.ProjectInviteUpdateInput
  ProjectMember: ResolverTypeWrapper<types.ProjectMember>
  ProjectMemberFilterInput: types.ProjectMemberFilterInput
  ProjectMemberFindInput: types.ProjectMemberFindInput
  ProjectMemberInsertInput: types.ProjectMemberInsertInput
  ProjectMemberRelationsFilterInput: types.ProjectMemberRelationsFilterInput
  ProjectMemberRole: ResolverTypeWrapper<types.ProjectMemberRole>
  ProjectMemberRoleFilterInput: types.ProjectMemberRoleFilterInput
  ProjectMemberRoleFindInput: types.ProjectMemberRoleFindInput
  ProjectMemberRoleInsertInput: types.ProjectMemberRoleInsertInput
  ProjectMemberRoleRelationsFilterInput: types.ProjectMemberRoleRelationsFilterInput
  ProjectMemberRoleSortInput: types.ProjectMemberRoleSortInput
  ProjectMemberRoleUpdateInput: types.ProjectMemberRoleUpdateInput
  ProjectMemberSortInput: types.ProjectMemberSortInput
  ProjectMemberSubscriptionFilter: types.ProjectMemberSubscriptionFilter
  ProjectMemberUpdateInput: types.ProjectMemberUpdateInput
  ProjectRelationsFilterInput: types.ProjectRelationsFilterInput
  ProjectSortInput: types.ProjectSortInput
  ProjectSubscriptionFilter: types.ProjectSubscriptionFilter
  ProjectUpdateInput: types.ProjectUpdateInput
  Query: ResolverTypeWrapper<{}>
  RoleCode: types.RoleCode
  RoleCodeFilterInput: types.RoleCodeFilterInput
  SortDirection: types.SortDirection
  String: ResolverTypeWrapper<types.Scalars['String']>
  StringFilterInput: types.StringFilterInput
  StringFilterMode: types.StringFilterMode
  Subscription: ResolverTypeWrapper<{}>
  SubscriptionInsertInput: types.SubscriptionInsertInput
  SubscriptionSortInput: types.SubscriptionSortInput
  SubscriptionUpdateInput: types.SubscriptionUpdateInput
  UpdateEBoardInput: types.UpdateEBoardInput
  UpdateEBoardTermInput: types.UpdateEBoardTermInput
  UpdateProjectInput: types.UpdateProjectInput
  UpdateProjectMemberInput: types.UpdateProjectMemberInput
  UpdateUserInput: types.UpdateUserInput
  UpdateUserSocialInput: types.UpdateUserSocialInput
  Upload: ResolverTypeWrapper<types.Scalars['Upload']>
  UploadFilterInput: types.UploadFilterInput
  UploadOperation: types.UploadOperation
  UploadOperationFilterInput: types.UploadOperationFilterInput
  UploadOrSource: types.UploadOrSource
  UploadWithOperation: types.UploadWithOperation
  User: ResolverTypeWrapper<types.User>
  UserFilterInput: types.UserFilterInput
  UserFindInput: types.UserFindInput
  UserInsertInput: types.UserInsertInput
  UserLoginIdentity: ResolverTypeWrapper<types.UserLoginIdentity>
  UserLoginIdentityFilterInput: types.UserLoginIdentityFilterInput
  UserLoginIdentityFindInput: types.UserLoginIdentityFindInput
  UserLoginIdentityInsertInput: types.UserLoginIdentityInsertInput
  UserLoginIdentityRelationsFilterInput: types.UserLoginIdentityRelationsFilterInput
  UserLoginIdentitySortInput: types.UserLoginIdentitySortInput
  UserLoginIdentityUpdateInput: types.UserLoginIdentityUpdateInput
  UserRelationsFilterInput: types.UserRelationsFilterInput
  UserRole: ResolverTypeWrapper<types.UserRole>
  UserRoleFilterInput: types.UserRoleFilterInput
  UserRoleFindInput: types.UserRoleFindInput
  UserRoleInsertInput: types.UserRoleInsertInput
  UserRoleRelationsFilterInput: types.UserRoleRelationsFilterInput
  UserRoleSortInput: types.UserRoleSortInput
  UserRoleUpdateInput: types.UserRoleUpdateInput
  UserSocial: ResolverTypeWrapper<types.UserSocial>
  UserSocialFilterInput: types.UserSocialFilterInput
  UserSocialFindInput: types.UserSocialFindInput
  UserSocialInsertInput: types.UserSocialInsertInput
  UserSocialRelationsFilterInput: types.UserSocialRelationsFilterInput
  UserSocialSortInput: types.UserSocialSortInput
  UserSocialUpdateInput: types.UserSocialUpdateInput
  UserSortInput: types.UserSortInput
  UserSubscriptionFilter: types.UserSubscriptionFilter
  UserUpdateInput: types.UserUpdateInput
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AccessFilterInput: types.AccessFilterInput
  Boolean: types.Scalars['Boolean']
  BooleanFilterInput: types.BooleanFilterInput
  Date: types.Scalars['Date']
  DateFilterInput: types.DateFilterInput
  EBoard: types.EBoard
  EBoardFilterInput: types.EBoardFilterInput
  EBoardFindInput: types.EBoardFindInput
  EBoardInsertInput: types.EBoardInsertInput
  EBoardRelationsFilterInput: types.EBoardRelationsFilterInput
  EBoardSortInput: types.EBoardSortInput
  EBoardSubscriptionFilter: types.EBoardSubscriptionFilter
  EBoardTerm: types.EBoardTerm
  EBoardTermFilterInput: types.EBoardTermFilterInput
  EBoardTermFindInput: types.EBoardTermFindInput
  EBoardTermInsertInput: types.EBoardTermInsertInput
  EBoardTermRelationsFilterInput: types.EBoardTermRelationsFilterInput
  EBoardTermRole: types.EBoardTermRole
  EBoardTermRoleFilterInput: types.EBoardTermRoleFilterInput
  EBoardTermRoleFindInput: types.EBoardTermRoleFindInput
  EBoardTermRoleInsertInput: types.EBoardTermRoleInsertInput
  EBoardTermRoleRelationsFilterInput: types.EBoardTermRoleRelationsFilterInput
  EBoardTermRoleSortInput: types.EBoardTermRoleSortInput
  EBoardTermRoleUpdateInput: types.EBoardTermRoleUpdateInput
  EBoardTermSortInput: types.EBoardTermSortInput
  EBoardTermSubscriptionFilter: types.EBoardTermSubscriptionFilter
  EBoardTermUpdateInput: types.EBoardTermUpdateInput
  EBoardUpdateInput: types.EBoardUpdateInput
  Float: types.Scalars['Float']
  FloatFilterInput: types.FloatFilterInput
  ID: types.Scalars['ID']
  IDFilterInput: types.IdFilterInput
  Int: types.Scalars['Int']
  IntFilterInput: types.IntFilterInput
  InviteTypeFilterInput: types.InviteTypeFilterInput
  Json: types.Scalars['Json']
  JsonFilterInput: types.JsonFilterInput
  Mutation: {}
  NewEBoardInput: types.NewEBoardInput
  NewEBoardTermInput: types.NewEBoardTermInput
  NewProjectInput: types.NewProjectInput
  NewProjectInviteInput: types.NewProjectInviteInput
  NewProjectMemberRoleInput: types.NewProjectMemberRoleInput
  NewUserRoleInput: types.NewUserRoleInput
  PermissionFilterInput: types.PermissionFilterInput
  Project: types.Project
  ProjectFilterInput: types.ProjectFilterInput
  ProjectFindInput: types.ProjectFindInput
  ProjectInsertInput: types.ProjectInsertInput
  ProjectInvite: types.ProjectInvite
  ProjectInviteFilterInput: types.ProjectInviteFilterInput
  ProjectInviteFindInput: types.ProjectInviteFindInput
  ProjectInviteInsertInput: types.ProjectInviteInsertInput
  ProjectInviteRelationsFilterInput: types.ProjectInviteRelationsFilterInput
  ProjectInviteSortInput: types.ProjectInviteSortInput
  ProjectInviteSubscriptionFilter: types.ProjectInviteSubscriptionFilter
  ProjectInviteUpdateInput: types.ProjectInviteUpdateInput
  ProjectMember: types.ProjectMember
  ProjectMemberFilterInput: types.ProjectMemberFilterInput
  ProjectMemberFindInput: types.ProjectMemberFindInput
  ProjectMemberInsertInput: types.ProjectMemberInsertInput
  ProjectMemberRelationsFilterInput: types.ProjectMemberRelationsFilterInput
  ProjectMemberRole: types.ProjectMemberRole
  ProjectMemberRoleFilterInput: types.ProjectMemberRoleFilterInput
  ProjectMemberRoleFindInput: types.ProjectMemberRoleFindInput
  ProjectMemberRoleInsertInput: types.ProjectMemberRoleInsertInput
  ProjectMemberRoleRelationsFilterInput: types.ProjectMemberRoleRelationsFilterInput
  ProjectMemberRoleSortInput: types.ProjectMemberRoleSortInput
  ProjectMemberRoleUpdateInput: types.ProjectMemberRoleUpdateInput
  ProjectMemberSortInput: types.ProjectMemberSortInput
  ProjectMemberSubscriptionFilter: types.ProjectMemberSubscriptionFilter
  ProjectMemberUpdateInput: types.ProjectMemberUpdateInput
  ProjectRelationsFilterInput: types.ProjectRelationsFilterInput
  ProjectSortInput: types.ProjectSortInput
  ProjectSubscriptionFilter: types.ProjectSubscriptionFilter
  ProjectUpdateInput: types.ProjectUpdateInput
  Query: {}
  RoleCodeFilterInput: types.RoleCodeFilterInput
  String: types.Scalars['String']
  StringFilterInput: types.StringFilterInput
  Subscription: {}
  SubscriptionInsertInput: types.SubscriptionInsertInput
  SubscriptionSortInput: types.SubscriptionSortInput
  SubscriptionUpdateInput: types.SubscriptionUpdateInput
  UpdateEBoardInput: types.UpdateEBoardInput
  UpdateEBoardTermInput: types.UpdateEBoardTermInput
  UpdateProjectInput: types.UpdateProjectInput
  UpdateProjectMemberInput: types.UpdateProjectMemberInput
  UpdateUserInput: types.UpdateUserInput
  UpdateUserSocialInput: types.UpdateUserSocialInput
  Upload: types.Scalars['Upload']
  UploadFilterInput: types.UploadFilterInput
  UploadOperationFilterInput: types.UploadOperationFilterInput
  UploadOrSource: types.UploadOrSource
  UploadWithOperation: types.UploadWithOperation
  User: types.User
  UserFilterInput: types.UserFilterInput
  UserFindInput: types.UserFindInput
  UserInsertInput: types.UserInsertInput
  UserLoginIdentity: types.UserLoginIdentity
  UserLoginIdentityFilterInput: types.UserLoginIdentityFilterInput
  UserLoginIdentityFindInput: types.UserLoginIdentityFindInput
  UserLoginIdentityInsertInput: types.UserLoginIdentityInsertInput
  UserLoginIdentityRelationsFilterInput: types.UserLoginIdentityRelationsFilterInput
  UserLoginIdentitySortInput: types.UserLoginIdentitySortInput
  UserLoginIdentityUpdateInput: types.UserLoginIdentityUpdateInput
  UserRelationsFilterInput: types.UserRelationsFilterInput
  UserRole: types.UserRole
  UserRoleFilterInput: types.UserRoleFilterInput
  UserRoleFindInput: types.UserRoleFindInput
  UserRoleInsertInput: types.UserRoleInsertInput
  UserRoleRelationsFilterInput: types.UserRoleRelationsFilterInput
  UserRoleSortInput: types.UserRoleSortInput
  UserRoleUpdateInput: types.UserRoleUpdateInput
  UserSocial: types.UserSocial
  UserSocialFilterInput: types.UserSocialFilterInput
  UserSocialFindInput: types.UserSocialFindInput
  UserSocialInsertInput: types.UserSocialInsertInput
  UserSocialRelationsFilterInput: types.UserSocialRelationsFilterInput
  UserSocialSortInput: types.UserSocialSortInput
  UserSocialUpdateInput: types.UserSocialUpdateInput
  UserSortInput: types.UserSortInput
  UserSubscriptionFilter: types.UserSubscriptionFilter
  UserUpdateInput: types.UserUpdateInput
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export type EBoardResolvers<ContextType = any, ParentType extends ResolversParentTypes['EBoard'] = ResolversParentTypes['EBoard']> = {
  avatarLink?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  bio?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  createdAt?: Resolver<types.Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  terms?: Resolver<Array<ResolversTypes['EBoardTerm']>, ParentType, ContextType>
  updatedAt?: Resolver<types.Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type EBoardTermResolvers<ContextType = any, ParentType extends ResolversParentTypes['EBoardTerm'] = ResolversParentTypes['EBoardTerm']> = {
  eBoard?: Resolver<ResolversTypes['EBoard'], ParentType, ContextType>
  eBoardId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  roles?: Resolver<Array<ResolversTypes['EBoardTermRole']>, ParentType, ContextType>
  year?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type EBoardTermRoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['EBoardTermRole'] = ResolversParentTypes['EBoardTermRole']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  roleCode?: Resolver<ResolversTypes['RoleCode'], ParentType, ContextType>
  term?: Resolver<ResolversTypes['EBoardTerm'], ParentType, ContextType>
  termId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Json'], any> {
  name: 'Json'
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  acceptProjectInvite?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationAcceptProjectInviteArgs, 'inviteId'>>
  createEBoard?: Resolver<ResolversTypes['EBoard'], ParentType, ContextType, RequireFields<types.MutationCreateEBoardArgs, 'record'>>
  createEBoardTerm?: Resolver<ResolversTypes['EBoardTerm'], ParentType, ContextType, RequireFields<types.MutationCreateEBoardTermArgs, 'record'>>
  createEBoardTermRole?: Resolver<ResolversTypes['EBoardTermRole'], ParentType, ContextType, RequireFields<types.MutationCreateEBoardTermRoleArgs, 'record'>>
  createProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<types.MutationCreateProjectArgs, 'record'>>
  createProjectInvite?: Resolver<ResolversTypes['ProjectInvite'], ParentType, ContextType, RequireFields<types.MutationCreateProjectInviteArgs, 'record'>>
  createProjectMember?: Resolver<ResolversTypes['ProjectMember'], ParentType, ContextType, RequireFields<types.MutationCreateProjectMemberArgs, 'record'>>
  createProjectMemberRole?: Resolver<ResolversTypes['ProjectMemberRole'], ParentType, ContextType, RequireFields<types.MutationCreateProjectMemberRoleArgs, 'record'>>
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<types.MutationCreateUserArgs, 'record'>>
  createUserLoginIdentity?: Resolver<ResolversTypes['UserLoginIdentity'], ParentType, ContextType, RequireFields<types.MutationCreateUserLoginIdentityArgs, 'record'>>
  createUserRole?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType, RequireFields<types.MutationCreateUserRoleArgs, 'record'>>
  createUserSocial?: Resolver<ResolversTypes['UserSocial'], ParentType, ContextType, RequireFields<types.MutationCreateUserSocialArgs, 'record'>>
  deleteEBoard?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteEBoardArgs, 'id'>>
  deleteEBoardTerm?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteEBoardTermArgs, 'id'>>
  deleteEBoardTermRoles?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteEBoardTermRolesArgs, 'filter'>>
  deleteEBoardTerms?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteEBoardTermsArgs, 'filter'>>
  deleteEBoards?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteEBoardsArgs, 'filter'>>
  deleteProject?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteProjectArgs, 'id'>>
  deleteProjectInvite?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteProjectInviteArgs, 'inviteId'>>
  deleteProjectInvites?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteProjectInvitesArgs, 'filter'>>
  deleteProjectMember?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteProjectMemberArgs, 'id'>>
  deleteProjectMemberRoles?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteProjectMemberRolesArgs, 'filter'>>
  deleteProjectMembers?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteProjectMembersArgs, 'filter'>>
  deleteProjects?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteProjectsArgs, 'filter'>>
  deleteUser?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteUserArgs, 'id'>>
  deleteUserLoginIdentitys?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteUserLoginIdentitysArgs, 'filter'>>
  deleteUserRoles?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteUserRolesArgs, 'filter'>>
  deleteUserSocials?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteUserSocialsArgs, 'filter'>>
  deleteUsers?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteUsersArgs, 'filter'>>
  joinOpenProject?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationJoinOpenProjectArgs, 'projectId'>>
  newEBoard?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<types.MutationNewEBoardArgs, 'input'>>
  newEBoardTerm?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<types.MutationNewEBoardTermArgs, 'input'>>
  newProject?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<types.MutationNewProjectArgs, 'input'>>
  newProjectInvite?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<types.MutationNewProjectInviteArgs, 'input'>>
  transferProjectOwnership?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationTransferProjectOwnershipArgs, 'memberId' | 'projectId'>>
  updateEBoard?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateEBoardArgs, 'input'>>
  updateEBoardTerm?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateEBoardTermArgs, 'input'>>
  updateEBoardTermRoles?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateEBoardTermRolesArgs, 'changes' | 'filter'>>
  updateEBoardTerms?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateEBoardTermsArgs, 'changes' | 'filter'>>
  updateEBoards?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateEBoardsArgs, 'changes' | 'filter'>>
  updateProject?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateProjectArgs, 'input'>>
  updateProjectInvites?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateProjectInvitesArgs, 'changes' | 'filter'>>
  updateProjectMember?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateProjectMemberArgs, 'input'>>
  updateProjectMemberRoles?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateProjectMemberRolesArgs, 'changes' | 'filter'>>
  updateProjectMembers?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateProjectMembersArgs, 'changes' | 'filter'>>
  updateProjects?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateProjectsArgs, 'changes' | 'filter'>>
  updateUser?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateUserArgs, 'input'>>
  updateUserLoginIdentitys?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateUserLoginIdentitysArgs, 'changes' | 'filter'>>
  updateUserRoles?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateUserRolesArgs, 'changes' | 'filter'>>
  updateUserSocials?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateUserSocialsArgs, 'changes' | 'filter'>>
  updateUsers?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateUsersArgs, 'changes' | 'filter'>>
}

export type ProjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  access?: Resolver<ResolversTypes['Access'], ParentType, ContextType>
  bannerLink?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  cardImageLink?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  completedAt?: Resolver<types.Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  createdAt?: Resolver<types.Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  description?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  downloadLinks?: Resolver<types.Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>
  galleryImageLinks?: Resolver<types.Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  invites?: Resolver<Array<ResolversTypes['ProjectInvite']>, ParentType, ContextType>
  members?: Resolver<Array<ResolversTypes['ProjectMember']>, ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  pitch?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  soundcloudEmbedSrc?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  tags?: Resolver<types.Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>
  updatedAt?: Resolver<types.Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProjectInviteResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectInvite'] = ResolversParentTypes['ProjectInvite']> = {
  createdAt?: Resolver<types.Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['InviteType'], ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProjectMemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectMember'] = ResolversParentTypes['ProjectMember']> = {
  contributions?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  createdAt?: Resolver<types.Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  roles?: Resolver<Array<ResolversTypes['ProjectMemberRole']>, ParentType, ContextType>
  updatedAt?: Resolver<types.Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProjectMemberRoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectMemberRole'] = ResolversParentTypes['ProjectMemberRole']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  projectMember?: Resolver<ResolversTypes['ProjectMember'], ParentType, ContextType>
  projectMemberId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  roleCode?: Resolver<ResolversTypes['RoleCode'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  eBoardTermRoles?: Resolver<Array<ResolversTypes['EBoardTermRole']>, ParentType, ContextType, Partial<types.QueryEBoardTermRolesArgs>>
  eBoardTerms?: Resolver<Array<ResolversTypes['EBoardTerm']>, ParentType, ContextType, Partial<types.QueryEBoardTermsArgs>>
  eBoards?: Resolver<Array<ResolversTypes['EBoard']>, ParentType, ContextType, Partial<types.QueryEBoardsArgs>>
  isAuthTokenValid?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  projectInvites?: Resolver<Array<ResolversTypes['ProjectInvite']>, ParentType, ContextType, Partial<types.QueryProjectInvitesArgs>>
  projectMemberRoles?: Resolver<Array<ResolversTypes['ProjectMemberRole']>, ParentType, ContextType, Partial<types.QueryProjectMemberRolesArgs>>
  projectMembers?: Resolver<Array<ResolversTypes['ProjectMember']>, ParentType, ContextType, Partial<types.QueryProjectMembersArgs>>
  projects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType, Partial<types.QueryProjectsArgs>>
  securityContext?: Resolver<types.Maybe<ResolversTypes['Json']>, ParentType, ContextType, Partial<types.QuerySecurityContextArgs>>
  securityPolicy?: Resolver<types.Maybe<ResolversTypes['Json']>, ParentType, ContextType>
  userLoginIdentitys?: Resolver<Array<ResolversTypes['UserLoginIdentity']>, ParentType, ContextType, Partial<types.QueryUserLoginIdentitysArgs>>
  userRoles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType, Partial<types.QueryUserRolesArgs>>
  userSocials?: Resolver<Array<ResolversTypes['UserSocial']>, ParentType, ContextType, Partial<types.QueryUserSocialsArgs>>
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<types.QueryUsersArgs>>
}

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  eBoardCreated?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'eBoardCreated', ParentType, ContextType, RequireFields<types.SubscriptionEBoardCreatedArgs, 'filter'>>
  eBoardDeleted?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'eBoardDeleted', ParentType, ContextType, RequireFields<types.SubscriptionEBoardDeletedArgs, 'filter'>>
  eBoardTermCreated?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'eBoardTermCreated', ParentType, ContextType, RequireFields<types.SubscriptionEBoardTermCreatedArgs, 'filter'>>
  eBoardTermDeleted?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'eBoardTermDeleted', ParentType, ContextType, RequireFields<types.SubscriptionEBoardTermDeletedArgs, 'filter'>>
  eBoardTermUpdated?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'eBoardTermUpdated', ParentType, ContextType, RequireFields<types.SubscriptionEBoardTermUpdatedArgs, 'filter'>>
  eBoardUpdated?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'eBoardUpdated', ParentType, ContextType, RequireFields<types.SubscriptionEBoardUpdatedArgs, 'filter'>>
  projectCreated?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'projectCreated', ParentType, ContextType, RequireFields<types.SubscriptionProjectCreatedArgs, 'filter'>>
  projectDeleted?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'projectDeleted', ParentType, ContextType, RequireFields<types.SubscriptionProjectDeletedArgs, 'filter'>>
  projectInviteCreated?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'projectInviteCreated', ParentType, ContextType, RequireFields<types.SubscriptionProjectInviteCreatedArgs, 'filter'>>
  projectInviteDeleted?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'projectInviteDeleted', ParentType, ContextType, RequireFields<types.SubscriptionProjectInviteDeletedArgs, 'filter'>>
  projectMemberCreated?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'projectMemberCreated', ParentType, ContextType, RequireFields<types.SubscriptionProjectMemberCreatedArgs, 'filter'>>
  projectMemberDeleted?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'projectMemberDeleted', ParentType, ContextType, RequireFields<types.SubscriptionProjectMemberDeletedArgs, 'filter'>>
  projectMemberUpdated?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'projectMemberUpdated', ParentType, ContextType, RequireFields<types.SubscriptionProjectMemberUpdatedArgs, 'filter'>>
  projectUpdated?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'projectUpdated', ParentType, ContextType, RequireFields<types.SubscriptionProjectUpdatedArgs, 'filter'>>
  userCreated?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'userCreated', ParentType, ContextType, RequireFields<types.SubscriptionUserCreatedArgs, 'filter'>>
  userDeleted?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'userDeleted', ParentType, ContextType, RequireFields<types.SubscriptionUserDeletedArgs, 'filter'>>
  userUpdated?: SubscriptionResolver<types.Maybe<ResolversTypes['ID']>, 'userUpdated', ParentType, ContextType, RequireFields<types.SubscriptionUserUpdatedArgs, 'filter'>>
}

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload'
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatarLink?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  bannerLink?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  bio?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  classYear?: Resolver<types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  createdAt?: Resolver<types.Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  displayName?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  eBoard?: Resolver<types.Maybe<ResolversTypes['EBoard']>, ParentType, ContextType>
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  loginIdentities?: Resolver<Array<ResolversTypes['UserLoginIdentity']>, ParentType, ContextType>
  projectInvites?: Resolver<Array<ResolversTypes['ProjectInvite']>, ParentType, ContextType>
  projectMembers?: Resolver<Array<ResolversTypes['ProjectMember']>, ParentType, ContextType>
  roles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType>
  socials?: Resolver<Array<ResolversTypes['UserSocial']>, ParentType, ContextType>
  updatedAt?: Resolver<types.Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  username?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserLoginIdentityResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLoginIdentity'] = ResolversParentTypes['UserLoginIdentity']> = {
  data?: Resolver<types.Maybe<ResolversTypes['Json']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  identityId?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserRoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserRole'] = ResolversParentTypes['UserRole']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  roleCode?: Resolver<ResolversTypes['RoleCode'], ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserSocialResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSocial'] = ResolversParentTypes['UserSocial']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  link?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  platform?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType
  EBoard?: EBoardResolvers<ContextType>
  EBoardTerm?: EBoardTermResolvers<ContextType>
  EBoardTermRole?: EBoardTermRoleResolvers<ContextType>
  Json?: GraphQLScalarType
  Mutation?: MutationResolvers<ContextType>
  Project?: ProjectResolvers<ContextType>
  ProjectInvite?: ProjectInviteResolvers<ContextType>
  ProjectMember?: ProjectMemberResolvers<ContextType>
  ProjectMemberRole?: ProjectMemberRoleResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Subscription?: SubscriptionResolvers<ContextType>
  Upload?: GraphQLScalarType
  User?: UserResolvers<ContextType>
  UserLoginIdentity?: UserLoginIdentityResolvers<ContextType>
  UserRole?: UserRoleResolvers<ContextType>
  UserSocial?: UserSocialResolvers<ContextType>
}
