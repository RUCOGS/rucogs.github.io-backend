export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: any
  Json: any
}

export type BooleanFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']>
  exists?: InputMaybe<Scalars['Boolean']>
  in?: InputMaybe<Array<Scalars['Boolean']>>
  ne?: InputMaybe<Scalars['Boolean']>
  nin?: InputMaybe<Array<Scalars['Boolean']>>
}

export type DateFilterInput = {
  eq?: InputMaybe<Scalars['Date']>
  exists?: InputMaybe<Scalars['Boolean']>
  in?: InputMaybe<Array<Scalars['Date']>>
  ne?: InputMaybe<Scalars['Date']>
  nin?: InputMaybe<Array<Scalars['Date']>>
}

export type FloatFilterInput = {
  eq?: InputMaybe<Scalars['Float']>
  exists?: InputMaybe<Scalars['Boolean']>
  gt?: InputMaybe<Scalars['Float']>
  gte?: InputMaybe<Scalars['Float']>
  in?: InputMaybe<Array<Scalars['Float']>>
  lt?: InputMaybe<Scalars['Float']>
  lte?: InputMaybe<Scalars['Float']>
  ne?: InputMaybe<Scalars['Float']>
  nin?: InputMaybe<Array<Scalars['Float']>>
}

export type IdFilterInput = {
  eq?: InputMaybe<Scalars['ID']>
  exists?: InputMaybe<Scalars['ID']>
  in?: InputMaybe<Array<Scalars['ID']>>
  ne?: InputMaybe<Scalars['ID']>
  nin?: InputMaybe<Array<Scalars['ID']>>
}

export type IntFilterInput = {
  eq?: InputMaybe<Scalars['Int']>
  exists?: InputMaybe<Scalars['Boolean']>
  gt?: InputMaybe<Scalars['Int']>
  gte?: InputMaybe<Scalars['Int']>
  in?: InputMaybe<Array<Scalars['Int']>>
  lt?: InputMaybe<Scalars['Int']>
  lte?: InputMaybe<Scalars['Int']>
  ne?: InputMaybe<Scalars['Int']>
  nin?: InputMaybe<Array<Scalars['Int']>>
}

export type JsonFilterInput = {
  eq?: InputMaybe<Scalars['Json']>
  exists?: InputMaybe<Scalars['Boolean']>
  in?: InputMaybe<Array<Scalars['Json']>>
  ne?: InputMaybe<Scalars['Json']>
  nin?: InputMaybe<Array<Scalars['Json']>>
}

export type Mutation = {
  __typename?: 'Mutation'
  createProject: Project
  createProjectMember: ProjectMember
  createProjectMemberRole: ProjectMemberRole
  createRole: Role
  createUser: User
  createUserLoginIdentity: UserLoginIdentity
  createUserRole: UserRole
  createUserSocial: UserSocial
  deleteProjectMemberRoles?: Maybe<Scalars['Boolean']>
  deleteProjectMembers?: Maybe<Scalars['Boolean']>
  deleteProjects?: Maybe<Scalars['Boolean']>
  deleteRoles?: Maybe<Scalars['Boolean']>
  deleteUserLoginIdentitys?: Maybe<Scalars['Boolean']>
  deleteUserRoles?: Maybe<Scalars['Boolean']>
  deleteUserSocials?: Maybe<Scalars['Boolean']>
  deleteUsers?: Maybe<Scalars['Boolean']>
  updateProjectMemberRoles?: Maybe<Scalars['Boolean']>
  updateProjectMembers?: Maybe<Scalars['Boolean']>
  updateProjects?: Maybe<Scalars['Boolean']>
  updateRoles?: Maybe<Scalars['Boolean']>
  updateUserLoginIdentitys?: Maybe<Scalars['Boolean']>
  updateUserRoles?: Maybe<Scalars['Boolean']>
  updateUserSocials?: Maybe<Scalars['Boolean']>
  updateUsers?: Maybe<Scalars['Boolean']>
}

export type MutationCreateProjectArgs = {
  record: ProjectInsertInput
}

export type MutationCreateProjectMemberArgs = {
  record: ProjectMemberInsertInput
}

export type MutationCreateProjectMemberRoleArgs = {
  record: ProjectMemberRoleInsertInput
}

export type MutationCreateRoleArgs = {
  record: RoleInsertInput
}

export type MutationCreateUserArgs = {
  record: UserInsertInput
}

export type MutationCreateUserLoginIdentityArgs = {
  record: UserLoginIdentityInsertInput
}

export type MutationCreateUserRoleArgs = {
  record: UserRoleInsertInput
}

export type MutationCreateUserSocialArgs = {
  record: UserSocialInsertInput
}

export type MutationDeleteProjectMemberRolesArgs = {
  filter: ProjectMemberRoleFilterInput
}

export type MutationDeleteProjectMembersArgs = {
  filter: ProjectMemberFilterInput
}

export type MutationDeleteProjectsArgs = {
  filter: ProjectFilterInput
}

export type MutationDeleteRolesArgs = {
  filter: RoleFilterInput
}

export type MutationDeleteUserLoginIdentitysArgs = {
  filter: UserLoginIdentityFilterInput
}

export type MutationDeleteUserRolesArgs = {
  filter: UserRoleFilterInput
}

export type MutationDeleteUserSocialsArgs = {
  filter: UserSocialFilterInput
}

export type MutationDeleteUsersArgs = {
  filter: UserFilterInput
}

export type MutationUpdateProjectMemberRolesArgs = {
  changes: ProjectMemberRoleUpdateInput
  filter: ProjectMemberRoleFilterInput
}

export type MutationUpdateProjectMembersArgs = {
  changes: ProjectMemberUpdateInput
  filter: ProjectMemberFilterInput
}

export type MutationUpdateProjectsArgs = {
  changes: ProjectUpdateInput
  filter: ProjectFilterInput
}

export type MutationUpdateRolesArgs = {
  changes: RoleUpdateInput
  filter: RoleFilterInput
}

export type MutationUpdateUserLoginIdentitysArgs = {
  changes: UserLoginIdentityUpdateInput
  filter: UserLoginIdentityFilterInput
}

export type MutationUpdateUserRolesArgs = {
  changes: UserRoleUpdateInput
  filter: UserRoleFilterInput
}

export type MutationUpdateUserSocialsArgs = {
  changes: UserSocialUpdateInput
  filter: UserSocialFilterInput
}

export type MutationUpdateUsersArgs = {
  changes: UserUpdateInput
  filter: UserFilterInput
}

export const Permission = {
  CreateProject: 'CREATE_PROJECT',
  DeleteProfile: 'DELETE_PROFILE',
  DeleteProject: 'DELETE_PROJECT',
  ManageProjectMemberRoles: 'MANAGE_PROJECT_MEMBER_ROLES',
  ManageUserRoles: 'MANAGE_USER_ROLES',
  ReadProfilePrivate: 'READ_PROFILE_PRIVATE',
  UpdateProfile: 'UPDATE_PROFILE',
  UpdateProject: 'UPDATE_PROJECT',
} as const

export type Permission = typeof Permission[keyof typeof Permission]
export type PermissionFilterInput = {
  contains?: InputMaybe<Scalars['String']>
  endsWith?: InputMaybe<Scalars['String']>
  eq?: InputMaybe<Permission>
  exists?: InputMaybe<Scalars['Boolean']>
  in?: InputMaybe<Array<Permission>>
  mode?: InputMaybe<StringFilterMode>
  ne?: InputMaybe<Permission>
  nin?: InputMaybe<Array<Permission>>
  startsWith?: InputMaybe<Scalars['String']>
}

export type Project = {
  __typename?: 'Project'
  bannerLink?: Maybe<Scalars['String']>
  cardImageLink?: Maybe<Scalars['String']>
  completedAt?: Maybe<Scalars['Date']>
  createdAt: Scalars['Date']
  description: Scalars['String']
  downloadLinks: Array<Scalars['String']>
  galleryImageLinks: Array<Scalars['String']>
  id: Scalars['ID']
  members?: Maybe<Array<ProjectMember>>
  name: Scalars['String']
  soundcloudEmbedSrc?: Maybe<Scalars['String']>
  updatedAt: Scalars['Date']
}

export type ProjectFilterInput = {
  and_?: InputMaybe<Array<ProjectFilterInput>>
  bannerLink?: InputMaybe<StringFilterInput>
  cardImageLink?: InputMaybe<StringFilterInput>
  completedAt?: InputMaybe<DateFilterInput>
  createdAt?: InputMaybe<DateFilterInput>
  description?: InputMaybe<StringFilterInput>
  downloadLinks?: InputMaybe<StringFilterInput>
  galleryImageLinks?: InputMaybe<StringFilterInput>
  id?: InputMaybe<IdFilterInput>
  name?: InputMaybe<StringFilterInput>
  nor_?: InputMaybe<Array<ProjectFilterInput>>
  or_?: InputMaybe<Array<ProjectFilterInput>>
  soundcloudEmbedSrc?: InputMaybe<StringFilterInput>
  updatedAt?: InputMaybe<DateFilterInput>
}

export type ProjectFindInput = {
  filter?: InputMaybe<ProjectFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<ProjectRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<ProjectSortInput>>
}

export type ProjectInsertInput = {
  bannerLink?: InputMaybe<Scalars['String']>
  cardImageLink?: InputMaybe<Scalars['String']>
  completedAt?: InputMaybe<Scalars['Date']>
  createdAt?: InputMaybe<Scalars['Date']>
  description: Scalars['String']
  downloadLinks: Array<Scalars['String']>
  galleryImageLinks: Array<Scalars['String']>
  name: Scalars['String']
  soundcloudEmbedSrc?: InputMaybe<Scalars['String']>
  updatedAt: Scalars['Date']
}

export type ProjectMember = {
  __typename?: 'ProjectMember'
  contributions: Scalars['String']
  id: Scalars['ID']
  project: Project
  projectId: Scalars['ID']
  roles: Array<ProjectMemberRole>
  user: User
  userId: Scalars['ID']
}

export type ProjectMemberFilterInput = {
  and_?: InputMaybe<Array<ProjectMemberFilterInput>>
  contributions?: InputMaybe<StringFilterInput>
  id?: InputMaybe<IdFilterInput>
  nor_?: InputMaybe<Array<ProjectMemberFilterInput>>
  or_?: InputMaybe<Array<ProjectMemberFilterInput>>
  projectId?: InputMaybe<IdFilterInput>
  userId?: InputMaybe<IdFilterInput>
}

export type ProjectMemberFindInput = {
  filter?: InputMaybe<ProjectMemberFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<ProjectMemberRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<ProjectMemberSortInput>>
}

export type ProjectMemberInsertInput = {
  contributions: Scalars['String']
  projectId: Scalars['ID']
  userId: Scalars['ID']
}

export type ProjectMemberRelationsFilterInput = {
  project?: InputMaybe<ProjectFindInput>
  roles?: InputMaybe<ProjectMemberRoleFindInput>
  user?: InputMaybe<UserFindInput>
}

export type ProjectMemberRole = {
  __typename?: 'ProjectMemberRole'
  id: Scalars['ID']
  projectMember: ProjectMember
  projectMemberId: Scalars['ID']
  role: Role
  roleCode: RoleCode
}

export type ProjectMemberRoleFilterInput = {
  and_?: InputMaybe<Array<ProjectMemberRoleFilterInput>>
  id?: InputMaybe<IdFilterInput>
  nor_?: InputMaybe<Array<ProjectMemberRoleFilterInput>>
  or_?: InputMaybe<Array<ProjectMemberRoleFilterInput>>
  projectMemberId?: InputMaybe<IdFilterInput>
  roleCode?: InputMaybe<RoleCodeFilterInput>
}

export type ProjectMemberRoleFindInput = {
  filter?: InputMaybe<ProjectMemberRoleFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<ProjectMemberRoleRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<ProjectMemberRoleSortInput>>
}

export type ProjectMemberRoleInsertInput = {
  projectMemberId: Scalars['ID']
  roleCode: RoleCode
}

export type ProjectMemberRoleRelationsFilterInput = {
  projectMember?: InputMaybe<ProjectMemberFindInput>
  role?: InputMaybe<RoleFindInput>
}

export type ProjectMemberRoleSortInput = {
  id?: InputMaybe<SortDirection>
  projectMemberId?: InputMaybe<SortDirection>
  roleCode?: InputMaybe<SortDirection>
}

export type ProjectMemberRoleUpdateInput = {
  projectMemberId?: InputMaybe<Scalars['ID']>
  roleCode?: InputMaybe<RoleCode>
}

export type ProjectMemberSortInput = {
  contributions?: InputMaybe<SortDirection>
  id?: InputMaybe<SortDirection>
  projectId?: InputMaybe<SortDirection>
  userId?: InputMaybe<SortDirection>
}

export type ProjectMemberUpdateInput = {
  contributions?: InputMaybe<Scalars['String']>
  projectId?: InputMaybe<Scalars['ID']>
  userId?: InputMaybe<Scalars['ID']>
}

export type ProjectRelationsFilterInput = {
  members?: InputMaybe<ProjectMemberFindInput>
}

export type ProjectSortInput = {
  bannerLink?: InputMaybe<SortDirection>
  cardImageLink?: InputMaybe<SortDirection>
  completedAt?: InputMaybe<SortDirection>
  createdAt?: InputMaybe<SortDirection>
  description?: InputMaybe<SortDirection>
  downloadLinks?: InputMaybe<SortDirection>
  galleryImageLinks?: InputMaybe<SortDirection>
  id?: InputMaybe<SortDirection>
  name?: InputMaybe<SortDirection>
  soundcloudEmbedSrc?: InputMaybe<SortDirection>
  updatedAt?: InputMaybe<SortDirection>
}

export type ProjectUpdateInput = {
  bannerLink?: InputMaybe<Scalars['String']>
  cardImageLink?: InputMaybe<Scalars['String']>
  completedAt?: InputMaybe<Scalars['Date']>
  createdAt?: InputMaybe<Scalars['Date']>
  description?: InputMaybe<Scalars['String']>
  downloadLinks?: InputMaybe<Array<Scalars['String']>>
  galleryImageLinks?: InputMaybe<Array<Scalars['String']>>
  name?: InputMaybe<Scalars['String']>
  soundcloudEmbedSrc?: InputMaybe<Scalars['String']>
  updatedAt?: InputMaybe<Scalars['Date']>
}

export type Query = {
  __typename?: 'Query'
  projectMemberRoles: Array<ProjectMemberRole>
  projectMembers: Array<ProjectMember>
  projects: Array<Project>
  roles: Array<Role>
  userLoginIdentitys: Array<UserLoginIdentity>
  userRoles: Array<UserRole>
  userSocials: Array<UserSocial>
  users: Array<User>
}

export type QueryProjectMemberRolesArgs = {
  filter?: InputMaybe<ProjectMemberRoleFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<ProjectMemberRoleRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<ProjectMemberRoleSortInput>>
}

export type QueryProjectMembersArgs = {
  filter?: InputMaybe<ProjectMemberFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<ProjectMemberRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<ProjectMemberSortInput>>
}

export type QueryProjectsArgs = {
  filter?: InputMaybe<ProjectFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<ProjectRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<ProjectSortInput>>
}

export type QueryRolesArgs = {
  filter?: InputMaybe<RoleFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<RoleSortInput>>
}

export type QueryUserLoginIdentitysArgs = {
  filter?: InputMaybe<UserLoginIdentityFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<UserLoginIdentityRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<UserLoginIdentitySortInput>>
}

export type QueryUserRolesArgs = {
  filter?: InputMaybe<UserRoleFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<UserRoleRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<UserRoleSortInput>>
}

export type QueryUserSocialsArgs = {
  filter?: InputMaybe<UserSocialFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<UserSocialRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<UserSocialSortInput>>
}

export type QueryUsersArgs = {
  filter?: InputMaybe<UserFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<UserRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<UserSortInput>>
}

export type Role = {
  __typename?: 'Role'
  code: RoleCode
  permissions: Array<Maybe<Permission>>
}

export const RoleCode = {
  Moderator: 'MODERATOR',
  ProjectMember: 'PROJECT_MEMBER',
  ProjectOwner: 'PROJECT_OWNER',
  SuperAdmin: 'SUPER_ADMIN',
  User: 'USER',
} as const

export type RoleCode = typeof RoleCode[keyof typeof RoleCode]
export type RoleCodeFilterInput = {
  contains?: InputMaybe<Scalars['String']>
  endsWith?: InputMaybe<Scalars['String']>
  eq?: InputMaybe<RoleCode>
  exists?: InputMaybe<Scalars['Boolean']>
  in?: InputMaybe<Array<RoleCode>>
  mode?: InputMaybe<StringFilterMode>
  ne?: InputMaybe<RoleCode>
  nin?: InputMaybe<Array<RoleCode>>
  startsWith?: InputMaybe<Scalars['String']>
}

export type RoleFilterInput = {
  and_?: InputMaybe<Array<RoleFilterInput>>
  code?: InputMaybe<RoleCodeFilterInput>
  nor_?: InputMaybe<Array<RoleFilterInput>>
  or_?: InputMaybe<Array<RoleFilterInput>>
  permissions?: InputMaybe<PermissionFilterInput>
}

export type RoleFindInput = {
  filter?: InputMaybe<RoleFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<RoleSortInput>>
}

export type RoleInsertInput = {
  code: RoleCode
  permissions: Array<InputMaybe<Permission>>
}

export type RoleSortInput = {
  code?: InputMaybe<SortDirection>
  permissions?: InputMaybe<SortDirection>
}

export type RoleUpdateInput = {
  permissions?: InputMaybe<Array<InputMaybe<Permission>>>
}

export const SortDirection = {
  Asc: 'asc',
  Desc: 'desc',
} as const

export type SortDirection = typeof SortDirection[keyof typeof SortDirection]
export type StringFilterInput = {
  contains?: InputMaybe<Scalars['String']>
  endsWith?: InputMaybe<Scalars['String']>
  eq?: InputMaybe<Scalars['String']>
  exists?: InputMaybe<Scalars['Boolean']>
  in?: InputMaybe<Array<Scalars['String']>>
  mode?: InputMaybe<StringFilterMode>
  ne?: InputMaybe<Scalars['String']>
  nin?: InputMaybe<Array<Scalars['String']>>
  startsWith?: InputMaybe<Scalars['String']>
}

export const StringFilterMode = {
  Insensitive: 'INSENSITIVE',
  Sensitive: 'SENSITIVE',
} as const

export type StringFilterMode = typeof StringFilterMode[keyof typeof StringFilterMode]
export type User = {
  __typename?: 'User'
  avatarLink?: Maybe<Scalars['String']>
  bannerLink?: Maybe<Scalars['String']>
  bio?: Maybe<Scalars['String']>
  createdAt: Scalars['Date']
  displayName?: Maybe<Scalars['String']>
  email: Scalars['String']
  id: Scalars['ID']
  loginIdentities: Array<UserLoginIdentity>
  projectMembers: Array<ProjectMember>
  roles: Array<UserRole>
  socials: Array<UserSocial>
  username?: Maybe<Scalars['String']>
}

export type UserFilterInput = {
  and_?: InputMaybe<Array<UserFilterInput>>
  avatarLink?: InputMaybe<StringFilterInput>
  bannerLink?: InputMaybe<StringFilterInput>
  bio?: InputMaybe<StringFilterInput>
  createdAt?: InputMaybe<DateFilterInput>
  displayName?: InputMaybe<StringFilterInput>
  email?: InputMaybe<StringFilterInput>
  id?: InputMaybe<IdFilterInput>
  nor_?: InputMaybe<Array<UserFilterInput>>
  or_?: InputMaybe<Array<UserFilterInput>>
  username?: InputMaybe<StringFilterInput>
}

export type UserFindInput = {
  filter?: InputMaybe<UserFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<UserRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<UserSortInput>>
}

export type UserInsertInput = {
  avatarLink?: InputMaybe<Scalars['String']>
  bannerLink?: InputMaybe<Scalars['String']>
  bio?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['Date']>
  displayName?: InputMaybe<Scalars['String']>
  email: Scalars['String']
  username?: InputMaybe<Scalars['String']>
}

export type UserLoginIdentity = {
  __typename?: 'UserLoginIdentity'
  data?: Maybe<Scalars['Json']>
  id: Scalars['ID']
  identityId: Scalars['String']
  name: Scalars['String']
  user: User
  userId: Scalars['ID']
}

export type UserLoginIdentityFilterInput = {
  and_?: InputMaybe<Array<UserLoginIdentityFilterInput>>
  data?: InputMaybe<JsonFilterInput>
  id?: InputMaybe<IdFilterInput>
  identityId?: InputMaybe<StringFilterInput>
  name?: InputMaybe<StringFilterInput>
  nor_?: InputMaybe<Array<UserLoginIdentityFilterInput>>
  or_?: InputMaybe<Array<UserLoginIdentityFilterInput>>
  userId?: InputMaybe<IdFilterInput>
}

export type UserLoginIdentityFindInput = {
  filter?: InputMaybe<UserLoginIdentityFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<UserLoginIdentityRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<UserLoginIdentitySortInput>>
}

export type UserLoginIdentityInsertInput = {
  data?: InputMaybe<Scalars['Json']>
  identityId: Scalars['String']
  name: Scalars['String']
  userId: Scalars['ID']
}

export type UserLoginIdentityRelationsFilterInput = {
  user?: InputMaybe<UserFindInput>
}

export type UserLoginIdentitySortInput = {
  data?: InputMaybe<SortDirection>
  id?: InputMaybe<SortDirection>
  identityId?: InputMaybe<SortDirection>
  name?: InputMaybe<SortDirection>
  userId?: InputMaybe<SortDirection>
}

export type UserLoginIdentityUpdateInput = {
  data?: InputMaybe<Scalars['Json']>
  identityId?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
  userId?: InputMaybe<Scalars['ID']>
}

export type UserRelationsFilterInput = {
  loginIdentities?: InputMaybe<UserLoginIdentityFindInput>
  projectMembers?: InputMaybe<ProjectMemberFindInput>
  roles?: InputMaybe<UserRoleFindInput>
  socials?: InputMaybe<UserSocialFindInput>
}

export type UserRole = {
  __typename?: 'UserRole'
  id: Scalars['ID']
  role: Role
  roleCode: RoleCode
  user: User
  userId: Scalars['ID']
}

export type UserRoleFilterInput = {
  and_?: InputMaybe<Array<UserRoleFilterInput>>
  id?: InputMaybe<IdFilterInput>
  nor_?: InputMaybe<Array<UserRoleFilterInput>>
  or_?: InputMaybe<Array<UserRoleFilterInput>>
  roleCode?: InputMaybe<RoleCodeFilterInput>
  userId?: InputMaybe<IdFilterInput>
}

export type UserRoleFindInput = {
  filter?: InputMaybe<UserRoleFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<UserRoleRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<UserRoleSortInput>>
}

export type UserRoleInsertInput = {
  roleCode: RoleCode
  userId: Scalars['ID']
}

export type UserRoleRelationsFilterInput = {
  role?: InputMaybe<RoleFindInput>
  user?: InputMaybe<UserFindInput>
}

export type UserRoleSortInput = {
  id?: InputMaybe<SortDirection>
  roleCode?: InputMaybe<SortDirection>
  userId?: InputMaybe<SortDirection>
}

export type UserRoleUpdateInput = {
  roleCode?: InputMaybe<RoleCode>
  userId?: InputMaybe<Scalars['ID']>
}

export type UserSocial = {
  __typename?: 'UserSocial'
  id: Scalars['ID']
  link: Scalars['String']
  platform: Scalars['String']
  user: User
  userId: Scalars['ID']
  username: Scalars['String']
}

export type UserSocialFilterInput = {
  and_?: InputMaybe<Array<UserSocialFilterInput>>
  id?: InputMaybe<IdFilterInput>
  link?: InputMaybe<StringFilterInput>
  nor_?: InputMaybe<Array<UserSocialFilterInput>>
  or_?: InputMaybe<Array<UserSocialFilterInput>>
  platform?: InputMaybe<StringFilterInput>
  userId?: InputMaybe<IdFilterInput>
  username?: InputMaybe<StringFilterInput>
}

export type UserSocialFindInput = {
  filter?: InputMaybe<UserSocialFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<UserSocialRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<UserSocialSortInput>>
}

export type UserSocialInsertInput = {
  link: Scalars['String']
  platform: Scalars['String']
  userId: Scalars['ID']
  username: Scalars['String']
}

export type UserSocialRelationsFilterInput = {
  user?: InputMaybe<UserFindInput>
}

export type UserSocialSortInput = {
  id?: InputMaybe<SortDirection>
  link?: InputMaybe<SortDirection>
  platform?: InputMaybe<SortDirection>
  userId?: InputMaybe<SortDirection>
  username?: InputMaybe<SortDirection>
}

export type UserSocialUpdateInput = {
  link?: InputMaybe<Scalars['String']>
  platform?: InputMaybe<Scalars['String']>
  userId?: InputMaybe<Scalars['ID']>
  username?: InputMaybe<Scalars['String']>
}

export type UserSortInput = {
  avatarLink?: InputMaybe<SortDirection>
  bannerLink?: InputMaybe<SortDirection>
  bio?: InputMaybe<SortDirection>
  createdAt?: InputMaybe<SortDirection>
  displayName?: InputMaybe<SortDirection>
  email?: InputMaybe<SortDirection>
  id?: InputMaybe<SortDirection>
  username?: InputMaybe<SortDirection>
}

export type UserUpdateInput = {
  avatarLink?: InputMaybe<Scalars['String']>
  bannerLink?: InputMaybe<Scalars['String']>
  bio?: InputMaybe<Scalars['String']>
  createdAt?: InputMaybe<Scalars['Date']>
  displayName?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['String']>
  username?: InputMaybe<Scalars['String']>
}
