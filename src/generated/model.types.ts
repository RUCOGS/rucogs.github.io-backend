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

export type EBoard = {
  __typename?: 'EBoard'
  createdAt: Scalars['Date']
  graduatedAt?: Maybe<Scalars['Date']>
  id: Scalars['ID']
  roles: Array<EBoardRole>
  user: User
  userId: Scalars['ID']
}

export type EBoardFilterInput = {
  and_?: InputMaybe<Array<EBoardFilterInput>>
  createdAt?: InputMaybe<DateFilterInput>
  graduatedAt?: InputMaybe<DateFilterInput>
  id?: InputMaybe<IdFilterInput>
  nor_?: InputMaybe<Array<EBoardFilterInput>>
  or_?: InputMaybe<Array<EBoardFilterInput>>
  userId?: InputMaybe<IdFilterInput>
}

export type EBoardFindInput = {
  filter?: InputMaybe<EBoardFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<EBoardRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<EBoardSortInput>>
}

export type EBoardInsertInput = {
  createdAt?: InputMaybe<Scalars['Date']>
  graduatedAt?: InputMaybe<Scalars['Date']>
  userId: Scalars['ID']
}

export type EBoardRelationsFilterInput = {
  roles?: InputMaybe<EBoardRoleFindInput>
  user?: InputMaybe<UserFindInput>
}

export type EBoardRole = {
  __typename?: 'EBoardRole'
  eboard: EBoard
  eboardId: Scalars['ID']
  id: Scalars['ID']
  roleCode: RoleCode
}

export type EBoardRoleFilterInput = {
  and_?: InputMaybe<Array<EBoardRoleFilterInput>>
  eboardId?: InputMaybe<IdFilterInput>
  id?: InputMaybe<IdFilterInput>
  nor_?: InputMaybe<Array<EBoardRoleFilterInput>>
  or_?: InputMaybe<Array<EBoardRoleFilterInput>>
  roleCode?: InputMaybe<RoleCodeFilterInput>
}

export type EBoardRoleFindInput = {
  filter?: InputMaybe<EBoardRoleFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<EBoardRoleRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<EBoardRoleSortInput>>
}

export type EBoardRoleInsertInput = {
  eboardId: Scalars['ID']
  roleCode: RoleCode
}

export type EBoardRoleRelationsFilterInput = {
  eboard?: InputMaybe<EBoardFindInput>
}

export type EBoardRoleSortInput = {
  eboardId?: InputMaybe<SortDirection>
  id?: InputMaybe<SortDirection>
  roleCode?: InputMaybe<SortDirection>
}

export type EBoardRoleUpdateInput = {
  eboardId?: InputMaybe<Scalars['ID']>
  roleCode?: InputMaybe<RoleCode>
}

export type EBoardSortInput = {
  createdAt?: InputMaybe<SortDirection>
  graduatedAt?: InputMaybe<SortDirection>
  id?: InputMaybe<SortDirection>
  userId?: InputMaybe<SortDirection>
}

export type EBoardUpdateInput = {
  createdAt?: InputMaybe<Scalars['Date']>
  graduatedAt?: InputMaybe<Scalars['Date']>
  userId?: InputMaybe<Scalars['ID']>
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
  createEBoard: EBoard
  createEBoardRole: EBoardRole
  createProject: Project
  createProjectMember: ProjectMember
  createProjectMemberRole: ProjectMemberRole
  createUser: User
  createUserLoginIdentity: UserLoginIdentity
  createUserRole: UserRole
  createUserSocial: UserSocial
  deleteEBoardRoles?: Maybe<Scalars['Boolean']>
  deleteEBoards?: Maybe<Scalars['Boolean']>
  deleteProjectMemberRoles?: Maybe<Scalars['Boolean']>
  deleteProjectMembers?: Maybe<Scalars['Boolean']>
  deleteProjects?: Maybe<Scalars['Boolean']>
  deleteUserLoginIdentitys?: Maybe<Scalars['Boolean']>
  deleteUserRoles?: Maybe<Scalars['Boolean']>
  deleteUserSocials?: Maybe<Scalars['Boolean']>
  deleteUsers?: Maybe<Scalars['Boolean']>
  updateEBoardRoles?: Maybe<Scalars['Boolean']>
  updateEBoards?: Maybe<Scalars['Boolean']>
  updateProjectMemberRoles?: Maybe<Scalars['Boolean']>
  updateProjectMembers?: Maybe<Scalars['Boolean']>
  updateProjects?: Maybe<Scalars['Boolean']>
  updateUserLoginIdentitys?: Maybe<Scalars['Boolean']>
  updateUserRoles?: Maybe<Scalars['Boolean']>
  updateUserSocials?: Maybe<Scalars['Boolean']>
  updateUsers?: Maybe<Scalars['Boolean']>
}

export type MutationCreateEBoardArgs = {
  record: EBoardInsertInput
}

export type MutationCreateEBoardRoleArgs = {
  record: EBoardRoleInsertInput
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

export type MutationDeleteEBoardRolesArgs = {
  filter: EBoardRoleFilterInput
}

export type MutationDeleteEBoardsArgs = {
  filter: EBoardFilterInput
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

export type MutationUpdateEBoardRolesArgs = {
  changes: EBoardRoleUpdateInput
  filter: EBoardRoleFilterInput
}

export type MutationUpdateEBoardsArgs = {
  changes: EBoardUpdateInput
  filter: EBoardFilterInput
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
  ManageEboard: 'MANAGE_EBOARD',
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
  eBoardRoles: Array<EBoardRole>
  eBoards: Array<EBoard>
  projectMemberRoles: Array<ProjectMemberRole>
  projectMembers: Array<ProjectMember>
  projects: Array<Project>
  userLoginIdentitys: Array<UserLoginIdentity>
  userRoles: Array<UserRole>
  userSocials: Array<UserSocial>
  users: Array<User>
}

export type QueryEBoardRolesArgs = {
  filter?: InputMaybe<EBoardRoleFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<EBoardRoleRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<EBoardRoleSortInput>>
}

export type QueryEBoardsArgs = {
  filter?: InputMaybe<EBoardFilterInput>
  limit?: InputMaybe<Scalars['Int']>
  relations?: InputMaybe<EBoardRelationsFilterInput>
  skip?: InputMaybe<Scalars['Int']>
  sorts?: InputMaybe<Array<EBoardSortInput>>
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

export const RoleCode = {
  Alumni: 'ALUMNI',
  Artist: 'ARTIST',
  BotDeveloper: 'BOT_DEVELOPER',
  ClubGraphicArtist: 'CLUB_GRAPHIC_ARTIST',
  Eboard: 'EBOARD',
  GameDesigner: 'GAME_DESIGNER',
  Moderator: 'MODERATOR',
  Musician: 'MUSICIAN',
  Outreach: 'OUTREACH',
  President: 'PRESIDENT',
  Programmer: 'PROGRAMMER',
  ProjectMember: 'PROJECT_MEMBER',
  ProjectOwner: 'PROJECT_OWNER',
  SoundDesigner: 'SOUND_DESIGNER',
  SuperAdmin: 'SUPER_ADMIN',
  Treasurer: 'TREASURER',
  User: 'USER',
  VicePresident: 'VICE_PRESIDENT',
  Webmaster: 'WEBMASTER',
  Writer: 'WRITER',
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
  eboard?: Maybe<EBoard>
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
  eboard?: InputMaybe<EBoardFindInput>
  loginIdentities?: InputMaybe<UserLoginIdentityFindInput>
  projectMembers?: InputMaybe<ProjectMemberFindInput>
  roles?: InputMaybe<UserRoleFindInput>
  socials?: InputMaybe<UserSocialFindInput>
}

export type UserRole = {
  __typename?: 'UserRole'
  id: Scalars['ID']
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
