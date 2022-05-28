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
  Boolean: ResolverTypeWrapper<types.Scalars['Boolean']>
  BooleanFilterInput: types.BooleanFilterInput
  Date: ResolverTypeWrapper<types.Scalars['Date']>
  DateFilterInput: types.DateFilterInput
  Float: ResolverTypeWrapper<types.Scalars['Float']>
  FloatFilterInput: types.FloatFilterInput
  ID: ResolverTypeWrapper<types.Scalars['ID']>
  IDFilterInput: types.IdFilterInput
  Int: ResolverTypeWrapper<types.Scalars['Int']>
  IntFilterInput: types.IntFilterInput
  Json: ResolverTypeWrapper<types.Scalars['Json']>
  JsonFilterInput: types.JsonFilterInput
  Mutation: ResolverTypeWrapper<{}>
  Permission: types.Permission
  PermissionFilterInput: types.PermissionFilterInput
  Project: ResolverTypeWrapper<types.Project>
  ProjectFilterInput: types.ProjectFilterInput
  ProjectFindInput: types.ProjectFindInput
  ProjectInsertInput: types.ProjectInsertInput
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
  ProjectMemberUpdateInput: types.ProjectMemberUpdateInput
  ProjectRelationsFilterInput: types.ProjectRelationsFilterInput
  ProjectSortInput: types.ProjectSortInput
  ProjectUpdateInput: types.ProjectUpdateInput
  Query: ResolverTypeWrapper<{}>
  Role: ResolverTypeWrapper<types.Role>
  RoleCode: types.RoleCode
  RoleCodeFilterInput: types.RoleCodeFilterInput
  RoleFilterInput: types.RoleFilterInput
  RoleFindInput: types.RoleFindInput
  RoleInsertInput: types.RoleInsertInput
  RoleSortInput: types.RoleSortInput
  RoleUpdateInput: types.RoleUpdateInput
  SortDirection: types.SortDirection
  String: ResolverTypeWrapper<types.Scalars['String']>
  StringFilterInput: types.StringFilterInput
  StringFilterMode: types.StringFilterMode
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
  UserUpdateInput: types.UserUpdateInput
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: types.Scalars['Boolean']
  BooleanFilterInput: types.BooleanFilterInput
  Date: types.Scalars['Date']
  DateFilterInput: types.DateFilterInput
  Float: types.Scalars['Float']
  FloatFilterInput: types.FloatFilterInput
  ID: types.Scalars['ID']
  IDFilterInput: types.IdFilterInput
  Int: types.Scalars['Int']
  IntFilterInput: types.IntFilterInput
  Json: types.Scalars['Json']
  JsonFilterInput: types.JsonFilterInput
  Mutation: {}
  PermissionFilterInput: types.PermissionFilterInput
  Project: types.Project
  ProjectFilterInput: types.ProjectFilterInput
  ProjectFindInput: types.ProjectFindInput
  ProjectInsertInput: types.ProjectInsertInput
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
  ProjectMemberUpdateInput: types.ProjectMemberUpdateInput
  ProjectRelationsFilterInput: types.ProjectRelationsFilterInput
  ProjectSortInput: types.ProjectSortInput
  ProjectUpdateInput: types.ProjectUpdateInput
  Query: {}
  Role: types.Role
  RoleCodeFilterInput: types.RoleCodeFilterInput
  RoleFilterInput: types.RoleFilterInput
  RoleFindInput: types.RoleFindInput
  RoleInsertInput: types.RoleInsertInput
  RoleSortInput: types.RoleSortInput
  RoleUpdateInput: types.RoleUpdateInput
  String: types.Scalars['String']
  StringFilterInput: types.StringFilterInput
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
  UserUpdateInput: types.UserUpdateInput
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Json'], any> {
  name: 'Json'
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<types.MutationCreateProjectArgs, 'record'>>
  createProjectMember?: Resolver<ResolversTypes['ProjectMember'], ParentType, ContextType, RequireFields<types.MutationCreateProjectMemberArgs, 'record'>>
  createProjectMemberRole?: Resolver<ResolversTypes['ProjectMemberRole'], ParentType, ContextType, RequireFields<types.MutationCreateProjectMemberRoleArgs, 'record'>>
  createRole?: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<types.MutationCreateRoleArgs, 'record'>>
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<types.MutationCreateUserArgs, 'record'>>
  createUserLoginIdentity?: Resolver<ResolversTypes['UserLoginIdentity'], ParentType, ContextType, RequireFields<types.MutationCreateUserLoginIdentityArgs, 'record'>>
  createUserRole?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType, RequireFields<types.MutationCreateUserRoleArgs, 'record'>>
  createUserSocial?: Resolver<ResolversTypes['UserSocial'], ParentType, ContextType, RequireFields<types.MutationCreateUserSocialArgs, 'record'>>
  deleteProjectMemberRoles?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteProjectMemberRolesArgs, 'filter'>>
  deleteProjectMembers?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteProjectMembersArgs, 'filter'>>
  deleteProjects?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteProjectsArgs, 'filter'>>
  deleteRoles?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteRolesArgs, 'filter'>>
  deleteUserLoginIdentitys?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteUserLoginIdentitysArgs, 'filter'>>
  deleteUserRoles?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteUserRolesArgs, 'filter'>>
  deleteUserSocials?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteUserSocialsArgs, 'filter'>>
  deleteUsers?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationDeleteUsersArgs, 'filter'>>
  updateProjectMemberRoles?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateProjectMemberRolesArgs, 'changes' | 'filter'>>
  updateProjectMembers?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateProjectMembersArgs, 'changes' | 'filter'>>
  updateProjects?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateProjectsArgs, 'changes' | 'filter'>>
  updateRoles?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateRolesArgs, 'changes' | 'filter'>>
  updateUserLoginIdentitys?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateUserLoginIdentitysArgs, 'changes' | 'filter'>>
  updateUserRoles?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateUserRolesArgs, 'changes' | 'filter'>>
  updateUserSocials?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateUserSocialsArgs, 'changes' | 'filter'>>
  updateUsers?: Resolver<types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<types.MutationUpdateUsersArgs, 'changes' | 'filter'>>
}

export type ProjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  bannerLink?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  cardImageLink?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  completedAt?: Resolver<types.Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  downloadLinks?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  galleryImageLinks?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  members?: Resolver<types.Maybe<Array<ResolversTypes['ProjectMember']>>, ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  soundcloudEmbedSrc?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProjectMemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectMember'] = ResolversParentTypes['ProjectMember']> = {
  contributions?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  roles?: Resolver<Array<ResolversTypes['ProjectMemberRole']>, ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ProjectMemberRoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectMemberRole'] = ResolversParentTypes['ProjectMemberRole']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  projectMember?: Resolver<ResolversTypes['ProjectMember'], ParentType, ContextType>
  projectMemberId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>
  roleCode?: Resolver<ResolversTypes['RoleCode'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  projectMemberRoles?: Resolver<Array<ResolversTypes['ProjectMemberRole']>, ParentType, ContextType, Partial<types.QueryProjectMemberRolesArgs>>
  projectMembers?: Resolver<Array<ResolversTypes['ProjectMember']>, ParentType, ContextType, Partial<types.QueryProjectMembersArgs>>
  projects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType, Partial<types.QueryProjectsArgs>>
  roles?: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType, Partial<types.QueryRolesArgs>>
  userLoginIdentitys?: Resolver<Array<ResolversTypes['UserLoginIdentity']>, ParentType, ContextType, Partial<types.QueryUserLoginIdentitysArgs>>
  userRoles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType, Partial<types.QueryUserRolesArgs>>
  userSocials?: Resolver<Array<ResolversTypes['UserSocial']>, ParentType, ContextType, Partial<types.QueryUserSocialsArgs>>
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<types.QueryUsersArgs>>
}

export type RoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Role'] = ResolversParentTypes['Role']> = {
  code?: Resolver<ResolversTypes['RoleCode'], ParentType, ContextType>
  permissions?: Resolver<Array<types.Maybe<ResolversTypes['Permission']>>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatarLink?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  bannerLink?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  bio?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  displayName?: Resolver<types.Maybe<ResolversTypes['String']>, ParentType, ContextType>
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  loginIdentities?: Resolver<Array<ResolversTypes['UserLoginIdentity']>, ParentType, ContextType>
  projectMembers?: Resolver<Array<ResolversTypes['ProjectMember']>, ParentType, ContextType>
  roles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType>
  socials?: Resolver<Array<ResolversTypes['UserSocial']>, ParentType, ContextType>
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
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>
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
  Json?: GraphQLScalarType
  Mutation?: MutationResolvers<ContextType>
  Project?: ProjectResolvers<ContextType>
  ProjectMember?: ProjectMemberResolvers<ContextType>
  ProjectMemberRole?: ProjectMemberRoleResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Role?: RoleResolvers<ContextType>
  User?: UserResolvers<ContextType>
  UserLoginIdentity?: UserLoginIdentityResolvers<ContextType>
  UserRole?: UserRoleResolvers<ContextType>
  UserSocial?: UserSocialResolvers<ContextType>
}
