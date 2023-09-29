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
export type EBoard = {
  __typename?: 'EBoard';
  avatarLink?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Date']>;
  id: Scalars['ID'];
  terms: Array<EBoardTerm>;
  updatedAt?: Maybe<Scalars['Date']>;
  user: User;
  userId: Scalars['ID'];
};

export type EBoardSubscriptionFilter = {
  userId?: InputMaybe<Scalars['ID']>;
};

export type EBoardTerm = {
  __typename?: 'EBoardTerm';
  eBoard: EBoard;
  eBoardId: Scalars['ID'];
  id: Scalars['ID'];
  roles: Array<EBoardTermRole>;
  year: Scalars['Int'];
};

export type EBoardTermRole = {
  __typename?: 'EBoardTermRole';
  id: Scalars['ID'];
  roleCode: RoleCode;
  term: EBoardTerm;
  termId: Scalars['ID'];
};

export type EBoardTermSubscriptionFilter = {
  eBoardId?: InputMaybe<Scalars['ID']>;
};

export const InviteType = {
  Incoming: 'INCOMING',
  Outgoing: 'OUTGOING'
} as const;

export type InviteType = typeof InviteType[keyof typeof InviteType];
export type Mutation = {
  __typename?: 'Mutation';
  acceptProjectInvite?: Maybe<Scalars['Boolean']>;
  deleteEBoard?: Maybe<Scalars['Boolean']>;
  deleteEBoardTerm?: Maybe<Scalars['Boolean']>;
  deleteProject?: Maybe<Scalars['Boolean']>;
  deleteProjectInvite?: Maybe<Scalars['Boolean']>;
  deleteProjectMember?: Maybe<Scalars['Boolean']>;
  deleteUser?: Maybe<Scalars['Boolean']>;
  deleteUserLoginIdentity?: Maybe<Scalars['Boolean']>;
  joinOpenProject?: Maybe<Scalars['Boolean']>;
  newEBoard: Scalars['ID'];
  newEBoardTerm: Scalars['ID'];
  newProject: Scalars['ID'];
  newProjectInvite?: Maybe<Scalars['ID']>;
  newProjectMember?: Maybe<Scalars['ID']>;
  newUser?: Maybe<Scalars['ID']>;
  newUserLoginIdentity?: Maybe<Scalars['ID']>;
  transferProjectOwnership?: Maybe<Scalars['Boolean']>;
  updateEBoard?: Maybe<Scalars['Boolean']>;
  updateEBoardTerm?: Maybe<Scalars['Boolean']>;
  updateProject?: Maybe<Scalars['Boolean']>;
  updateProjectMember?: Maybe<Scalars['Boolean']>;
  updateUser?: Maybe<Scalars['Boolean']>;
  updateUserLoginIdentity?: Maybe<Scalars['Boolean']>;
  verifyNetId?: Maybe<Scalars['Boolean']>;
};


export type MutationAcceptProjectInviteArgs = {
  inviteId: Scalars['ID'];
};


export type MutationDeleteEBoardArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteEBoardTermArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProjectInviteArgs = {
  inviteId: Scalars['ID'];
};


export type MutationDeleteProjectMemberArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserLoginIdentityArgs = {
  id: Scalars['ID'];
};


export type MutationJoinOpenProjectArgs = {
  projectId: Scalars['ID'];
};


export type MutationNewEBoardArgs = {
  input: NewEBoardInput;
};


export type MutationNewEBoardTermArgs = {
  input: NewEBoardTermInput;
};


export type MutationNewProjectArgs = {
  input: NewProjectInput;
};


export type MutationNewProjectInviteArgs = {
  input: NewProjectInviteInput;
};


export type MutationNewProjectMemberArgs = {
  input: NewProjectMemberInput;
};


export type MutationNewUserArgs = {
  input: NewUserInput;
};


export type MutationNewUserLoginIdentityArgs = {
  input: NewUserLoginIdentityInput;
};


export type MutationTransferProjectOwnershipArgs = {
  memberId: Scalars['ID'];
  projectId: Scalars['ID'];
};


export type MutationUpdateEBoardArgs = {
  input: UpdateEBoardInput;
};


export type MutationUpdateEBoardTermArgs = {
  input: UpdateEBoardTermInput;
};


export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};


export type MutationUpdateProjectMemberArgs = {
  input: UpdateProjectMemberInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserLoginIdentityArgs = {
  input: UpdateUserLoginIdentityInput;
};


export type MutationVerifyNetIdArgs = {
  input: VerifyNetIdInput;
};

export type NewEBoardInput = {
  userId: Scalars['ID'];
};

export type NewEBoardTermInput = {
  eBoardId: Scalars['ID'];
  year: Scalars['Int'];
};

export type NewProjectInput = {
  access: Access;
  name: Scalars['String'];
  pitch: Scalars['String'];
};

export type NewProjectInviteInput = {
  projectId: Scalars['ID'];
  type: InviteType;
  userId: Scalars['ID'];
};

export type NewProjectMemberInput = {
  projectId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type NewProjectMemberRoleInput = {
  projectMemberId: Scalars['ID'];
  roleCode: RoleCode;
};

export type NewUserInput = {
  displayName: Scalars['String'];
  email?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};

export type NewUserLoginIdentityInput = {
  identityId: Scalars['ID'];
  name: Scalars['String'];
  userId: Scalars['ID'];
};

export type NewUserRoleInput = {
  roleCode: RoleCode;
  userId: Scalars['ID'];
};

export const Permission = {
  CreateProject: 'CREATE_PROJECT',
  CreateProjectMember: 'CREATE_PROJECT_MEMBER',
  CreateUser: 'CREATE_USER',
  DebugDiscordBot: 'DEBUG_DISCORD_BOT',
  DeleteProject: 'DELETE_PROJECT',
  DeleteUser: 'DELETE_USER',
  JoinProject: 'JOIN_PROJECT',
  ManageEboard: 'MANAGE_EBOARD',
  ManageEboardRoles: 'MANAGE_EBOARD_ROLES',
  ManageMetadata: 'MANAGE_METADATA',
  ManageProjectDiscord: 'MANAGE_PROJECT_DISCORD',
  ManageProjectInvites: 'MANAGE_PROJECT_INVITES',
  ManageProjectMember: 'MANAGE_PROJECT_MEMBER',
  ManageProjectMemberRoles: 'MANAGE_PROJECT_MEMBER_ROLES',
  ManageUserRoles: 'MANAGE_USER_ROLES',
  ReadUserPrivate: 'READ_USER_PRIVATE',
  RutgersVerified: 'RUTGERS_VERIFIED',
  TransferProjectOwnership: 'TRANSFER_PROJECT_OWNERSHIP',
  UpdateProject: 'UPDATE_PROJECT',
  UpdateUser: 'UPDATE_USER',
  UpdateUserPrivate: 'UPDATE_USER_PRIVATE'
} as const;

export type Permission = typeof Permission[keyof typeof Permission];
export type Project = {
  __typename?: 'Project';
  access: Access;
  bannerLink?: Maybe<Scalars['String']>;
  cardImageLink?: Maybe<Scalars['String']>;
  completedAt?: Maybe<Scalars['Date']>;
  createdAt?: Maybe<Scalars['Date']>;
  description?: Maybe<Scalars['String']>;
  discordConfig?: Maybe<ProjectDiscordConfig>;
  downloadLinks?: Maybe<Array<Scalars['String']>>;
  galleryImageLinks?: Maybe<Array<Scalars['String']>>;
  id: Scalars['ID'];
  invites: Array<ProjectInvite>;
  members: Array<ProjectMember>;
  name: Scalars['String'];
  pitch: Scalars['String'];
  soundcloudEmbedSrc?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Scalars['String']>>;
  updatedAt?: Maybe<Scalars['Date']>;
};

export type ProjectDiscordConfig = {
  __typename?: 'ProjectDiscordConfig';
  categoryId?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Date']>;
  id: Scalars['ID'];
  project: Project;
  projectId: Scalars['ID'];
  updatedAt?: Maybe<Scalars['Date']>;
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

export type ProjectInviteSubscriptionFilter = {
  projectId?: InputMaybe<Scalars['ID']>;
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

export type ProjectMemberRole = {
  __typename?: 'ProjectMemberRole';
  id: Scalars['ID'];
  projectMember: ProjectMember;
  projectMemberId: Scalars['ID'];
  roleCode: RoleCode;
};

export type ProjectMemberSubscriptionFilter = {
  projectId?: InputMaybe<Scalars['ID']>;
  userId?: InputMaybe<Scalars['ID']>;
};

export type ProjectSubscriptionFilter = {
  projectId?: InputMaybe<Scalars['ID']>;
};

export type Query = {
  __typename?: 'Query';
  isAuthTokenValid?: Maybe<Scalars['Boolean']>;
  projectCount?: Maybe<Scalars['Int']>;
  securityContext?: Maybe<Scalars['Json']>;
  securityPolicy?: Maybe<Scalars['Json']>;
  userCount?: Maybe<Scalars['Int']>;
};


export type QuerySecurityContextArgs = {
  clearCache?: InputMaybe<Scalars['Boolean']>;
  userId?: InputMaybe<Scalars['ID']>;
};

export const RoleCode = {
  Artist: 'ARTIST',
  BotDeveloper: 'BOT_DEVELOPER',
  ClubGraphicArtist: 'CLUB_GRAPHIC_ARTIST',
  CommunityManager: 'COMMUNITY_MANAGER',
  Eboard: 'EBOARD',
  EventCoordinator: 'EVENT_COORDINATOR',
  GameDesigner: 'GAME_DESIGNER',
  Moderator: 'MODERATOR',
  Musician: 'MUSICIAN',
  Outreach: 'OUTREACH',
  President: 'PRESIDENT',
  Programmer: 'PROGRAMMER',
  ProjectMember: 'PROJECT_MEMBER',
  ProjectOfficer: 'PROJECT_OFFICER',
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
export type Subscription = {
  __typename?: 'Subscription';
  eBoardCreated?: Maybe<EBoard>;
  eBoardDeleted?: Maybe<EBoard>;
  eBoardTermCreated?: Maybe<EBoardTerm>;
  eBoardTermDeleted?: Maybe<EBoardTerm>;
  eBoardTermUpdated?: Maybe<EBoardTerm>;
  eBoardUpdated?: Maybe<EBoard>;
  projectCreated?: Maybe<Project>;
  projectDeleted?: Maybe<Project>;
  projectInviteCreated?: Maybe<ProjectInvite>;
  projectInviteDeleted?: Maybe<ProjectInvite>;
  projectMemberCreated?: Maybe<ProjectMember>;
  projectMemberDeleted?: Maybe<ProjectMember>;
  projectMemberUpdated?: Maybe<ProjectMember>;
  projectUpdated?: Maybe<Project>;
  userCreated?: Maybe<User>;
  userDeleted?: Maybe<User>;
  userLoginIdentityCreated?: Maybe<UserLoginIdentity>;
  userLoginIdentityDeleted?: Maybe<UserLoginIdentity>;
  userLoginIdentityUpdated?: Maybe<UserLoginIdentity>;
  userUpdated?: Maybe<User>;
};


export type SubscriptionEBoardCreatedArgs = {
  filter?: InputMaybe<EBoardSubscriptionFilter>;
};


export type SubscriptionEBoardDeletedArgs = {
  filter?: InputMaybe<EBoardSubscriptionFilter>;
};


export type SubscriptionEBoardTermCreatedArgs = {
  filter?: InputMaybe<EBoardTermSubscriptionFilter>;
};


export type SubscriptionEBoardTermDeletedArgs = {
  filter?: InputMaybe<EBoardTermSubscriptionFilter>;
};


export type SubscriptionEBoardTermUpdatedArgs = {
  filter?: InputMaybe<EBoardTermSubscriptionFilter>;
};


export type SubscriptionEBoardUpdatedArgs = {
  filter?: InputMaybe<EBoardSubscriptionFilter>;
};


export type SubscriptionProjectCreatedArgs = {
  filter?: InputMaybe<ProjectSubscriptionFilter>;
};


export type SubscriptionProjectDeletedArgs = {
  filter?: InputMaybe<ProjectSubscriptionFilter>;
};


export type SubscriptionProjectInviteCreatedArgs = {
  filter?: InputMaybe<ProjectInviteSubscriptionFilter>;
};


export type SubscriptionProjectInviteDeletedArgs = {
  filter?: InputMaybe<ProjectInviteSubscriptionFilter>;
};


export type SubscriptionProjectMemberCreatedArgs = {
  filter?: InputMaybe<ProjectMemberSubscriptionFilter>;
};


export type SubscriptionProjectMemberDeletedArgs = {
  filter?: InputMaybe<ProjectMemberSubscriptionFilter>;
};


export type SubscriptionProjectMemberUpdatedArgs = {
  filter?: InputMaybe<ProjectMemberSubscriptionFilter>;
};


export type SubscriptionProjectUpdatedArgs = {
  filter?: InputMaybe<ProjectSubscriptionFilter>;
};


export type SubscriptionUserCreatedArgs = {
  filter?: InputMaybe<UserSubscriptionFilter>;
};


export type SubscriptionUserDeletedArgs = {
  filter?: InputMaybe<UserSubscriptionFilter>;
};


export type SubscriptionUserLoginIdentityCreatedArgs = {
  filter?: InputMaybe<UserLoginIdentitySubscriptionFilter>;
};


export type SubscriptionUserLoginIdentityDeletedArgs = {
  filter?: InputMaybe<UserLoginIdentitySubscriptionFilter>;
};


export type SubscriptionUserLoginIdentityUpdatedArgs = {
  filter?: InputMaybe<UserLoginIdentitySubscriptionFilter>;
};


export type SubscriptionUserUpdatedArgs = {
  filter?: InputMaybe<UserSubscriptionFilter>;
};

export type UpdateEBoardInput = {
  avatar?: InputMaybe<UploadWithOperation>;
  bio?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type UpdateEBoardTermInput = {
  id: Scalars['ID'];
  roles?: InputMaybe<Array<RoleCode>>;
  year?: InputMaybe<Scalars['Int']>;
};

export type UpdateProjectInput = {
  access?: InputMaybe<Access>;
  banner?: InputMaybe<UploadWithOperation>;
  cardImage?: InputMaybe<UploadWithOperation>;
  completed?: InputMaybe<Scalars['Boolean']>;
  completedAt?: InputMaybe<Scalars['Date']>;
  createdAt?: InputMaybe<Scalars['Date']>;
  description?: InputMaybe<Scalars['String']>;
  downloadLinks?: InputMaybe<Array<Scalars['String']>>;
  galleryImages?: InputMaybe<Array<UploadOrSource>>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  pitch?: InputMaybe<Scalars['String']>;
  soundcloudEmbedSrc?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
};

export type UpdateProjectMemberInput = {
  contributions?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  roles?: InputMaybe<Array<RoleCode>>;
};

export type UpdateUserInput = {
  avatar?: InputMaybe<UploadWithOperation>;
  banner?: InputMaybe<UploadWithOperation>;
  bio?: InputMaybe<Scalars['String']>;
  classYear?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['Date']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  roles?: InputMaybe<Array<RoleCode>>;
  socials?: InputMaybe<Array<UpdateUserSocialInput>>;
};

export type UpdateUserLoginIdentityInput = {
  data?: InputMaybe<Scalars['Json']>;
  id: Scalars['ID'];
  identityId?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
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
export type UploadOrSource = {
  source?: InputMaybe<Scalars['String']>;
  upload?: InputMaybe<Scalars['Upload']>;
};

export type UploadWithOperation = {
  operation?: InputMaybe<UploadOperation>;
  upload?: InputMaybe<Scalars['Upload']>;
};

export type User = {
  __typename?: 'User';
  avatarLink?: Maybe<Scalars['String']>;
  bannerLink?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  classYear?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['Date']>;
  displayName: Scalars['String'];
  eBoard?: Maybe<EBoard>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  loginIdentities: Array<UserLoginIdentity>;
  netId?: Maybe<Scalars['String']>;
  projectInvites: Array<ProjectInvite>;
  projectMembers: Array<ProjectMember>;
  roles: Array<UserRole>;
  socials: Array<UserSocial>;
  updatedAt?: Maybe<Scalars['Date']>;
  username: Scalars['String'];
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

export type UserLoginIdentitySubscriptionFilter = {
  id?: InputMaybe<Scalars['ID']>;
};

export type UserRole = {
  __typename?: 'UserRole';
  id: Scalars['ID'];
  roleCode: RoleCode;
  user: User;
  userId: Scalars['ID'];
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

export type UserSubscriptionFilter = {
  id?: InputMaybe<Scalars['ID']>;
};

export type VerifyNetIdInput = {
  netId: Scalars['String'];
  userId?: InputMaybe<Scalars['ID']>;
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  EBoard: ResolverTypeWrapper<EBoard>;
  EBoardSubscriptionFilter: EBoardSubscriptionFilter;
  EBoardTerm: ResolverTypeWrapper<EBoardTerm>;
  EBoardTermRole: ResolverTypeWrapper<EBoardTermRole>;
  EBoardTermSubscriptionFilter: EBoardTermSubscriptionFilter;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  InviteType: InviteType;
  Json: ResolverTypeWrapper<Scalars['Json']>;
  Mutation: ResolverTypeWrapper<{}>;
  NewEBoardInput: NewEBoardInput;
  NewEBoardTermInput: NewEBoardTermInput;
  NewProjectInput: NewProjectInput;
  NewProjectInviteInput: NewProjectInviteInput;
  NewProjectMemberInput: NewProjectMemberInput;
  NewProjectMemberRoleInput: NewProjectMemberRoleInput;
  NewUserInput: NewUserInput;
  NewUserLoginIdentityInput: NewUserLoginIdentityInput;
  NewUserRoleInput: NewUserRoleInput;
  Permission: Permission;
  Project: ResolverTypeWrapper<Project>;
  ProjectDiscordConfig: ResolverTypeWrapper<ProjectDiscordConfig>;
  ProjectInvite: ResolverTypeWrapper<ProjectInvite>;
  ProjectInviteSubscriptionFilter: ProjectInviteSubscriptionFilter;
  ProjectMember: ResolverTypeWrapper<ProjectMember>;
  ProjectMemberRole: ResolverTypeWrapper<ProjectMemberRole>;
  ProjectMemberSubscriptionFilter: ProjectMemberSubscriptionFilter;
  ProjectSubscriptionFilter: ProjectSubscriptionFilter;
  Query: ResolverTypeWrapper<{}>;
  RoleCode: RoleCode;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  UpdateEBoardInput: UpdateEBoardInput;
  UpdateEBoardTermInput: UpdateEBoardTermInput;
  UpdateProjectInput: UpdateProjectInput;
  UpdateProjectMemberInput: UpdateProjectMemberInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserLoginIdentityInput: UpdateUserLoginIdentityInput;
  UpdateUserSocialInput: UpdateUserSocialInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  UploadOperation: UploadOperation;
  UploadOrSource: UploadOrSource;
  UploadWithOperation: UploadWithOperation;
  User: ResolverTypeWrapper<User>;
  UserLoginIdentity: ResolverTypeWrapper<UserLoginIdentity>;
  UserLoginIdentitySubscriptionFilter: UserLoginIdentitySubscriptionFilter;
  UserRole: ResolverTypeWrapper<UserRole>;
  UserSocial: ResolverTypeWrapper<UserSocial>;
  UserSubscriptionFilter: UserSubscriptionFilter;
  VerifyNetIdInput: VerifyNetIdInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Date: Scalars['Date'];
  EBoard: EBoard;
  EBoardSubscriptionFilter: EBoardSubscriptionFilter;
  EBoardTerm: EBoardTerm;
  EBoardTermRole: EBoardTermRole;
  EBoardTermSubscriptionFilter: EBoardTermSubscriptionFilter;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Json: Scalars['Json'];
  Mutation: {};
  NewEBoardInput: NewEBoardInput;
  NewEBoardTermInput: NewEBoardTermInput;
  NewProjectInput: NewProjectInput;
  NewProjectInviteInput: NewProjectInviteInput;
  NewProjectMemberInput: NewProjectMemberInput;
  NewProjectMemberRoleInput: NewProjectMemberRoleInput;
  NewUserInput: NewUserInput;
  NewUserLoginIdentityInput: NewUserLoginIdentityInput;
  NewUserRoleInput: NewUserRoleInput;
  Project: Project;
  ProjectDiscordConfig: ProjectDiscordConfig;
  ProjectInvite: ProjectInvite;
  ProjectInviteSubscriptionFilter: ProjectInviteSubscriptionFilter;
  ProjectMember: ProjectMember;
  ProjectMemberRole: ProjectMemberRole;
  ProjectMemberSubscriptionFilter: ProjectMemberSubscriptionFilter;
  ProjectSubscriptionFilter: ProjectSubscriptionFilter;
  Query: {};
  String: Scalars['String'];
  Subscription: {};
  UpdateEBoardInput: UpdateEBoardInput;
  UpdateEBoardTermInput: UpdateEBoardTermInput;
  UpdateProjectInput: UpdateProjectInput;
  UpdateProjectMemberInput: UpdateProjectMemberInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserLoginIdentityInput: UpdateUserLoginIdentityInput;
  UpdateUserSocialInput: UpdateUserSocialInput;
  Upload: Scalars['Upload'];
  UploadOrSource: UploadOrSource;
  UploadWithOperation: UploadWithOperation;
  User: User;
  UserLoginIdentity: UserLoginIdentity;
  UserLoginIdentitySubscriptionFilter: UserLoginIdentitySubscriptionFilter;
  UserRole: UserRole;
  UserSocial: UserSocial;
  UserSubscriptionFilter: UserSubscriptionFilter;
  VerifyNetIdInput: VerifyNetIdInput;
};

export type CreatedAtDirectiveArgs = { };

export type CreatedAtDirectiveResolver<Result, Parent, ContextType = any, Args = CreatedAtDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type UniqueDirectiveArgs = { };

export type UniqueDirectiveResolver<Result, Parent, ContextType = any, Args = UniqueDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type UpdatedAtDirectiveArgs = { };

export type UpdatedAtDirectiveResolver<Result, Parent, ContextType = any, Args = UpdatedAtDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type EBoardResolvers<ContextType = any, ParentType extends ResolversParentTypes['EBoard'] = ResolversParentTypes['EBoard']> = {
  avatarLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  terms?: Resolver<Array<ResolversTypes['EBoardTerm']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EBoardTermResolvers<ContextType = any, ParentType extends ResolversParentTypes['EBoardTerm'] = ResolversParentTypes['EBoardTerm']> = {
  eBoard?: Resolver<ResolversTypes['EBoard'], ParentType, ContextType>;
  eBoardId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['EBoardTermRole']>, ParentType, ContextType>;
  year?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EBoardTermRoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['EBoardTermRole'] = ResolversParentTypes['EBoardTermRole']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  roleCode?: Resolver<ResolversTypes['RoleCode'], ParentType, ContextType>;
  term?: Resolver<ResolversTypes['EBoardTerm'], ParentType, ContextType>;
  termId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Json'], any> {
  name: 'Json';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  acceptProjectInvite?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationAcceptProjectInviteArgs, 'inviteId'>>;
  deleteEBoard?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteEBoardArgs, 'id'>>;
  deleteEBoardTerm?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteEBoardTermArgs, 'id'>>;
  deleteProject?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectArgs, 'id'>>;
  deleteProjectInvite?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectInviteArgs, 'inviteId'>>;
  deleteProjectMember?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectMemberArgs, 'id'>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  deleteUserLoginIdentity?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUserLoginIdentityArgs, 'id'>>;
  joinOpenProject?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationJoinOpenProjectArgs, 'projectId'>>;
  newEBoard?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationNewEBoardArgs, 'input'>>;
  newEBoardTerm?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationNewEBoardTermArgs, 'input'>>;
  newProject?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationNewProjectArgs, 'input'>>;
  newProjectInvite?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationNewProjectInviteArgs, 'input'>>;
  newProjectMember?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationNewProjectMemberArgs, 'input'>>;
  newUser?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationNewUserArgs, 'input'>>;
  newUserLoginIdentity?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationNewUserLoginIdentityArgs, 'input'>>;
  transferProjectOwnership?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationTransferProjectOwnershipArgs, 'memberId' | 'projectId'>>;
  updateEBoard?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateEBoardArgs, 'input'>>;
  updateEBoardTerm?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateEBoardTermArgs, 'input'>>;
  updateProject?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateProjectArgs, 'input'>>;
  updateProjectMember?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateProjectMemberArgs, 'input'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
  updateUserLoginIdentity?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserLoginIdentityArgs, 'input'>>;
  verifyNetId?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationVerifyNetIdArgs, 'input'>>;
};

export type ProjectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']> = {
  access?: Resolver<ResolversTypes['Access'], ParentType, ContextType>;
  bannerLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cardImageLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  completedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discordConfig?: Resolver<Maybe<ResolversTypes['ProjectDiscordConfig']>, ParentType, ContextType>;
  downloadLinks?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  galleryImageLinks?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  invites?: Resolver<Array<ResolversTypes['ProjectInvite']>, ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['ProjectMember']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pitch?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  soundcloudEmbedSrc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProjectDiscordConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProjectDiscordConfig'] = ResolversParentTypes['ProjectDiscordConfig']> = {
  categoryId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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
  isAuthTokenValid?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  projectCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  securityContext?: Resolver<Maybe<ResolversTypes['Json']>, ParentType, ContextType, Partial<QuerySecurityContextArgs>>;
  securityPolicy?: Resolver<Maybe<ResolversTypes['Json']>, ParentType, ContextType>;
  userCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  eBoardCreated?: SubscriptionResolver<Maybe<ResolversTypes['EBoard']>, "eBoardCreated", ParentType, ContextType, Partial<SubscriptionEBoardCreatedArgs>>;
  eBoardDeleted?: SubscriptionResolver<Maybe<ResolversTypes['EBoard']>, "eBoardDeleted", ParentType, ContextType, Partial<SubscriptionEBoardDeletedArgs>>;
  eBoardTermCreated?: SubscriptionResolver<Maybe<ResolversTypes['EBoardTerm']>, "eBoardTermCreated", ParentType, ContextType, Partial<SubscriptionEBoardTermCreatedArgs>>;
  eBoardTermDeleted?: SubscriptionResolver<Maybe<ResolversTypes['EBoardTerm']>, "eBoardTermDeleted", ParentType, ContextType, Partial<SubscriptionEBoardTermDeletedArgs>>;
  eBoardTermUpdated?: SubscriptionResolver<Maybe<ResolversTypes['EBoardTerm']>, "eBoardTermUpdated", ParentType, ContextType, Partial<SubscriptionEBoardTermUpdatedArgs>>;
  eBoardUpdated?: SubscriptionResolver<Maybe<ResolversTypes['EBoard']>, "eBoardUpdated", ParentType, ContextType, Partial<SubscriptionEBoardUpdatedArgs>>;
  projectCreated?: SubscriptionResolver<Maybe<ResolversTypes['Project']>, "projectCreated", ParentType, ContextType, Partial<SubscriptionProjectCreatedArgs>>;
  projectDeleted?: SubscriptionResolver<Maybe<ResolversTypes['Project']>, "projectDeleted", ParentType, ContextType, Partial<SubscriptionProjectDeletedArgs>>;
  projectInviteCreated?: SubscriptionResolver<Maybe<ResolversTypes['ProjectInvite']>, "projectInviteCreated", ParentType, ContextType, Partial<SubscriptionProjectInviteCreatedArgs>>;
  projectInviteDeleted?: SubscriptionResolver<Maybe<ResolversTypes['ProjectInvite']>, "projectInviteDeleted", ParentType, ContextType, Partial<SubscriptionProjectInviteDeletedArgs>>;
  projectMemberCreated?: SubscriptionResolver<Maybe<ResolversTypes['ProjectMember']>, "projectMemberCreated", ParentType, ContextType, Partial<SubscriptionProjectMemberCreatedArgs>>;
  projectMemberDeleted?: SubscriptionResolver<Maybe<ResolversTypes['ProjectMember']>, "projectMemberDeleted", ParentType, ContextType, Partial<SubscriptionProjectMemberDeletedArgs>>;
  projectMemberUpdated?: SubscriptionResolver<Maybe<ResolversTypes['ProjectMember']>, "projectMemberUpdated", ParentType, ContextType, Partial<SubscriptionProjectMemberUpdatedArgs>>;
  projectUpdated?: SubscriptionResolver<Maybe<ResolversTypes['Project']>, "projectUpdated", ParentType, ContextType, Partial<SubscriptionProjectUpdatedArgs>>;
  userCreated?: SubscriptionResolver<Maybe<ResolversTypes['User']>, "userCreated", ParentType, ContextType, Partial<SubscriptionUserCreatedArgs>>;
  userDeleted?: SubscriptionResolver<Maybe<ResolversTypes['User']>, "userDeleted", ParentType, ContextType, Partial<SubscriptionUserDeletedArgs>>;
  userLoginIdentityCreated?: SubscriptionResolver<Maybe<ResolversTypes['UserLoginIdentity']>, "userLoginIdentityCreated", ParentType, ContextType, Partial<SubscriptionUserLoginIdentityCreatedArgs>>;
  userLoginIdentityDeleted?: SubscriptionResolver<Maybe<ResolversTypes['UserLoginIdentity']>, "userLoginIdentityDeleted", ParentType, ContextType, Partial<SubscriptionUserLoginIdentityDeletedArgs>>;
  userLoginIdentityUpdated?: SubscriptionResolver<Maybe<ResolversTypes['UserLoginIdentity']>, "userLoginIdentityUpdated", ParentType, ContextType, Partial<SubscriptionUserLoginIdentityUpdatedArgs>>;
  userUpdated?: SubscriptionResolver<Maybe<ResolversTypes['User']>, "userUpdated", ParentType, ContextType, Partial<SubscriptionUserUpdatedArgs>>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatarLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bannerLink?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  classYear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  eBoard?: Resolver<Maybe<ResolversTypes['EBoard']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  loginIdentities?: Resolver<Array<ResolversTypes['UserLoginIdentity']>, ParentType, ContextType>;
  netId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  projectInvites?: Resolver<Array<ResolversTypes['ProjectInvite']>, ParentType, ContextType>;
  projectMembers?: Resolver<Array<ResolversTypes['ProjectMember']>, ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['UserRole']>, ParentType, ContextType>;
  socials?: Resolver<Array<ResolversTypes['UserSocial']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  EBoardTerm?: EBoardTermResolvers<ContextType>;
  EBoardTermRole?: EBoardTermRoleResolvers<ContextType>;
  Json?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  ProjectDiscordConfig?: ProjectDiscordConfigResolvers<ContextType>;
  ProjectInvite?: ProjectInviteResolvers<ContextType>;
  ProjectMember?: ProjectMemberResolvers<ContextType>;
  ProjectMemberRole?: ProjectMemberRoleResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserLoginIdentity?: UserLoginIdentityResolvers<ContextType>;
  UserRole?: UserRoleResolvers<ContextType>;
  UserSocial?: UserSocialResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  createdAt?: CreatedAtDirectiveResolver<any, any, ContextType>;
  unique?: UniqueDirectiveResolver<any, any, ContextType>;
  updatedAt?: UpdatedAtDirectiveResolver<any, any, ContextType>;
};
