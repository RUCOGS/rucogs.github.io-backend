import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
};

export type BooleanFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<Scalars['Boolean']>>;
  ne?: InputMaybe<Scalars['Boolean']>;
  nin?: InputMaybe<Array<Scalars['Boolean']>>;
};

export type BooleanType = {
  __typename?: 'BooleanType';
  boolean?: Maybe<Scalars['Boolean']>;
};

export type DateFilterInput = {
  eq?: InputMaybe<Scalars['Date']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<Scalars['Date']>>;
  ne?: InputMaybe<Scalars['Date']>;
  nin?: InputMaybe<Array<Scalars['Date']>>;
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

export type JsonFilterInput = {
  eq?: InputMaybe<Scalars['Json']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<Scalars['Json']>>;
  ne?: InputMaybe<Scalars['Json']>;
  nin?: InputMaybe<Array<Scalars['Json']>>;
};

export type JsonType = {
  __typename?: 'JsonType';
  json?: Maybe<Scalars['Json']>;
};

export type KeyValue = {
  key: Scalars['String'];
  value: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createProject: Project;
  createProjectMember: ProjectMember;
  createProjectMemberRole: ProjectMemberRole;
  createRole: Role;
  createUser: User;
  createUserLoginIdentity: UserLoginIdentity;
  createUserRole: UserRole;
  createUserSocial: UserSocial;
  deleteProjectMemberRoles?: Maybe<Scalars['Boolean']>;
  deleteProjectMembers?: Maybe<Scalars['Boolean']>;
  deleteProjects?: Maybe<Scalars['Boolean']>;
  deleteRoles?: Maybe<Scalars['Boolean']>;
  deleteUserLoginIdentitys?: Maybe<Scalars['Boolean']>;
  deleteUserRoles?: Maybe<Scalars['Boolean']>;
  deleteUserSocials?: Maybe<Scalars['Boolean']>;
  deleteUsers?: Maybe<Scalars['Boolean']>;
  updateProjectMemberRoles?: Maybe<Scalars['Boolean']>;
  updateProjectMembers?: Maybe<Scalars['Boolean']>;
  updateProjects?: Maybe<Scalars['Boolean']>;
  updateRoles?: Maybe<Scalars['Boolean']>;
  updateUserLoginIdentitys?: Maybe<Scalars['Boolean']>;
  updateUserRoles?: Maybe<Scalars['Boolean']>;
  updateUserSocials?: Maybe<Scalars['Boolean']>;
  updateUsers?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateProjectArgs = {
  record: ProjectInsertInput;
};


export type MutationCreateProjectMemberArgs = {
  record: ProjectMemberInsertInput;
};


export type MutationCreateProjectMemberRoleArgs = {
  record: ProjectMemberRoleInsertInput;
};


export type MutationCreateRoleArgs = {
  record: RoleInsertInput;
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


export type MutationDeleteProjectMemberRolesArgs = {
  filter: ProjectMemberRoleFilterInput;
};


export type MutationDeleteProjectMembersArgs = {
  filter: ProjectMemberFilterInput;
};


export type MutationDeleteProjectsArgs = {
  filter: ProjectFilterInput;
};


export type MutationDeleteRolesArgs = {
  filter: RoleFilterInput;
};


export type MutationDeleteUserLoginIdentitysArgs = {
  filter: UserLoginIdentityFilterInput;
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


export type MutationUpdateRolesArgs = {
  changes: RoleUpdateInput;
  filter: RoleFilterInput;
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

export enum Permission {
  CreateProject = 'CREATE_PROJECT',
  DeleteProfile = 'DELETE_PROFILE',
  DeleteProject = 'DELETE_PROJECT',
  ManageProjectMemberRoles = 'MANAGE_PROJECT_MEMBER_ROLES',
  ManageUserRoles = 'MANAGE_USER_ROLES',
  ReadProfilePrivate = 'READ_PROFILE_PRIVATE',
  UpdateProfile = 'UPDATE_PROFILE',
  UpdateProject = 'UPDATE_PROJECT'
}

export type PermissionDomains = BooleanType | SecurityDomains;

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

export type PermissionOperationDomain = BooleanType | JsonType;

export type Project = {
  __typename?: 'Project';
  bannerLink?: Maybe<Scalars['String']>;
  cardImageLink?: Maybe<Scalars['String']>;
  completedAt?: Maybe<Scalars['Date']>;
  createdAt: Scalars['Date'];
  description: Scalars['String'];
  downloadLinks: Array<Scalars['String']>;
  galleryImageLinks: Array<Scalars['String']>;
  id: Scalars['ID'];
  members?: Maybe<Array<ProjectMember>>;
  name: Scalars['String'];
  soundcloudEmbedSrc?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Date'];
};

export type ProjectFilterInput = {
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
  bannerLink?: InputMaybe<Scalars['String']>;
  cardImageLink?: InputMaybe<Scalars['String']>;
  completedAt?: InputMaybe<Scalars['Date']>;
  createdAt?: InputMaybe<Scalars['Date']>;
  description: Scalars['String'];
  downloadLinks: Array<Scalars['String']>;
  galleryImageLinks: Array<Scalars['String']>;
  name: Scalars['String'];
  soundcloudEmbedSrc?: InputMaybe<Scalars['String']>;
  updatedAt: Scalars['Date'];
};

export type ProjectMember = {
  __typename?: 'ProjectMember';
  contributions: Scalars['String'];
  id: Scalars['ID'];
  project: Project;
  projectId: Scalars['ID'];
  roles: Array<ProjectMemberRole>;
  user: User;
  userId: Scalars['ID'];
};

export type ProjectMemberFilterInput = {
  and_?: InputMaybe<Array<ProjectMemberFilterInput>>;
  contributions?: InputMaybe<StringFilterInput>;
  id?: InputMaybe<IdFilterInput>;
  nor_?: InputMaybe<Array<ProjectMemberFilterInput>>;
  or_?: InputMaybe<Array<ProjectMemberFilterInput>>;
  projectId?: InputMaybe<IdFilterInput>;
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
  contributions: Scalars['String'];
  projectId: Scalars['ID'];
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
  role: Role;
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
  role?: InputMaybe<RoleFindInput>;
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
  id?: InputMaybe<SortDirection>;
  projectId?: InputMaybe<SortDirection>;
  userId?: InputMaybe<SortDirection>;
};

export type ProjectMemberUpdateInput = {
  contributions?: InputMaybe<Scalars['String']>;
  projectId?: InputMaybe<Scalars['ID']>;
  userId?: InputMaybe<Scalars['ID']>;
};

export type ProjectRelationsFilterInput = {
  members?: InputMaybe<ProjectMemberFindInput>;
};

export type ProjectSortInput = {
  bannerLink?: InputMaybe<SortDirection>;
  cardImageLink?: InputMaybe<SortDirection>;
  completedAt?: InputMaybe<SortDirection>;
  createdAt?: InputMaybe<SortDirection>;
  description?: InputMaybe<SortDirection>;
  downloadLinks?: InputMaybe<SortDirection>;
  galleryImageLinks?: InputMaybe<SortDirection>;
  id?: InputMaybe<SortDirection>;
  name?: InputMaybe<SortDirection>;
  soundcloudEmbedSrc?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

export type ProjectUpdateInput = {
  bannerLink?: InputMaybe<Scalars['String']>;
  cardImageLink?: InputMaybe<Scalars['String']>;
  completedAt?: InputMaybe<Scalars['Date']>;
  createdAt?: InputMaybe<Scalars['Date']>;
  description?: InputMaybe<Scalars['String']>;
  downloadLinks?: InputMaybe<Array<Scalars['String']>>;
  galleryImageLinks?: InputMaybe<Array<Scalars['String']>>;
  name?: InputMaybe<Scalars['String']>;
  soundcloudEmbedSrc?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Date']>;
};

export type Query = {
  __typename?: 'Query';
  getSecurityContext?: Maybe<SecurityContext>;
  projectMemberRoles: Array<ProjectMemberRole>;
  projectMembers: Array<ProjectMember>;
  projects: Array<Project>;
  roles: Array<Role>;
  userLoginIdentitys: Array<UserLoginIdentity>;
  userRoles: Array<UserRole>;
  userSocials: Array<UserSocial>;
  users: Array<User>;
};


export type QueryGetSecurityContextArgs = {
  userId?: InputMaybe<Scalars['ID']>;
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


export type QueryRolesArgs = {
  filter?: InputMaybe<RoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<RoleSortInput>>;
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

export type Role = {
  __typename?: 'Role';
  code: RoleCode;
  permissions: Array<Maybe<Permission>>;
};

export enum RoleCode {
  Moderator = 'MODERATOR',
  ProjectMember = 'PROJECT_MEMBER',
  ProjectOwner = 'PROJECT_OWNER',
  SuperAdmin = 'SUPER_ADMIN',
  User = 'USER'
}

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

export type RoleFilterInput = {
  and_?: InputMaybe<Array<RoleFilterInput>>;
  code?: InputMaybe<RoleCodeFilterInput>;
  nor_?: InputMaybe<Array<RoleFilterInput>>;
  or_?: InputMaybe<Array<RoleFilterInput>>;
  permissions?: InputMaybe<PermissionFilterInput>;
};

export type RoleFindInput = {
  filter?: InputMaybe<RoleFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  sorts?: InputMaybe<Array<RoleSortInput>>;
};

export type RoleInsertInput = {
  code: RoleCode;
  permissions: Array<InputMaybe<Permission>>;
};

export type RoleSortInput = {
  code?: InputMaybe<SortDirection>;
  permissions?: InputMaybe<SortDirection>;
};

export type RoleUpdateInput = {
  permissions?: InputMaybe<Array<InputMaybe<Permission>>>;
};

export type SecurityContext = {
  __typename?: 'SecurityContext';
  CREATE_PROJECT?: Maybe<PermissionDomains>;
  DELETE_PROFILE?: Maybe<PermissionDomains>;
  DELETE_PROJECT?: Maybe<PermissionDomains>;
  MANAGE_PROJECT_MEMBER_ROLES?: Maybe<PermissionDomains>;
  MANAGE_USER_ROLES?: Maybe<PermissionDomains>;
  READ_PROFILE_PRIVATE?: Maybe<PermissionDomains>;
  UPDATE_PROFILE?: Maybe<PermissionDomains>;
  UPDATE_PROJECT?: Maybe<PermissionDomains>;
};

export type SecurityDomain = {
  __typename?: 'SecurityDomain';
  delete?: Maybe<PermissionOperationDomain>;
  read?: Maybe<PermissionOperationDomain>;
  update?: Maybe<PermissionOperationDomain>;
  write?: Maybe<PermissionOperationDomain>;
};

export type SecurityDomains = {
  __typename?: 'SecurityDomains';
  domains?: Maybe<Array<SecurityDomain>>;
};

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}

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

export enum StringFilterMode {
  Insensitive = 'INSENSITIVE',
  Sensitive = 'SENSITIVE'
}

export type User = {
  __typename?: 'User';
  avatarLink?: Maybe<Scalars['String']>;
  bannerLink?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  createdAt: Scalars['Date'];
  displayName?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  id: Scalars['ID'];
  loginIdentities: Array<UserLoginIdentity>;
  projectMembers: Array<ProjectMember>;
  roles: Array<UserRole>;
  socials: Array<UserSocial>;
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
  loginIdentities?: InputMaybe<UserLoginIdentityFindInput>;
  projectMembers?: InputMaybe<ProjectMemberFindInput>;
  roles?: InputMaybe<UserRoleFindInput>;
  socials?: InputMaybe<UserSocialFindInput>;
};

export type UserRole = {
  __typename?: 'UserRole';
  id: Scalars['ID'];
  role: Role;
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
  role?: InputMaybe<RoleFindInput>;
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
  username?: InputMaybe<SortDirection>;
};

export type UserUpdateInput = {
  avatarLink?: InputMaybe<Scalars['String']>;
  bannerLink?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['Date']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  BooleanFilterInput: BooleanFilterInput;
  BooleanType: ResolverTypeWrapper<BooleanType>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateFilterInput: DateFilterInput;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  FloatFilterInput: FloatFilterInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  IDFilterInput: IdFilterInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  IntFilterInput: IntFilterInput;
  Json: ResolverTypeWrapper<Scalars['Json']>;
  JsonFilterInput: JsonFilterInput;
  JsonType: ResolverTypeWrapper<JsonType>;
  KeyValue: KeyValue;
  Mutation: ResolverTypeWrapper<{}>;
  Permission: Permission;
  PermissionDomains: ResolversTypes['BooleanType'] | ResolversTypes['SecurityDomains'];
  PermissionFilterInput: PermissionFilterInput;
  PermissionOperationDomain: ResolversTypes['BooleanType'] | ResolversTypes['JsonType'];
  Project: ResolverTypeWrapper<Project>;
  ProjectFilterInput: ProjectFilterInput;
  ProjectFindInput: ProjectFindInput;
  ProjectInsertInput: ProjectInsertInput;
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
  Role: ResolverTypeWrapper<Role>;
  RoleCode: RoleCode;
  RoleCodeFilterInput: RoleCodeFilterInput;
  RoleFilterInput: RoleFilterInput;
  RoleFindInput: RoleFindInput;
  RoleInsertInput: RoleInsertInput;
  RoleSortInput: RoleSortInput;
  RoleUpdateInput: RoleUpdateInput;
  SecurityContext: ResolverTypeWrapper<Omit<SecurityContext, 'CREATE_PROJECT' | 'DELETE_PROFILE' | 'DELETE_PROJECT' | 'MANAGE_PROJECT_MEMBER_ROLES' | 'MANAGE_USER_ROLES' | 'READ_PROFILE_PRIVATE' | 'UPDATE_PROFILE' | 'UPDATE_PROJECT'> & { CREATE_PROJECT?: Maybe<ResolversTypes['PermissionDomains']>, DELETE_PROFILE?: Maybe<ResolversTypes['PermissionDomains']>, DELETE_PROJECT?: Maybe<ResolversTypes['PermissionDomains']>, MANAGE_PROJECT_MEMBER_ROLES?: Maybe<ResolversTypes['PermissionDomains']>, MANAGE_USER_ROLES?: Maybe<ResolversTypes['PermissionDomains']>, READ_PROFILE_PRIVATE?: Maybe<ResolversTypes['PermissionDomains']>, UPDATE_PROFILE?: Maybe<ResolversTypes['PermissionDomains']>, UPDATE_PROJECT?: Maybe<ResolversTypes['PermissionDomains']> }>;
  SecurityDomain: ResolverTypeWrapper<Omit<SecurityDomain, 'delete' | 'read' | 'update' | 'write'> & { delete?: Maybe<ResolversTypes['PermissionOperationDomain']>, read?: Maybe<ResolversTypes['PermissionOperationDomain']>, update?: Maybe<ResolversTypes['PermissionOperationDomain']>, write?: Maybe<ResolversTypes['PermissionOperationDomain']> }>;
  SecurityDomains: ResolverTypeWrapper<SecurityDomains>;
  SortDirection: SortDirection;
  String: ResolverTypeWrapper<Scalars['String']>;
  StringFilterInput: StringFilterInput;
  StringFilterMode: StringFilterMode;
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
  Boolean: Scalars['Boolean'];
  BooleanFilterInput: BooleanFilterInput;
  BooleanType: BooleanType;
  Date: Scalars['Date'];
  DateFilterInput: DateFilterInput;
  Float: Scalars['Float'];
  FloatFilterInput: FloatFilterInput;
  ID: Scalars['ID'];
  IDFilterInput: IdFilterInput;
  Int: Scalars['Int'];
  IntFilterInput: IntFilterInput;
  Json: Scalars['Json'];
  JsonFilterInput: JsonFilterInput;
  JsonType: JsonType;
  KeyValue: KeyValue;
  Mutation: {};
  PermissionDomains: ResolversParentTypes['BooleanType'] | ResolversParentTypes['SecurityDomains'];
  PermissionFilterInput: PermissionFilterInput;
  PermissionOperationDomain: ResolversParentTypes['BooleanType'] | ResolversParentTypes['JsonType'];
  Project: Project;
  ProjectFilterInput: ProjectFilterInput;
  ProjectFindInput: ProjectFindInput;
  ProjectInsertInput: ProjectInsertInput;
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
  Role: Role;
  RoleCodeFilterInput: RoleCodeFilterInput;
  RoleFilterInput: RoleFilterInput;
  RoleFindInput: RoleFindInput;
  RoleInsertInput: RoleInsertInput;
  RoleSortInput: RoleSortInput;
  RoleUpdateInput: RoleUpdateInput;
  SecurityContext: Omit<SecurityContext, 'CREATE_PROJECT' | 'DELETE_PROFILE' | 'DELETE_PROJECT' | 'MANAGE_PROJECT_MEMBER_ROLES' | 'MANAGE_USER_ROLES' | 'READ_PROFILE_PRIVATE' | 'UPDATE_PROFILE' | 'UPDATE_PROJECT'> & { CREATE_PROJECT?: Maybe<ResolversParentTypes['PermissionDomains']>, DELETE_PROFILE?: Maybe<ResolversParentTypes['PermissionDomains']>, DELETE_PROJECT?: Maybe<ResolversParentTypes['PermissionDomains']>, MANAGE_PROJECT_MEMBER_ROLES?: Maybe<ResolversParentTypes['PermissionDomains']>, MANAGE_USER_ROLES?: Maybe<ResolversParentTypes['PermissionDomains']>, READ_PROFILE_PRIVATE?: Maybe<ResolversParentTypes['PermissionDomains']>, UPDATE_PROFILE?: Maybe<ResolversParentTypes['PermissionDomains']>, UPDATE_PROJECT?: Maybe<ResolversParentTypes['PermissionDomains']> };
  SecurityDomain: Omit<SecurityDomain, 'delete' | 'read' | 'update' | 'write'> & { delete?: Maybe<ResolversParentTypes['PermissionOperationDomain']>, read?: Maybe<ResolversParentTypes['PermissionOperationDomain']>, update?: Maybe<ResolversParentTypes['PermissionOperationDomain']>, write?: Maybe<ResolversParentTypes['PermissionOperationDomain']> };
  SecurityDomains: SecurityDomains;
  String: Scalars['String'];
  StringFilterInput: StringFilterInput;
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

export type BooleanTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['BooleanType'] = ResolversParentTypes['BooleanType']> = {
  boolean?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Json'], any> {
  name: 'Json';
}

export type JsonTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['JsonType'] = ResolversParentTypes['JsonType']> = {
  json?: Resolver<Maybe<ResolversTypes['Json']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createProject?: Resolver<ResolversTypes['Project'], ParentType, ContextType, RequireFields<MutationCreateProjectArgs, 'record'>>;
  createProjectMember?: Resolver<ResolversTypes['ProjectMember'], ParentType, ContextType, RequireFields<MutationCreateProjectMemberArgs, 'record'>>;
  createProjectMemberRole?: Resolver<ResolversTypes['ProjectMemberRole'], ParentType, ContextType, RequireFields<MutationCreateProjectMemberRoleArgs, 'record'>>;
  createRole?: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationCreateRoleArgs, 'record'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'record'>>;
  createUserLoginIdentity?: Resolver<ResolversTypes['UserLoginIdentity'], ParentType, ContextType, RequireFields<MutationCreateUserLoginIdentityArgs, 'record'>>;
  createUserRole?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType, RequireFields<MutationCreateUserRoleArgs, 'record'>>;
  createUserSocial?: Resolver<ResolversTypes['UserSocial'], ParentType, ContextType, RequireFields<MutationCreateUserSocialArgs, 'record'>>;
  deleteProjectMemberRoles?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectMemberRolesArgs, 'filter'>>;
  deleteProjectMembers?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectMembersArgs, 'filter'>>;
  deleteProjects?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectsArgs, 'filter'>>;
  deleteRoles?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteRolesArgs, 'filter'>>;
  deleteUserLoginIdentitys?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUserLoginIdentitysArgs, 'filter'>>;
  deleteUserRoles?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUserRolesArgs, 'filter'>>;
  deleteUserSocials?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUserSocialsArgs, 'filter'>>;
  deleteUsers?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUsersArgs, 'filter'>>;
  updateProjectMemberRoles?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateProjectMemberRolesArgs, 'changes' | 'filter'>>;
  updateProjectMembers?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateProjectMembersArgs, 'changes' | 'filter'>>;
  updateProjects?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateProjectsArgs, 'changes' | 'filter'>>;
  updateRoles?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateRolesArgs, 'changes' | 'filter'>>;
  updateUserLoginIdentitys?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserLoginIdentitysArgs, 'changes' | 'filter'>>;
  updateUserRoles?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserRolesArgs, 'changes' | 'filter'>>;
  updateUserSocials?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserSocialsArgs, 'changes' | 'filter'>>;
  updateUsers?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUsersArgs, 'changes' | 'filter'>>;
};

export type PermissionDomainsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PermissionDomains'] = ResolversParentTypes['PermissionDomains']> = {
  __resolveType: TypeResolveFn<'BooleanType' | 'SecurityDomains', ParentType, ContextType>;
};

export type PermissionOperationDomainResolvers<ContextType = any, ParentType extends ResolversParentTypes['PermissionOperationDomain'] = ResolversParentTypes['PermissionOperationDomain']> = {
  __resolveType: TypeResolveFn<'BooleanType' | 'JsonType', ParentType, ContextType>;
};

export type ProjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  bannerLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cardImageLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  completedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  downloadLinks?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  galleryImageLinks?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  members?: Resolver<Maybe<Array<ResolversTypes['ProjectMember']>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  soundcloudEmbedSrc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectMemberResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectMember'] = ResolversParentTypes['ProjectMember']> = {
  contributions?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['ProjectMemberRole']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectMemberRoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectMemberRole'] = ResolversParentTypes['ProjectMemberRole']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  projectMember?: Resolver<ResolversTypes['ProjectMember'], ParentType, ContextType>;
  projectMemberId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  roleCode?: Resolver<ResolversTypes['RoleCode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getSecurityContext?: Resolver<Maybe<ResolversTypes['SecurityContext']>, ParentType, ContextType, Partial<QueryGetSecurityContextArgs>>;
  projectMemberRoles?: Resolver<Array<ResolversTypes['ProjectMemberRole']>, ParentType, ContextType, Partial<QueryProjectMemberRolesArgs>>;
  projectMembers?: Resolver<Array<ResolversTypes['ProjectMember']>, ParentType, ContextType, Partial<QueryProjectMembersArgs>>;
  projects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType, Partial<QueryProjectsArgs>>;
  roles?: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType, Partial<QueryRolesArgs>>;
  userLoginIdentitys?: Resolver<Array<ResolversTypes['UserLoginIdentity']>, ParentType, ContextType, Partial<QueryUserLoginIdentitysArgs>>;
  userRoles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType, Partial<QueryUserRolesArgs>>;
  userSocials?: Resolver<Array<ResolversTypes['UserSocial']>, ParentType, ContextType, Partial<QueryUserSocialsArgs>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryUsersArgs>>;
};

export type RoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Role'] = ResolversParentTypes['Role']> = {
  code?: Resolver<ResolversTypes['RoleCode'], ParentType, ContextType>;
  permissions?: Resolver<Array<Maybe<ResolversTypes['Permission']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SecurityContextResolvers<ContextType = any, ParentType extends ResolversParentTypes['SecurityContext'] = ResolversParentTypes['SecurityContext']> = {
  CREATE_PROJECT?: Resolver<Maybe<ResolversTypes['PermissionDomains']>, ParentType, ContextType>;
  DELETE_PROFILE?: Resolver<Maybe<ResolversTypes['PermissionDomains']>, ParentType, ContextType>;
  DELETE_PROJECT?: Resolver<Maybe<ResolversTypes['PermissionDomains']>, ParentType, ContextType>;
  MANAGE_PROJECT_MEMBER_ROLES?: Resolver<Maybe<ResolversTypes['PermissionDomains']>, ParentType, ContextType>;
  MANAGE_USER_ROLES?: Resolver<Maybe<ResolversTypes['PermissionDomains']>, ParentType, ContextType>;
  READ_PROFILE_PRIVATE?: Resolver<Maybe<ResolversTypes['PermissionDomains']>, ParentType, ContextType>;
  UPDATE_PROFILE?: Resolver<Maybe<ResolversTypes['PermissionDomains']>, ParentType, ContextType>;
  UPDATE_PROJECT?: Resolver<Maybe<ResolversTypes['PermissionDomains']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SecurityDomainResolvers<ContextType = any, ParentType extends ResolversParentTypes['SecurityDomain'] = ResolversParentTypes['SecurityDomain']> = {
  delete?: Resolver<Maybe<ResolversTypes['PermissionOperationDomain']>, ParentType, ContextType>;
  read?: Resolver<Maybe<ResolversTypes['PermissionOperationDomain']>, ParentType, ContextType>;
  update?: Resolver<Maybe<ResolversTypes['PermissionOperationDomain']>, ParentType, ContextType>;
  write?: Resolver<Maybe<ResolversTypes['PermissionOperationDomain']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SecurityDomainsResolvers<ContextType = any, ParentType extends ResolversParentTypes['SecurityDomains'] = ResolversParentTypes['SecurityDomains']> = {
  domains?: Resolver<Maybe<Array<ResolversTypes['SecurityDomain']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatarLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bannerLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  loginIdentities?: Resolver<Array<ResolversTypes['UserLoginIdentity']>, ParentType, ContextType>;
  projectMembers?: Resolver<Array<ResolversTypes['ProjectMember']>, ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType>;
  socials?: Resolver<Array<ResolversTypes['UserSocial']>, ParentType, ContextType>;
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
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
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
  BooleanType?: BooleanTypeResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Json?: GraphQLScalarType;
  JsonType?: JsonTypeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PermissionDomains?: PermissionDomainsResolvers<ContextType>;
  PermissionOperationDomain?: PermissionOperationDomainResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  ProjectMember?: ProjectMemberResolvers<ContextType>;
  ProjectMemberRole?: ProjectMemberRoleResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Role?: RoleResolvers<ContextType>;
  SecurityContext?: SecurityContextResolvers<ContextType>;
  SecurityDomain?: SecurityDomainResolvers<ContextType>;
  SecurityDomains?: SecurityDomainsResolvers<ContextType>;
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
