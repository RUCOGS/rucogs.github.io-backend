import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  Json: any;
  Upload: any;
};

export const Access = {
  Closed: 'CLOSED',
  Invite: 'INVITE',
  Open: 'OPEN'
} as const;

export type Access = typeof Access[keyof typeof Access];
export type AccessFilterInput = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Access>;
  exists?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<Access>>;
  mode?: InputMaybe<StringFilterMode>;
  ne?: InputMaybe<Access>;
  nin?: InputMaybe<Array<Access>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type BooleanFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<Scalars['Boolean']>>;
  ne?: InputMaybe<Scalars['Boolean']>;
  nin?: InputMaybe<Array<Scalars['Boolean']>>;
};

export type DateFilterInput = {
  eq?: InputMaybe<Scalars['Date']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<Scalars['Date']>>;
  ne?: InputMaybe<Scalars['Date']>;
  nin?: InputMaybe<Array<Scalars['Date']>>;
};

export type EBoard = {
  __typename?: 'EBoard';
  createdAt: Scalars['Date'];
  graduatedAt?: Maybe<Scalars['Date']>;
  id: Scalars['ID'];
  roles: Array<EBoardRole>;
  user: User;
  userId: Scalars['ID'];
};

export type EBoardFilterInput = {
  and_?: InputMaybe<Array<EBoardFilterInput>>;
  createdAt?: InputMaybe<DateFilterInput>;
  graduatedAt?: InputMaybe<DateFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  nor_?: InputMaybe<Array<EBoardFilterInput>>;
  or_?: InputMaybe<Array<EBoardFilterInput>>;
  userId?: InputMaybe<IdFilterInput>;
};

export type EBoardFindInput = {
  filter?: InputMaybe<EBoardFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<EBoardRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<EBoardSortInput>>;
};

export type EBoardInsertInput = {
  createdAt?: InputMaybe<Scalars['Date']>;
  graduatedAt?: InputMaybe<Scalars['Date']>;
  userId: Scalars['ID'];
};

export type EBoardRelationsFilterInput = {
  roles?: InputMaybe<EBoardRoleFindInput>;
  user?: InputMaybe<UserFindInput>;
};

export type EBoardRole = {
  __typename?: 'EBoardRole';
  eboard: EBoard;
  eboardId: Scalars['ID'];
  id: Scalars['ID'];
  roleCode: RoleCode;
};

export type EBoardRoleFilterInput = {
  and_?: InputMaybe<Array<EBoardRoleFilterInput>>;
  eboardId?: InputMaybe<IdFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  nor_?: InputMaybe<Array<EBoardRoleFilterInput>>;
  or_?: InputMaybe<Array<EBoardRoleFilterInput>>;
  roleCode?: InputMaybe<RoleCodeFilterInput>;
};

export type EBoardRoleFindInput = {
  filter?: InputMaybe<EBoardRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<EBoardRoleRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<EBoardRoleSortInput>>;
};

export type EBoardRoleInsertInput = {
  eboardId: Scalars['ID'];
  roleCode: RoleCode;
};

export type EBoardRoleRelationsFilterInput = {
  eboard?: InputMaybe<EBoardFindInput>;
};

export type EBoardRoleSortInput = {
  eboardId?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  roleCode?: InputMaybe<SortDirection>;
};

export type EBoardRoleUpdateInput = {
  eboardId?: InputMaybe<Scalars['ID']>;
  roleCode?: InputMaybe<RoleCode>;
};

export type EBoardSortInput = {
  createdAt?: InputMaybe<SortDirection>;
  graduatedAt?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  userId?: InputMaybe<SortDirection>;
};

export type EBoardUpdateInput = {
  createdAt?: InputMaybe<Scalars['Date']>;
  graduatedAt?: InputMaybe<Scalars['Date']>;
  userId?: InputMaybe<Scalars['ID']>;
};

export type FloatFilterInput = {
  eq?: InputMaybe<Scalars['Float']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  gt?: InputMaybe<Scalars['Float']>;
  gte?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<Scalars['Float']>>;
  lt?: InputMaybe<Scalars['Float']>;
  lte?: InputMaybe<Scalars['Float']>;
  ne?: InputMaybe<Scalars['Float']>;
  nin?: InputMaybe<Array<Scalars['Float']>>;
};

export type IdFilterInput = {
  eq?: InputMaybe<Scalars['ID']>;
  exists?: InputMaybe<Scalars['ID']>;
  in?: InputMaybe<Array<Scalars['ID']>>;
  ne?: InputMaybe<Scalars['ID']>;
  nin?: InputMaybe<Array<Scalars['ID']>>;
};

export type IntFilterInput = {
  eq?: InputMaybe<Scalars['Int']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<Scalars['Int']>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  ne?: InputMaybe<Scalars['Int']>;
  nin?: InputMaybe<Array<Scalars['Int']>>;
};

export const InviteType = {
  Incoming: 'INCOMING',
  Outgoing: 'OUTGOING'
} as const;

export type InviteType = typeof InviteType[keyof typeof InviteType];
export type InviteTypeFilterInput = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<InviteType>;
  exists?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<InviteType>>;
  mode?: InputMaybe<StringFilterMode>;
  ne?: InputMaybe<InviteType>;
  nin?: InputMaybe<Array<InviteType>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type JsonFilterInput = {
  eq?: InputMaybe<Scalars['Json']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<Scalars['Json']>>;
  ne?: InputMaybe<Scalars['Json']>;
  nin?: InputMaybe<Array<Scalars['Json']>>;
};

export type KeyValue = {
  key: Scalars['String'];
  value: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptProjectInvite?: Maybe<Scalars['Boolean']>;
  createEBoard: EBoard;
  createEBoardRole: EBoardRole;
  createProject: Project;
  createProjectInvite: ProjectInvite;
  createProjectMember: ProjectMember;
  createProjectMemberRole: ProjectMemberRole;
  createUser: User;
  createUserLoginIdentity: UserLoginIdentity;
  createUserRole: UserRole;
  createUserSocial: UserSocial;
  deleteEBoardRoles?: Maybe<Scalars['Boolean']>;
  deleteEBoards?: Maybe<Scalars['Boolean']>;
  deleteProject?: Maybe<Scalars['Boolean']>;
  deleteProjectInvite?: Maybe<Scalars['Boolean']>;
  deleteProjectInvites?: Maybe<Scalars['Boolean']>;
  deleteProjectMember?: Maybe<Scalars['Boolean']>;
  deleteProjectMemberRole?: Maybe<Scalars['Boolean']>;
  deleteProjectMemberRoles?: Maybe<Scalars['Boolean']>;
  deleteProjectMembers?: Maybe<Scalars['Boolean']>;
  deleteProjects?: Maybe<Scalars['Boolean']>;
  deleteUserLoginIdentitys?: Maybe<Scalars['Boolean']>;
  deleteUserRole?: Maybe<Scalars['Boolean']>;
  deleteUserRoles?: Maybe<Scalars['Boolean']>;
  deleteUserSocials?: Maybe<Scalars['Boolean']>;
  deleteUsers?: Maybe<Scalars['Boolean']>;
  joinOpenProject?: Maybe<Scalars['Boolean']>;
  newProject: Scalars['ID'];
  newProjectInvite: Scalars['ID'];
  newProjectMemberRole: Scalars['ID'];
  newUserRole: Scalars['ID'];
  updateEBoardRoles?: Maybe<Scalars['Boolean']>;
  updateEBoards?: Maybe<Scalars['Boolean']>;
  updateProject?: Maybe<Scalars['Boolean']>;
  updateProjectInvites?: Maybe<Scalars['Boolean']>;
  updateProjectMember?: Maybe<Scalars['Boolean']>;
  updateProjectMemberRoles?: Maybe<Scalars['Boolean']>;
  updateProjectMembers?: Maybe<Scalars['Boolean']>;
  updateProjects?: Maybe<Scalars['Boolean']>;
  updateUser?: Maybe<Scalars['Boolean']>;
  updateUserLoginIdentitys?: Maybe<Scalars['Boolean']>;
  updateUserRoles?: Maybe<Scalars['Boolean']>;
  updateUserSocials?: Maybe<Scalars['Boolean']>;
  updateUsers?: Maybe<Scalars['Boolean']>;
};


export type MutationAcceptProjectInviteArgs = {
  inviteId: Scalars['ID'];
};


export type MutationCreateEBoardArgs = {
  record: EBoardInsertInput;
};


export type MutationCreateEBoardRoleArgs = {
  record: EBoardRoleInsertInput;
};


export type MutationCreateProjectArgs = {
  record: ProjectInsertInput;
};


export type MutationCreateProjectInviteArgs = {
  record: ProjectInviteInsertInput;
};


export type MutationCreateProjectMemberArgs = {
  record: ProjectMemberInsertInput;
};


export type MutationCreateProjectMemberRoleArgs = {
  record: ProjectMemberRoleInsertInput;
};


export type MutationCreateUserArgs = {
  record: UserInsertInput;
};


export type MutationCreateUserLoginIdentityArgs = {
  record: UserLoginIdentityInsertInput;
};


export type MutationCreateUserRoleArgs = {
  record: UserRoleInsertInput;
};


export type MutationCreateUserSocialArgs = {
  record: UserSocialInsertInput;
};


export type MutationDeleteEBoardRolesArgs = {
  filter: EBoardRoleFilterInput;
};


export type MutationDeleteEBoardsArgs = {
  filter: EBoardFilterInput;
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProjectInviteArgs = {
  inviteId: Scalars['ID'];
};


export type MutationDeleteProjectInvitesArgs = {
  filter: ProjectInviteFilterInput;
};


export type MutationDeleteProjectMemberArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProjectMemberRoleArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProjectMemberRolesArgs = {
  filter: ProjectMemberRoleFilterInput;
};


export type MutationDeleteProjectMembersArgs = {
  filter: ProjectMemberFilterInput;
};


export type MutationDeleteProjectsArgs = {
  filter: ProjectFilterInput;
};


export type MutationDeleteUserLoginIdentitysArgs = {
  filter: UserLoginIdentityFilterInput;
};


export type MutationDeleteUserRoleArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserRolesArgs = {
  filter: UserRoleFilterInput;
};


export type MutationDeleteUserSocialsArgs = {
  filter: UserSocialFilterInput;
};


export type MutationDeleteUsersArgs = {
  filter: UserFilterInput;
};


export type MutationJoinOpenProjectArgs = {
  projectId: Scalars['ID'];
};


export type MutationNewProjectArgs = {
  input: NewProjectInput;
};


export type MutationNewProjectInviteArgs = {
  input: NewProjectInviteInput;
};


export type MutationNewProjectMemberRoleArgs = {
  input: NewProjectMemberRoleInput;
};


export type MutationNewUserRoleArgs = {
  input: NewUserRoleInput;
};


export type MutationUpdateEBoardRolesArgs = {
  changes: EBoardRoleUpdateInput;
  filter: EBoardRoleFilterInput;
};


export type MutationUpdateEBoardsArgs = {
  changes: EBoardUpdateInput;
  filter: EBoardFilterInput;
};


export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};


export type MutationUpdateProjectInvitesArgs = {
  changes: ProjectInviteUpdateInput;
  filter: ProjectInviteFilterInput;
};


export type MutationUpdateProjectMemberArgs = {
  input: UpdateProjectMemberInput;
};


export type MutationUpdateProjectMemberRolesArgs = {
  changes: ProjectMemberRoleUpdateInput;
  filter: ProjectMemberRoleFilterInput;
};


export type MutationUpdateProjectMembersArgs = {
  changes: ProjectMemberUpdateInput;
  filter: ProjectMemberFilterInput;
};


export type MutationUpdateProjectsArgs = {
  changes: ProjectUpdateInput;
  filter: ProjectFilterInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserLoginIdentitysArgs = {
  changes: UserLoginIdentityUpdateInput;
  filter: UserLoginIdentityFilterInput;
};


export type MutationUpdateUserRolesArgs = {
  changes: UserRoleUpdateInput;
  filter: UserRoleFilterInput;
};


export type MutationUpdateUserSocialsArgs = {
  changes: UserSocialUpdateInput;
  filter: UserSocialFilterInput;
};


export type MutationUpdateUsersArgs = {
  changes: UserUpdateInput;
  filter: UserFilterInput;
};

export type NewProjectInput = {
  access: Access;
  name: Scalars['String'];
  pitch: Scalars['String'];
};

export type NewProjectInviteInput = {
  projectId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type NewProjectMemberRoleInput = {
  projectMemberId: Scalars['ID'];
  roleCode: RoleCode;
};

export type NewUserRoleInput = {
  roleCode: RoleCode;
  userId: Scalars['ID'];
};

export const Permission = {
  AcceptProjectInvite: 'ACCEPT_PROJECT_INVITE',
  CreateProject: 'CREATE_PROJECT',
  DeleteProfile: 'DELETE_PROFILE',
  DeleteProject: 'DELETE_PROJECT',
  ManageEboard: 'MANAGE_EBOARD',
  ReadProfilePrivate: 'READ_PROFILE_PRIVATE',
  UpdateProfile: 'UPDATE_PROFILE',
  UpdateProject: 'UPDATE_PROJECT',
  UpdateProjectMember: 'UPDATE_PROJECT_MEMBER'
} as const;

export type Permission = typeof Permission[keyof typeof Permission];
export type PermissionFilterInput = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Permission>;
  exists?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<Permission>>;
  mode?: InputMaybe<StringFilterMode>;
  ne?: InputMaybe<Permission>;
  nin?: InputMaybe<Array<Permission>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type Project = {
  __typename?: 'Project';
  access: Access;
  bannerLink?: Maybe<Scalars['String']>;
  cardImageLink?: Maybe<Scalars['String']>;
  completedAt?: Maybe<Scalars['Date']>;
  createdAt?: Maybe<Scalars['Date']>;
  description?: Maybe<Scalars['String']>;
  downloadLinks?: Maybe<Array<Scalars['String']>>;
  galleryImageLinks?: Maybe<Array<Scalars['String']>>;
  id: Scalars['ID'];
  invites: Array<ProjectInvite>;
  members: Array<ProjectMember>;
  name: Scalars['String'];
  pitch: Scalars['String'];
  soundcloudEmbedSrc?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['Date']>;
};

export type ProjectFilterInput = {
  access?: InputMaybe<AccessFilterInput>;
  and_?: InputMaybe<Array<ProjectFilterInput>>;
  bannerLink?: InputMaybe<StringFilterInput>;
  cardImageLink?: InputMaybe<StringFilterInput>;
  completedAt?: InputMaybe<DateFilterInput>;
  createdAt?: InputMaybe<DateFilterInput>;
  description?: InputMaybe<StringFilterInput>;
  downloadLinks?: InputMaybe<StringFilterInput>;
  galleryImageLinks?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  nor_?: InputMaybe<Array<ProjectFilterInput>>;
  or_?: InputMaybe<Array<ProjectFilterInput>>;
  pitch?: InputMaybe<StringFilterInput>;
  soundcloudEmbedSrc?: InputMaybe<StringFilterInput>;
  updatedAt?: InputMaybe<DateFilterInput>;
};

export type ProjectFindInput = {
  filter?: InputMaybe<ProjectFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<ProjectRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<ProjectSortInput>>;
};

export type ProjectInsertInput = {
  access: Access;
  bannerLink?: InputMaybe<Scalars['String']>;
  cardImageLink?: InputMaybe<Scalars['String']>;
  completedAt?: InputMaybe<Scalars['Date']>;
  createdAt?: InputMaybe<Scalars['Date']>;
  description?: InputMaybe<Scalars['String']>;
  downloadLinks?: InputMaybe<Array<Scalars['String']>>;
  galleryImageLinks?: InputMaybe<Array<Scalars['String']>>;
  name: Scalars['String'];
  pitch: Scalars['String'];
  soundcloudEmbedSrc?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Date']>;
};

export type ProjectInvite = {
  __typename?: 'ProjectInvite';
  createdAt?: Maybe<Scalars['Date']>;
  id: Scalars['ID'];
  project: Project;
  projectId: Scalars['ID'];
  type: InviteType;
  user: User;
  userId: Scalars['ID'];
};

export type ProjectInviteFilterInput = {
  and_?: InputMaybe<Array<ProjectInviteFilterInput>>;
  createdAt?: InputMaybe<DateFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  nor_?: InputMaybe<Array<ProjectInviteFilterInput>>;
  or_?: InputMaybe<Array<ProjectInviteFilterInput>>;
  projectId?: InputMaybe<IdFilterInput>;
  type?: InputMaybe<InviteTypeFilterInput>;
  userId?: InputMaybe<IdFilterInput>;
};

export type ProjectInviteFindInput = {
  filter?: InputMaybe<ProjectInviteFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<ProjectInviteRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<ProjectInviteSortInput>>;
};

export type ProjectInviteInsertInput = {
  createdAt?: InputMaybe<Scalars['Date']>;
  projectId: Scalars['ID'];
  type: InviteType;
  userId: Scalars['ID'];
};

export type ProjectInviteRelationsFilterInput = {
  project?: InputMaybe<ProjectFindInput>;
  user?: InputMaybe<UserFindInput>;
};

export type ProjectInviteSortInput = {
  createdAt?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  projectId?: InputMaybe<SortDirection>;
  type?: InputMaybe<SortDirection>;
  userId?: InputMaybe<SortDirection>;
};

export type ProjectInviteUpdateInput = {
  createdAt?: InputMaybe<Scalars['Date']>;
  projectId?: InputMaybe<Scalars['ID']>;
  type?: InputMaybe<InviteType>;
  userId?: InputMaybe<Scalars['ID']>;
};

export type ProjectMember = {
  __typename?: 'ProjectMember';
  contributions?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Date']>;
  id: Scalars['ID'];
  project: Project;
  projectId: Scalars['ID'];
  roles: Array<ProjectMemberRole>;
  updatedAt?: Maybe<Scalars['Date']>;
  user: User;
  userId: Scalars['ID'];
};

export type ProjectMemberFilterInput = {
  and_?: InputMaybe<Array<ProjectMemberFilterInput>>;
  contributions?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  nor_?: InputMaybe<Array<ProjectMemberFilterInput>>;
  or_?: InputMaybe<Array<ProjectMemberFilterInput>>;
  projectId?: InputMaybe<IdFilterInput>;
  updatedAt?: InputMaybe<DateFilterInput>;
  userId?: InputMaybe<IdFilterInput>;
};

export type ProjectMemberFindInput = {
  filter?: InputMaybe<ProjectMemberFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<ProjectMemberRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<ProjectMemberSortInput>>;
};

export type ProjectMemberInsertInput = {
  contributions?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['Date']>;
  projectId: Scalars['ID'];
  updatedAt?: InputMaybe<Scalars['Date']>;
  userId: Scalars['ID'];
};

export type ProjectMemberRelationsFilterInput = {
  project?: InputMaybe<ProjectFindInput>;
  roles?: InputMaybe<ProjectMemberRoleFindInput>;
  user?: InputMaybe<UserFindInput>;
};

export type ProjectMemberRole = {
  __typename?: 'ProjectMemberRole';
  id: Scalars['ID'];
  projectMember: ProjectMember;
  projectMemberId: Scalars['ID'];
  roleCode: RoleCode;
};

export type ProjectMemberRoleFilterInput = {
  and_?: InputMaybe<Array<ProjectMemberRoleFilterInput>>;
  id?: InputMaybe<IdFilterInput>;
  nor_?: InputMaybe<Array<ProjectMemberRoleFilterInput>>;
  or_?: InputMaybe<Array<ProjectMemberRoleFilterInput>>;
  projectMemberId?: InputMaybe<IdFilterInput>;
  roleCode?: InputMaybe<RoleCodeFilterInput>;
};

export type ProjectMemberRoleFindInput = {
  filter?: InputMaybe<ProjectMemberRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<ProjectMemberRoleRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<ProjectMemberRoleSortInput>>;
};

export type ProjectMemberRoleInsertInput = {
  projectMemberId: Scalars['ID'];
  roleCode: RoleCode;
};

export type ProjectMemberRoleRelationsFilterInput = {
  projectMember?: InputMaybe<ProjectMemberFindInput>;
};

export type ProjectMemberRoleSortInput = {
  id?: InputMaybe<SortDirection>;
  projectMemberId?: InputMaybe<SortDirection>;
  roleCode?: InputMaybe<SortDirection>;
};

export type ProjectMemberRoleUpdateInput = {
  projectMemberId?: InputMaybe<Scalars['ID']>;
  roleCode?: InputMaybe<RoleCode>;
};

export type ProjectMemberSortInput = {
  contributions?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  projectId?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
  userId?: InputMaybe<SortDirection>;
};

export type ProjectMemberUpdateInput = {
  contributions?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['Date']>;
  projectId?: InputMaybe<Scalars['ID']>;
  updatedAt?: InputMaybe<Scalars['Date']>;
  userId?: InputMaybe<Scalars['ID']>;
};

export type ProjectRelationsFilterInput = {
  invites?: InputMaybe<ProjectInviteFindInput>;
  members?: InputMaybe<ProjectMemberFindInput>;
};

export type ProjectSortInput = {
  access?: InputMaybe<SortDirection>;
  bannerLink?: InputMaybe<SortDirection>;
  cardImageLink?: InputMaybe<SortDirection>;
  completedAt?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  description?: InputMaybe<SortDirection>;
  downloadLinks?: InputMaybe<SortDirection>;
  galleryImageLinks?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  pitch?: InputMaybe<SortDirection>;
  soundcloudEmbedSrc?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

export type ProjectUpdateInput = {
  access?: InputMaybe<Access>;
  bannerLink?: InputMaybe<Scalars['String']>;
  cardImageLink?: InputMaybe<Scalars['String']>;
  completedAt?: InputMaybe<Scalars['Date']>;
  createdAt?: InputMaybe<Scalars['Date']>;
  description?: InputMaybe<Scalars['String']>;
  downloadLinks?: InputMaybe<Array<Scalars['String']>>;
  galleryImageLinks?: InputMaybe<Array<Scalars['String']>>;
  name?: InputMaybe<Scalars['String']>;
  pitch?: InputMaybe<Scalars['String']>;
  soundcloudEmbedSrc?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Date']>;
};

export type Query = {
  __typename?: 'Query';
  eBoardRoles: Array<EBoardRole>;
  eBoards: Array<EBoard>;
  isAuthTokenValid?: Maybe<Scalars['Boolean']>;
  projectInvites: Array<ProjectInvite>;
  projectMemberRoles: Array<ProjectMemberRole>;
  projectMembers: Array<ProjectMember>;
  projects: Array<Project>;
  securityContext?: Maybe<Scalars['Json']>;
  securityPolicy?: Maybe<Scalars['Json']>;
  userLoginIdentitys: Array<UserLoginIdentity>;
  userRoles: Array<UserRole>;
  userSocials: Array<UserSocial>;
  users: Array<User>;
};


export type QueryEBoardRolesArgs = {
  filter?: InputMaybe<EBoardRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<EBoardRoleRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<EBoardRoleSortInput>>;
};


export type QueryEBoardsArgs = {
  filter?: InputMaybe<EBoardFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<EBoardRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<EBoardSortInput>>;
};


export type QueryProjectInvitesArgs = {
  filter?: InputMaybe<ProjectInviteFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<ProjectInviteRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<ProjectInviteSortInput>>;
};


export type QueryProjectMemberRolesArgs = {
  filter?: InputMaybe<ProjectMemberRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<ProjectMemberRoleRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<ProjectMemberRoleSortInput>>;
};


export type QueryProjectMembersArgs = {
  filter?: InputMaybe<ProjectMemberFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<ProjectMemberRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<ProjectMemberSortInput>>;
};


export type QueryProjectsArgs = {
  filter?: InputMaybe<ProjectFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<ProjectRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<ProjectSortInput>>;
};


export type QuerySecurityContextArgs = {
  userId?: InputMaybe<Scalars['ID']>;
};


export type QueryUserLoginIdentitysArgs = {
  filter?: InputMaybe<UserLoginIdentityFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<UserLoginIdentityRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<UserLoginIdentitySortInput>>;
};


export type QueryUserRolesArgs = {
  filter?: InputMaybe<UserRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<UserRoleRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<UserRoleSortInput>>;
};


export type QueryUserSocialsArgs = {
  filter?: InputMaybe<UserSocialFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<UserSocialRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<UserSocialSortInput>>;
};


export type QueryUsersArgs = {
  filter?: InputMaybe<UserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<UserRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<UserSortInput>>;
};

export type RefPointer = {
  refFrom?: InputMaybe<Scalars['String']>;
  refTo?: InputMaybe<Scalars['String']>;
};

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
  Writer: 'WRITER'
} as const;

export type RoleCode = typeof RoleCode[keyof typeof RoleCode];
export type RoleCodeFilterInput = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<RoleCode>;
  exists?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<RoleCode>>;
  mode?: InputMaybe<StringFilterMode>;
  ne?: InputMaybe<RoleCode>;
  nin?: InputMaybe<Array<RoleCode>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export const SortDirection = {
  Asc: 'asc',
  Desc: 'desc'
} as const;

export type SortDirection = typeof SortDirection[keyof typeof SortDirection];
export type StringFilterInput = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Scalars['String']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  mode?: InputMaybe<StringFilterMode>;
  ne?: InputMaybe<Scalars['String']>;
  nin?: InputMaybe<Array<Scalars['String']>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export const StringFilterMode = {
  Insensitive: 'INSENSITIVE',
  Sensitive: 'SENSITIVE'
} as const;

export type StringFilterMode = typeof StringFilterMode[keyof typeof StringFilterMode];
export type UpdateProjectInput = {
  access?: InputMaybe<Access>;
  bannerLink?: InputMaybe<Scalars['String']>;
  cardImageLink?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  downloadLinks?: InputMaybe<Array<Scalars['String']>>;
  galleryImageLinks?: InputMaybe<Array<Scalars['String']>>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  pitch?: InputMaybe<Scalars['String']>;
  soundcloudEmbedSrc?: InputMaybe<Scalars['String']>;
};

export type UpdateProjectMemberInput = {
  contributions?: InputMaybe<Scalars['String']>;
  roles?: InputMaybe<Array<RoleCode>>;
};

export type UpdateUserInput = {
  avatar?: InputMaybe<UploadWithOperation>;
  banner?: InputMaybe<UploadWithOperation>;
  bio?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  roles?: InputMaybe<Array<RoleCode>>;
  socials?: InputMaybe<Array<UpdateUserSocialInput>>;
};

export type UpdateUserSocialInput = {
  link: Scalars['String'];
  platform: Scalars['String'];
  username: Scalars['String'];
};

export const UploadOperation = {
  Delete: 'DELETE',
  Insert: 'INSERT'
} as const;

export type UploadOperation = typeof UploadOperation[keyof typeof UploadOperation];
export type UploadWithOperation = {
  operation?: InputMaybe<UploadOperation>;
  upload?: InputMaybe<Scalars['Upload']>;
};

export type User = {
  __typename?: 'User';
  avatarLink?: Maybe<Scalars['String']>;
  bannerLink?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Date']>;
  displayName?: Maybe<Scalars['String']>;
  eboard?: Maybe<EBoard>;
  email: Scalars['String'];
  id: Scalars['ID'];
  loginIdentities: Array<UserLoginIdentity>;
  projectInvites: Array<ProjectInvite>;
  projectMembers: Array<ProjectMember>;
  roles: Array<UserRole>;
  socials: Array<UserSocial>;
  updatedAt?: Maybe<Scalars['Date']>;
  username?: Maybe<Scalars['String']>;
};

export type UserFilterInput = {
  and_?: InputMaybe<Array<UserFilterInput>>;
  avatarLink?: InputMaybe<StringFilterInput>;
  bannerLink?: InputMaybe<StringFilterInput>;
  bio?: InputMaybe<StringFilterInput>;
  createdAt?: InputMaybe<DateFilterInput>;
  displayName?: InputMaybe<StringFilterInput>;
  email?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  nor_?: InputMaybe<Array<UserFilterInput>>;
  or_?: InputMaybe<Array<UserFilterInput>>;
  updatedAt?: InputMaybe<DateFilterInput>;
  username?: InputMaybe<StringFilterInput>;
};

export type UserFindInput = {
  filter?: InputMaybe<UserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<UserRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<UserSortInput>>;
};

export type UserInsertInput = {
  avatarLink?: InputMaybe<Scalars['String']>;
  bannerLink?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['Date']>;
  displayName?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  updatedAt?: InputMaybe<Scalars['Date']>;
  username?: InputMaybe<Scalars['String']>;
};

export type UserLoginIdentity = {
  __typename?: 'UserLoginIdentity';
  data?: Maybe<Scalars['Json']>;
  id: Scalars['ID'];
  identityId: Scalars['String'];
  name: Scalars['String'];
  user: User;
  userId: Scalars['ID'];
};

export type UserLoginIdentityFilterInput = {
  and_?: InputMaybe<Array<UserLoginIdentityFilterInput>>;
  data?: InputMaybe<JsonFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  identityId?: InputMaybe<StringFilterInput>;
  name?: InputMaybe<StringFilterInput>;
  nor_?: InputMaybe<Array<UserLoginIdentityFilterInput>>;
  or_?: InputMaybe<Array<UserLoginIdentityFilterInput>>;
  userId?: InputMaybe<IdFilterInput>;
};

export type UserLoginIdentityFindInput = {
  filter?: InputMaybe<UserLoginIdentityFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<UserLoginIdentityRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<UserLoginIdentitySortInput>>;
};

export type UserLoginIdentityInsertInput = {
  data?: InputMaybe<Scalars['Json']>;
  identityId: Scalars['String'];
  name: Scalars['String'];
  userId: Scalars['ID'];
};

export type UserLoginIdentityRelationsFilterInput = {
  user?: InputMaybe<UserFindInput>;
};

export type UserLoginIdentitySortInput = {
  data?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  identityId?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  userId?: InputMaybe<SortDirection>;
};

export type UserLoginIdentityUpdateInput = {
  data?: InputMaybe<Scalars['Json']>;
  identityId?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['ID']>;
};

export type UserRelationsFilterInput = {
  eboard?: InputMaybe<EBoardFindInput>;
  loginIdentities?: InputMaybe<UserLoginIdentityFindInput>;
  projectInvites?: InputMaybe<ProjectInviteFindInput>;
  projectMembers?: InputMaybe<ProjectMemberFindInput>;
  roles?: InputMaybe<UserRoleFindInput>;
  socials?: InputMaybe<UserSocialFindInput>;
};

export type UserRole = {
  __typename?: 'UserRole';
  id: Scalars['ID'];
  roleCode: RoleCode;
  user: User;
  userId: Scalars['ID'];
};

export type UserRoleFilterInput = {
  and_?: InputMaybe<Array<UserRoleFilterInput>>;
  id?: InputMaybe<IdFilterInput>;
  nor_?: InputMaybe<Array<UserRoleFilterInput>>;
  or_?: InputMaybe<Array<UserRoleFilterInput>>;
  roleCode?: InputMaybe<RoleCodeFilterInput>;
  userId?: InputMaybe<IdFilterInput>;
};

export type UserRoleFindInput = {
  filter?: InputMaybe<UserRoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<UserRoleRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<UserRoleSortInput>>;
};

export type UserRoleInsertInput = {
  roleCode: RoleCode;
  userId: Scalars['ID'];
};

export type UserRoleRelationsFilterInput = {
  user?: InputMaybe<UserFindInput>;
};

export type UserRoleSortInput = {
  id?: InputMaybe<SortDirection>;
  roleCode?: InputMaybe<SortDirection>;
  userId?: InputMaybe<SortDirection>;
};

export type UserRoleUpdateInput = {
  roleCode?: InputMaybe<RoleCode>;
  userId?: InputMaybe<Scalars['ID']>;
};

export type UserSocial = {
  __typename?: 'UserSocial';
  id: Scalars['ID'];
  link: Scalars['String'];
  platform: Scalars['String'];
  user: User;
  userId: Scalars['ID'];
  username: Scalars['String'];
};

export type UserSocialFilterInput = {
  and_?: InputMaybe<Array<UserSocialFilterInput>>;
  id?: InputMaybe<IdFilterInput>;
  link?: InputMaybe<StringFilterInput>;
  nor_?: InputMaybe<Array<UserSocialFilterInput>>;
  or_?: InputMaybe<Array<UserSocialFilterInput>>;
  platform?: InputMaybe<StringFilterInput>;
  userId?: InputMaybe<IdFilterInput>;
  username?: InputMaybe<StringFilterInput>;
};

export type UserSocialFindInput = {
  filter?: InputMaybe<UserSocialFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  relations?: InputMaybe<UserSocialRelationsFilterInput>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<UserSocialSortInput>>;
};

export type UserSocialInsertInput = {
  link: Scalars['String'];
  platform: Scalars['String'];
  userId: Scalars['ID'];
  username: Scalars['String'];
};

export type UserSocialRelationsFilterInput = {
  user?: InputMaybe<UserFindInput>;
};

export type UserSocialSortInput = {
  id?: InputMaybe<SortDirection>;
  link?: InputMaybe<SortDirection>;
  platform?: InputMaybe<SortDirection>;
  userId?: InputMaybe<SortDirection>;
  username?: InputMaybe<SortDirection>;
};

export type UserSocialUpdateInput = {
  link?: InputMaybe<Scalars['String']>;
  platform?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['ID']>;
  username?: InputMaybe<Scalars['String']>;
};

export type UserSortInput = {
  avatarLink?: InputMaybe<SortDirection>;
  bannerLink?: InputMaybe<SortDirection>;
  bio?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  displayName?: InputMaybe<SortDirection>;
  email?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
  username?: InputMaybe<SortDirection>;
};

export type UserUpdateInput = {
  avatarLink?: InputMaybe<Scalars['String']>;
  bannerLink?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['Date']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Date']>;
  username?: InputMaybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Access: Access;
  AccessFilterInput: AccessFilterInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  BooleanFilterInput: BooleanFilterInput;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateFilterInput: DateFilterInput;
  EBoard: ResolverTypeWrapper<EBoard>;
  EBoardFilterInput: EBoardFilterInput;
  EBoardFindInput: EBoardFindInput;
  EBoardInsertInput: EBoardInsertInput;
  EBoardRelationsFilterInput: EBoardRelationsFilterInput;
  EBoardRole: ResolverTypeWrapper<EBoardRole>;
  EBoardRoleFilterInput: EBoardRoleFilterInput;
  EBoardRoleFindInput: EBoardRoleFindInput;
  EBoardRoleInsertInput: EBoardRoleInsertInput;
  EBoardRoleRelationsFilterInput: EBoardRoleRelationsFilterInput;
  EBoardRoleSortInput: EBoardRoleSortInput;
  EBoardRoleUpdateInput: EBoardRoleUpdateInput;
  EBoardSortInput: EBoardSortInput;
  EBoardUpdateInput: EBoardUpdateInput;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  FloatFilterInput: FloatFilterInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  IDFilterInput: IdFilterInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  IntFilterInput: IntFilterInput;
  InviteType: InviteType;
  InviteTypeFilterInput: InviteTypeFilterInput;
  Json: ResolverTypeWrapper<Scalars['Json']>;
  JsonFilterInput: JsonFilterInput;
  KeyValue: KeyValue;
  Mutation: ResolverTypeWrapper<{}>;
  NewProjectInput: NewProjectInput;
  NewProjectInviteInput: NewProjectInviteInput;
  NewProjectMemberRoleInput: NewProjectMemberRoleInput;
  NewUserRoleInput: NewUserRoleInput;
  Permission: Permission;
  PermissionFilterInput: PermissionFilterInput;
  Project: ResolverTypeWrapper<Project>;
  ProjectFilterInput: ProjectFilterInput;
  ProjectFindInput: ProjectFindInput;
  ProjectInsertInput: ProjectInsertInput;
  ProjectInvite: ResolverTypeWrapper<ProjectInvite>;
  ProjectInviteFilterInput: ProjectInviteFilterInput;
  ProjectInviteFindInput: ProjectInviteFindInput;
  ProjectInviteInsertInput: ProjectInviteInsertInput;
  ProjectInviteRelationsFilterInput: ProjectInviteRelationsFilterInput;
  ProjectInviteSortInput: ProjectInviteSortInput;
  ProjectInviteUpdateInput: ProjectInviteUpdateInput;
  ProjectMember: ResolverTypeWrapper<ProjectMember>;
  ProjectMemberFilterInput: ProjectMemberFilterInput;
  ProjectMemberFindInput: ProjectMemberFindInput;
  ProjectMemberInsertInput: ProjectMemberInsertInput;
  ProjectMemberRelationsFilterInput: ProjectMemberRelationsFilterInput;
  ProjectMemberRole: ResolverTypeWrapper<ProjectMemberRole>;
  ProjectMemberRoleFilterInput: ProjectMemberRoleFilterInput;
  ProjectMemberRoleFindInput: ProjectMemberRoleFindInput;
  ProjectMemberRoleInsertInput: ProjectMemberRoleInsertInput;
  ProjectMemberRoleRelationsFilterInput: ProjectMemberRoleRelationsFilterInput;
  ProjectMemberRoleSortInput: ProjectMemberRoleSortInput;
  ProjectMemberRoleUpdateInput: ProjectMemberRoleUpdateInput;
  ProjectMemberSortInput: ProjectMemberSortInput;
  ProjectMemberUpdateInput: ProjectMemberUpdateInput;
  ProjectRelationsFilterInput: ProjectRelationsFilterInput;
  ProjectSortInput: ProjectSortInput;
  ProjectUpdateInput: ProjectUpdateInput;
  Query: ResolverTypeWrapper<{}>;
  RefPointer: RefPointer;
  RoleCode: RoleCode;
  RoleCodeFilterInput: RoleCodeFilterInput;
  SortDirection: SortDirection;
  String: ResolverTypeWrapper<Scalars['String']>;
  StringFilterInput: StringFilterInput;
  StringFilterMode: StringFilterMode;
  UpdateProjectInput: UpdateProjectInput;
  UpdateProjectMemberInput: UpdateProjectMemberInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserSocialInput: UpdateUserSocialInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  UploadOperation: UploadOperation;
  UploadWithOperation: UploadWithOperation;
  User: ResolverTypeWrapper<User>;
  UserFilterInput: UserFilterInput;
  UserFindInput: UserFindInput;
  UserInsertInput: UserInsertInput;
  UserLoginIdentity: ResolverTypeWrapper<UserLoginIdentity>;
  UserLoginIdentityFilterInput: UserLoginIdentityFilterInput;
  UserLoginIdentityFindInput: UserLoginIdentityFindInput;
  UserLoginIdentityInsertInput: UserLoginIdentityInsertInput;
  UserLoginIdentityRelationsFilterInput: UserLoginIdentityRelationsFilterInput;
  UserLoginIdentitySortInput: UserLoginIdentitySortInput;
  UserLoginIdentityUpdateInput: UserLoginIdentityUpdateInput;
  UserRelationsFilterInput: UserRelationsFilterInput;
  UserRole: ResolverTypeWrapper<UserRole>;
  UserRoleFilterInput: UserRoleFilterInput;
  UserRoleFindInput: UserRoleFindInput;
  UserRoleInsertInput: UserRoleInsertInput;
  UserRoleRelationsFilterInput: UserRoleRelationsFilterInput;
  UserRoleSortInput: UserRoleSortInput;
  UserRoleUpdateInput: UserRoleUpdateInput;
  UserSocial: ResolverTypeWrapper<UserSocial>;
  UserSocialFilterInput: UserSocialFilterInput;
  UserSocialFindInput: UserSocialFindInput;
  UserSocialInsertInput: UserSocialInsertInput;
  UserSocialRelationsFilterInput: UserSocialRelationsFilterInput;
  UserSocialSortInput: UserSocialSortInput;
  UserSocialUpdateInput: UserSocialUpdateInput;
  UserSortInput: UserSortInput;
  UserUpdateInput: UserUpdateInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AccessFilterInput: AccessFilterInput;
  Boolean: Scalars['Boolean'];
  BooleanFilterInput: BooleanFilterInput;
  Date: Scalars['Date'];
  DateFilterInput: DateFilterInput;
  EBoard: EBoard;
  EBoardFilterInput: EBoardFilterInput;
  EBoardFindInput: EBoardFindInput;
  EBoardInsertInput: EBoardInsertInput;
  EBoardRelationsFilterInput: EBoardRelationsFilterInput;
  EBoardRole: EBoardRole;
  EBoardRoleFilterInput: EBoardRoleFilterInput;
  EBoardRoleFindInput: EBoardRoleFindInput;
  EBoardRoleInsertInput: EBoardRoleInsertInput;
  EBoardRoleRelationsFilterInput: EBoardRoleRelationsFilterInput;
  EBoardRoleSortInput: EBoardRoleSortInput;
  EBoardRoleUpdateInput: EBoardRoleUpdateInput;
  EBoardSortInput: EBoardSortInput;
  EBoardUpdateInput: EBoardUpdateInput;
  Float: Scalars['Float'];
  FloatFilterInput: FloatFilterInput;
  ID: Scalars['ID'];
  IDFilterInput: IdFilterInput;
  Int: Scalars['Int'];
  IntFilterInput: IntFilterInput;
  InviteTypeFilterInput: InviteTypeFilterInput;
  Json: Scalars['Json'];
  JsonFilterInput: JsonFilterInput;
  KeyValue: KeyValue;
  Mutation: {};
  NewProjectInput: NewProjectInput;
  NewProjectInviteInput: NewProjectInviteInput;
  NewProjectMemberRoleInput: NewProjectMemberRoleInput;
  NewUserRoleInput: NewUserRoleInput;
  PermissionFilterInput: PermissionFilterInput;
  Project: Project;
  ProjectFilterInput: ProjectFilterInput;
  ProjectFindInput: ProjectFindInput;
  ProjectInsertInput: ProjectInsertInput;
  ProjectInvite: ProjectInvite;
  ProjectInviteFilterInput: ProjectInviteFilterInput;
  ProjectInviteFindInput: ProjectInviteFindInput;
  ProjectInviteInsertInput: ProjectInviteInsertInput;
  ProjectInviteRelationsFilterInput: ProjectInviteRelationsFilterInput;
  ProjectInviteSortInput: ProjectInviteSortInput;
  ProjectInviteUpdateInput: ProjectInviteUpdateInput;
  ProjectMember: ProjectMember;
  ProjectMemberFilterInput: ProjectMemberFilterInput;
  ProjectMemberFindInput: ProjectMemberFindInput;
  ProjectMemberInsertInput: ProjectMemberInsertInput;
  ProjectMemberRelationsFilterInput: ProjectMemberRelationsFilterInput;
  ProjectMemberRole: ProjectMemberRole;
  ProjectMemberRoleFilterInput: ProjectMemberRoleFilterInput;
  ProjectMemberRoleFindInput: ProjectMemberRoleFindInput;
  ProjectMemberRoleInsertInput: ProjectMemberRoleInsertInput;
  ProjectMemberRoleRelationsFilterInput: ProjectMemberRoleRelationsFilterInput;
  ProjectMemberRoleSortInput: ProjectMemberRoleSortInput;
  ProjectMemberRoleUpdateInput: ProjectMemberRoleUpdateInput;
  ProjectMemberSortInput: ProjectMemberSortInput;
  ProjectMemberUpdateInput: ProjectMemberUpdateInput;
  ProjectRelationsFilterInput: ProjectRelationsFilterInput;
  ProjectSortInput: ProjectSortInput;
  ProjectUpdateInput: ProjectUpdateInput;
  Query: {};
  RefPointer: RefPointer;
  RoleCodeFilterInput: RoleCodeFilterInput;
  String: Scalars['String'];
  StringFilterInput: StringFilterInput;
  UpdateProjectInput: UpdateProjectInput;
  UpdateProjectMemberInput: UpdateProjectMemberInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserSocialInput: UpdateUserSocialInput;
  Upload: Scalars['Upload'];
  UploadWithOperation: UploadWithOperation;
  User: User;
  UserFilterInput: UserFilterInput;
  UserFindInput: UserFindInput;
  UserInsertInput: UserInsertInput;
  UserLoginIdentity: UserLoginIdentity;
  UserLoginIdentityFilterInput: UserLoginIdentityFilterInput;
  UserLoginIdentityFindInput: UserLoginIdentityFindInput;
  UserLoginIdentityInsertInput: UserLoginIdentityInsertInput;
  UserLoginIdentityRelationsFilterInput: UserLoginIdentityRelationsFilterInput;
  UserLoginIdentitySortInput: UserLoginIdentitySortInput;
  UserLoginIdentityUpdateInput: UserLoginIdentityUpdateInput;
  UserRelationsFilterInput: UserRelationsFilterInput;
  UserRole: UserRole;
  UserRoleFilterInput: UserRoleFilterInput;
  UserRoleFindInput: UserRoleFindInput;
  UserRoleInsertInput: UserRoleInsertInput;
  UserRoleRelationsFilterInput: UserRoleRelationsFilterInput;
  UserRoleSortInput: UserRoleSortInput;
  UserRoleUpdateInput: UserRoleUpdateInput;
  UserSocial: UserSocial;
  UserSocialFilterInput: UserSocialFilterInput;
  UserSocialFindInput: UserSocialFindInput;
  UserSocialInsertInput: UserSocialInsertInput;
  UserSocialRelationsFilterInput: UserSocialRelationsFilterInput;
  UserSocialSortInput: UserSocialSortInput;
  UserSocialUpdateInput: UserSocialUpdateInput;
  UserSortInput: UserSortInput;
  UserUpdateInput: UserUpdateInput;
};

export type AliasDirectiveArgs = {
  value: Scalars['String'];
};

export type AliasDirectiveResolver<Result, Parent, ContextType = any, Args = AliasDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type DefaultDirectiveArgs = {
  from?: Maybe<Scalars['String']>;
};

export type DefaultDirectiveResolver<Result, Parent, ContextType = any, Args = DefaultDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = { };

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = any, Args = EmbeddedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = { };

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ExcludeDirectiveArgs = { };

export type ExcludeDirectiveResolver<Result, Parent, ContextType = any, Args = ExcludeDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ForeignRefDirectiveArgs = {
  refFrom?: Maybe<Scalars['String']>;
  refTo?: Maybe<Scalars['String']>;
};

export type ForeignRefDirectiveResolver<Result, Parent, ContextType = any, Args = ForeignRefDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = {
  from?: Maybe<Scalars['String']>;
};

export type IdDirectiveResolver<Result, Parent, ContextType = any, Args = IdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type InnerRefDirectiveArgs = {
  refFrom?: Maybe<Scalars['String']>;
  refTo?: Maybe<Scalars['String']>;
};

export type InnerRefDirectiveResolver<Result, Parent, ContextType = any, Args = InnerRefDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MemoryDirectiveArgs = { };

export type MemoryDirectiveResolver<Result, Parent, ContextType = any, Args = MemoryDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MongodbDirectiveArgs = {
  collection?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
};

export type MongodbDirectiveResolver<Result, Parent, ContextType = any, Args = MongodbDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type QuantitativeDirectiveArgs = { };

export type QuantitativeDirectiveResolver<Result, Parent, ContextType = any, Args = QuantitativeDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type RelationEntityRefDirectiveArgs = {
  entity: Scalars['String'];
  refOther?: Maybe<RefPointer>;
  refThis?: Maybe<RefPointer>;
};

export type RelationEntityRefDirectiveResolver<Result, Parent, ContextType = any, Args = RelationEntityRefDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type SchemaDirectiveArgs = {
  metadata: Array<KeyValue>;
};

export type SchemaDirectiveResolver<Result, Parent, ContextType = any, Args = SchemaDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type SqlDirectiveArgs = {
  source?: Maybe<Scalars['String']>;
  table?: Maybe<Scalars['String']>;
};

export type SqlDirectiveResolver<Result, Parent, ContextType = any, Args = SqlDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type TextualDirectiveArgs = { };

export type TextualDirectiveResolver<Result, Parent, ContextType = any, Args = TextualDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type EBoardResolvers<ContextType = any, ParentType extends ResolversParentTypes['EBoard'] = ResolversParentTypes['EBoard']> = {
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  graduatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['EBoardRole']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EBoardRoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['EBoardRole'] = ResolversParentTypes['EBoardRole']> = {
  eboard?: Resolver<ResolversTypes['EBoard'], ParentType, ContextType>;
  eboardId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  roleCode?: Resolver<ResolversTypes['RoleCode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Json'], any> {
  name: 'Json';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  acceptProjectInvite?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationAcceptProjectInviteArgs, 'inviteId'>>;
  createEBoard?: Resolver<ResolversTypes['EBoard'], ParentType, ContextType, RequireFields<MutationCreateEBoardArgs, 'record'>>;
  createEBoardRole?: Resolver<ResolversTypes['EBoardRole'], ParentType, ContextType, RequireFields<MutationCreateEBoardRoleArgs, 'record'>>;
  createProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationCreateProjectArgs, 'record'>>;
  createProjectInvite?: Resolver<ResolversTypes['ProjectInvite'], ParentType, ContextType, RequireFields<MutationCreateProjectInviteArgs, 'record'>>;
  createProjectMember?: Resolver<ResolversTypes['ProjectMember'], ParentType, ContextType, RequireFields<MutationCreateProjectMemberArgs, 'record'>>;
  createProjectMemberRole?: Resolver<ResolversTypes['ProjectMemberRole'], ParentType, ContextType, RequireFields<MutationCreateProjectMemberRoleArgs, 'record'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'record'>>;
  createUserLoginIdentity?: Resolver<ResolversTypes['UserLoginIdentity'], ParentType, ContextType, RequireFields<MutationCreateUserLoginIdentityArgs, 'record'>>;
  createUserRole?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType, RequireFields<MutationCreateUserRoleArgs, 'record'>>;
  createUserSocial?: Resolver<ResolversTypes['UserSocial'], ParentType, ContextType, RequireFields<MutationCreateUserSocialArgs, 'record'>>;
  deleteEBoardRoles?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteEBoardRolesArgs, 'filter'>>;
  deleteEBoards?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteEBoardsArgs, 'filter'>>;
  deleteProject?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectArgs, 'id'>>;
  deleteProjectInvite?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectInviteArgs, 'inviteId'>>;
  deleteProjectInvites?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectInvitesArgs, 'filter'>>;
  deleteProjectMember?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectMemberArgs, 'id'>>;
  deleteProjectMemberRole?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectMemberRoleArgs, 'id'>>;
  deleteProjectMemberRoles?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectMemberRolesArgs, 'filter'>>;
  deleteProjectMembers?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectMembersArgs, 'filter'>>;
  deleteProjects?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectsArgs, 'filter'>>;
  deleteUserLoginIdentitys?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUserLoginIdentitysArgs, 'filter'>>;
  deleteUserRole?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUserRoleArgs, 'id'>>;
  deleteUserRoles?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUserRolesArgs, 'filter'>>;
  deleteUserSocials?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUserSocialsArgs, 'filter'>>;
  deleteUsers?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUsersArgs, 'filter'>>;
  joinOpenProject?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationJoinOpenProjectArgs, 'projectId'>>;
  newProject?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationNewProjectArgs, 'input'>>;
  newProjectInvite?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationNewProjectInviteArgs, 'input'>>;
  newProjectMemberRole?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationNewProjectMemberRoleArgs, 'input'>>;
  newUserRole?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationNewUserRoleArgs, 'input'>>;
  updateEBoardRoles?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateEBoardRolesArgs, 'changes' | 'filter'>>;
  updateEBoards?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateEBoardsArgs, 'changes' | 'filter'>>;
  updateProject?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateProjectArgs, 'input'>>;
  updateProjectInvites?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateProjectInvitesArgs, 'changes' | 'filter'>>;
  updateProjectMember?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateProjectMemberArgs, 'input'>>;
  updateProjectMemberRoles?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateProjectMemberRolesArgs, 'changes' | 'filter'>>;
  updateProjectMembers?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateProjectMembersArgs, 'changes' | 'filter'>>;
  updateProjects?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateProjectsArgs, 'changes' | 'filter'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
  updateUserLoginIdentitys?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserLoginIdentitysArgs, 'changes' | 'filter'>>;
  updateUserRoles?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserRolesArgs, 'changes' | 'filter'>>;
  updateUserSocials?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserSocialsArgs, 'changes' | 'filter'>>;
  updateUsers?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUsersArgs, 'changes' | 'filter'>>;
};

export type ProjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  access?: Resolver<ResolversTypes['Access'], ParentType, ContextType>;
  bannerLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cardImageLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  completedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  downloadLinks?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  galleryImageLinks?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invites?: Resolver<Array<ResolversTypes['ProjectInvite']>, ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['ProjectMember']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pitch?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  soundcloudEmbedSrc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectInviteResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectInvite'] = ResolversParentTypes['ProjectInvite']> = {
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['InviteType'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectMemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectMember'] = ResolversParentTypes['ProjectMember']> = {
  contributions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['ProjectMemberRole']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectMemberRoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectMemberRole'] = ResolversParentTypes['ProjectMemberRole']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  projectMember?: Resolver<ResolversTypes['ProjectMember'], ParentType, ContextType>;
  projectMemberId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  roleCode?: Resolver<ResolversTypes['RoleCode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  eBoardRoles?: Resolver<Array<ResolversTypes['EBoardRole']>, ParentType, ContextType, Partial<QueryEBoardRolesArgs>>;
  eBoards?: Resolver<Array<ResolversTypes['EBoard']>, ParentType, ContextType, Partial<QueryEBoardsArgs>>;
  isAuthTokenValid?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  projectInvites?: Resolver<Array<ResolversTypes['ProjectInvite']>, ParentType, ContextType, Partial<QueryProjectInvitesArgs>>;
  projectMemberRoles?: Resolver<Array<ResolversTypes['ProjectMemberRole']>, ParentType, ContextType, Partial<QueryProjectMemberRolesArgs>>;
  projectMembers?: Resolver<Array<ResolversTypes['ProjectMember']>, ParentType, ContextType, Partial<QueryProjectMembersArgs>>;
  projects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType, Partial<QueryProjectsArgs>>;
  securityContext?: Resolver<Maybe<ResolversTypes['Json']>, ParentType, ContextType, Partial<QuerySecurityContextArgs>>;
  securityPolicy?: Resolver<Maybe<ResolversTypes['Json']>, ParentType, ContextType>;
  userLoginIdentitys?: Resolver<Array<ResolversTypes['UserLoginIdentity']>, ParentType, ContextType, Partial<QueryUserLoginIdentitysArgs>>;
  userRoles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType, Partial<QueryUserRolesArgs>>;
  userSocials?: Resolver<Array<ResolversTypes['UserSocial']>, ParentType, ContextType, Partial<QueryUserSocialsArgs>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryUsersArgs>>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatarLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bannerLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  eboard?: Resolver<Maybe<ResolversTypes['EBoard']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  loginIdentities?: Resolver<Array<ResolversTypes['UserLoginIdentity']>, ParentType, ContextType>;
  projectInvites?: Resolver<Array<ResolversTypes['ProjectInvite']>, ParentType, ContextType>;
  projectMembers?: Resolver<Array<ResolversTypes['ProjectMember']>, ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType>;
  socials?: Resolver<Array<ResolversTypes['UserSocial']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserLoginIdentityResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserLoginIdentity'] = ResolversParentTypes['UserLoginIdentity']> = {
  data?: Resolver<Maybe<ResolversTypes['Json']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  identityId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserRoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserRole'] = ResolversParentTypes['UserRole']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  roleCode?: Resolver<ResolversTypes['RoleCode'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserSocialResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserSocial'] = ResolversParentTypes['UserSocial']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  link?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  platform?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType;
  EBoard?: EBoardResolvers<ContextType>;
  EBoardRole?: EBoardRoleResolvers<ContextType>;
  Json?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  ProjectInvite?: ProjectInviteResolvers<ContextType>;
  ProjectMember?: ProjectMemberResolvers<ContextType>;
  ProjectMemberRole?: ProjectMemberRoleResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserLoginIdentity?: UserLoginIdentityResolvers<ContextType>;
  UserRole?: UserRoleResolvers<ContextType>;
  UserSocial?: UserSocialResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  alias?: AliasDirectiveResolver<any, any, ContextType>;
  default?: DefaultDirectiveResolver<any, any, ContextType>;
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  exclude?: ExcludeDirectiveResolver<any, any, ContextType>;
  foreignRef?: ForeignRefDirectiveResolver<any, any, ContextType>;
  id?: IdDirectiveResolver<any, any, ContextType>;
  innerRef?: InnerRefDirectiveResolver<any, any, ContextType>;
  memory?: MemoryDirectiveResolver<any, any, ContextType>;
  mongodb?: MongodbDirectiveResolver<any, any, ContextType>;
  quantitative?: QuantitativeDirectiveResolver<any, any, ContextType>;
  relationEntityRef?: RelationEntityRefDirectiveResolver<any, any, ContextType>;
  schema?: SchemaDirectiveResolver<any, any, ContextType>;
  sql?: SqlDirectiveResolver<any, any, ContextType>;
  textual?: TextualDirectiveResolver<any, any, ContextType>;
};
