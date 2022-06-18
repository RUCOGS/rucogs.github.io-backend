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
  createdAt: Scalars['Date'];
  graduatedAt?: Maybe<Scalars['Date']>;
  id: Scalars['ID'];
  roles: Array<EBoardRole>;
  user: User;
  userId: Scalars['ID'];
};

export type EBoardRole = {
  __typename?: 'EBoardRole';
  eBoard: EBoard;
  eBoardId: Scalars['ID'];
  id: Scalars['ID'];
  roleCode: RoleCode;
};

export type EBoardSubscriptionFilter = {
  userId?: InputMaybe<Scalars['ID']>;
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
  deleteEBoardRole?: Maybe<Scalars['Boolean']>;
  deleteProject?: Maybe<Scalars['Boolean']>;
  deleteProjectInvite?: Maybe<Scalars['Boolean']>;
  deleteProjectMember?: Maybe<Scalars['Boolean']>;
  deleteProjectMemberRole?: Maybe<Scalars['Boolean']>;
  deleteUserRole?: Maybe<Scalars['Boolean']>;
  joinOpenProject?: Maybe<Scalars['Boolean']>;
  newEBoard: Scalars['ID'];
  newEBoardRole: Scalars['ID'];
  newProject: Scalars['ID'];
  newProjectInvite: Scalars['ID'];
  newProjectMemberRole: Scalars['ID'];
  newUserRole: Scalars['ID'];
  updateEBoard?: Maybe<Scalars['Boolean']>;
  updateProject?: Maybe<Scalars['Boolean']>;
  updateProjectMember?: Maybe<Scalars['Boolean']>;
  updateUser?: Maybe<Scalars['Boolean']>;
};


export type MutationAcceptProjectInviteArgs = {
  inviteId: Scalars['ID'];
};


export type MutationDeleteEBoardArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteEBoardRoleArgs = {
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


export type MutationDeleteProjectMemberRoleArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserRoleArgs = {
  id: Scalars['ID'];
};


export type MutationJoinOpenProjectArgs = {
  projectId: Scalars['ID'];
};


export type MutationNewEBoardArgs = {
  input: NewEBoardInput;
};


export type MutationNewEBoardRoleArgs = {
  input: NewEBoardRoleInput;
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


export type MutationUpdateEBoardArgs = {
  input: UpdateEBoardInput;
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

export type NewEBoardInput = {
  userId: Scalars['ID'];
};

export type NewEBoardRoleInput = {
  eBoardId: Scalars['ID'];
  roleCode: RoleCode;
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

export type NewProjectMemberRoleInput = {
  projectMemberId: Scalars['ID'];
  roleCode: RoleCode;
};

export type NewUserRoleInput = {
  roleCode: RoleCode;
  userId: Scalars['ID'];
};

export const Permission = {
  CreateProject: 'CREATE_PROJECT',
  DeleteProject: 'DELETE_PROJECT',
  DeleteUser: 'DELETE_USER',
  ManageEboard: 'MANAGE_EBOARD',
  ManageEboardRoles: 'MANAGE_EBOARD_ROLES',
  ManageProjectInvites: 'MANAGE_PROJECT_INVITES',
  ManageProjectMember: 'MANAGE_PROJECT_MEMBER',
  ManageProjectMemberRoles: 'MANAGE_PROJECT_MEMBER_ROLES',
  ManageUserRoles: 'MANAGE_USER_ROLES',
  ReadUserPrivate: 'READ_USER_PRIVATE',
  UpdateProject: 'UPDATE_PROJECT',
  UpdateUser: 'UPDATE_USER'
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
  securityContext?: Maybe<Scalars['Json']>;
  securityPolicy?: Maybe<Scalars['Json']>;
};


export type QuerySecurityContextArgs = {
  userId?: InputMaybe<Scalars['ID']>;
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
  eBoardCreated?: Maybe<Scalars['ID']>;
  eBoardDeleted?: Maybe<Scalars['ID']>;
  eBoardUpdated?: Maybe<Scalars['ID']>;
  projectCreated?: Maybe<Scalars['ID']>;
  projectDeleted?: Maybe<Scalars['ID']>;
  projectInviteCreated?: Maybe<Scalars['ID']>;
  projectInviteDeleted?: Maybe<Scalars['ID']>;
  projectMemberCreated?: Maybe<Scalars['ID']>;
  projectMemberDeleted?: Maybe<Scalars['ID']>;
  projectMemberUpdated?: Maybe<Scalars['ID']>;
  projectUpdated?: Maybe<Scalars['ID']>;
  userCreated?: Maybe<Scalars['ID']>;
  userDeleted?: Maybe<Scalars['ID']>;
  userUpdated?: Maybe<Scalars['ID']>;
};


export type SubscriptionEBoardCreatedArgs = {
  filter: EBoardSubscriptionFilter;
};


export type SubscriptionEBoardDeletedArgs = {
  filter: EBoardSubscriptionFilter;
};


export type SubscriptionEBoardUpdatedArgs = {
  filter: EBoardSubscriptionFilter;
};


export type SubscriptionProjectCreatedArgs = {
  filter: ProjectSubscriptionFilter;
};


export type SubscriptionProjectDeletedArgs = {
  filter: ProjectSubscriptionFilter;
};


export type SubscriptionProjectInviteCreatedArgs = {
  filter: ProjectInviteSubscriptionFilter;
};


export type SubscriptionProjectInviteDeletedArgs = {
  filter: ProjectInviteSubscriptionFilter;
};


export type SubscriptionProjectMemberCreatedArgs = {
  filter: ProjectMemberSubscriptionFilter;
};


export type SubscriptionProjectMemberDeletedArgs = {
  filter: ProjectMemberSubscriptionFilter;
};


export type SubscriptionProjectMemberUpdatedArgs = {
  filter: ProjectMemberSubscriptionFilter;
};


export type SubscriptionProjectUpdatedArgs = {
  filter: ProjectSubscriptionFilter;
};


export type SubscriptionUserCreatedArgs = {
  filter: UserSubscriptionFilter;
};


export type SubscriptionUserDeletedArgs = {
  filter: UserSubscriptionFilter;
};


export type SubscriptionUserUpdatedArgs = {
  filter: UserSubscriptionFilter;
};

export type UpdateEBoardInput = {
  graduatedAt: Scalars['ID'];
  id: Scalars['ID'];
  roles?: InputMaybe<Array<RoleCode>>;
};

export type UpdateProjectInput = {
  access?: InputMaybe<Access>;
  banner?: InputMaybe<UploadWithOperation>;
  cardImage?: InputMaybe<UploadWithOperation>;
  description?: InputMaybe<Scalars['String']>;
  downloadLinks?: InputMaybe<Array<Scalars['String']>>;
  galleryImageLinks?: InputMaybe<Array<Scalars['String']>>;
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
  eBoard?: Maybe<EBoard>;
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

export type UserLoginIdentity = {
  __typename?: 'UserLoginIdentity';
  data?: Maybe<Scalars['Json']>;
  id: Scalars['ID'];
  identityId: Scalars['String'];
  name: Scalars['String'];
  user: User;
  userId: Scalars['ID'];
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
  EBoardRole: ResolverTypeWrapper<EBoardRole>;
  EBoardSubscriptionFilter: EBoardSubscriptionFilter;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  InviteType: InviteType;
  Json: ResolverTypeWrapper<Scalars['Json']>;
  Mutation: ResolverTypeWrapper<{}>;
  NewEBoardInput: NewEBoardInput;
  NewEBoardRoleInput: NewEBoardRoleInput;
  NewProjectInput: NewProjectInput;
  NewProjectInviteInput: NewProjectInviteInput;
  NewProjectMemberRoleInput: NewProjectMemberRoleInput;
  NewUserRoleInput: NewUserRoleInput;
  Permission: Permission;
  Project: ResolverTypeWrapper<Project>;
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
  UpdateProjectInput: UpdateProjectInput;
  UpdateProjectMemberInput: UpdateProjectMemberInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserSocialInput: UpdateUserSocialInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  UploadOperation: UploadOperation;
  UploadWithOperation: UploadWithOperation;
  User: ResolverTypeWrapper<User>;
  UserLoginIdentity: ResolverTypeWrapper<UserLoginIdentity>;
  UserRole: ResolverTypeWrapper<UserRole>;
  UserSocial: ResolverTypeWrapper<UserSocial>;
  UserSubscriptionFilter: UserSubscriptionFilter;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Date: Scalars['Date'];
  EBoard: EBoard;
  EBoardRole: EBoardRole;
  EBoardSubscriptionFilter: EBoardSubscriptionFilter;
  ID: Scalars['ID'];
  Json: Scalars['Json'];
  Mutation: {};
  NewEBoardInput: NewEBoardInput;
  NewEBoardRoleInput: NewEBoardRoleInput;
  NewProjectInput: NewProjectInput;
  NewProjectInviteInput: NewProjectInviteInput;
  NewProjectMemberRoleInput: NewProjectMemberRoleInput;
  NewUserRoleInput: NewUserRoleInput;
  Project: Project;
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
  UpdateProjectInput: UpdateProjectInput;
  UpdateProjectMemberInput: UpdateProjectMemberInput;
  UpdateUserInput: UpdateUserInput;
  UpdateUserSocialInput: UpdateUserSocialInput;
  Upload: Scalars['Upload'];
  UploadWithOperation: UploadWithOperation;
  User: User;
  UserLoginIdentity: UserLoginIdentity;
  UserRole: UserRole;
  UserSocial: UserSocial;
  UserSubscriptionFilter: UserSubscriptionFilter;
};

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
  eBoard?: Resolver<ResolversTypes['EBoard'], ParentType, ContextType>;
  eBoardId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  roleCode?: Resolver<ResolversTypes['RoleCode'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Json'], any> {
  name: 'Json';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  acceptProjectInvite?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationAcceptProjectInviteArgs, 'inviteId'>>;
  deleteEBoard?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteEBoardArgs, 'id'>>;
  deleteEBoardRole?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteEBoardRoleArgs, 'id'>>;
  deleteProject?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectArgs, 'id'>>;
  deleteProjectInvite?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectInviteArgs, 'inviteId'>>;
  deleteProjectMember?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectMemberArgs, 'id'>>;
  deleteProjectMemberRole?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProjectMemberRoleArgs, 'id'>>;
  deleteUserRole?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUserRoleArgs, 'id'>>;
  joinOpenProject?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationJoinOpenProjectArgs, 'projectId'>>;
  newEBoard?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationNewEBoardArgs, 'input'>>;
  newEBoardRole?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationNewEBoardRoleArgs, 'input'>>;
  newProject?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationNewProjectArgs, 'input'>>;
  newProjectInvite?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationNewProjectInviteArgs, 'input'>>;
  newProjectMemberRole?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationNewProjectMemberRoleArgs, 'input'>>;
  newUserRole?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationNewUserRoleArgs, 'input'>>;
  updateEBoard?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateEBoardArgs, 'input'>>;
  updateProject?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateProjectArgs, 'input'>>;
  updateProjectMember?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateProjectMemberArgs, 'input'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
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
  tags?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
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
  securityContext?: Resolver<Maybe<ResolversTypes['Json']>, ParentType, ContextType, Partial<QuerySecurityContextArgs>>;
  securityPolicy?: Resolver<Maybe<ResolversTypes['Json']>, ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  eBoardCreated?: SubscriptionResolver<Maybe<ResolversTypes['ID']>, "eBoardCreated", ParentType, ContextType, RequireFields<SubscriptionEBoardCreatedArgs, 'filter'>>;
  eBoardDeleted?: SubscriptionResolver<Maybe<ResolversTypes['ID']>, "eBoardDeleted", ParentType, ContextType, RequireFields<SubscriptionEBoardDeletedArgs, 'filter'>>;
  eBoardUpdated?: SubscriptionResolver<Maybe<ResolversTypes['ID']>, "eBoardUpdated", ParentType, ContextType, RequireFields<SubscriptionEBoardUpdatedArgs, 'filter'>>;
  projectCreated?: SubscriptionResolver<Maybe<ResolversTypes['ID']>, "projectCreated", ParentType, ContextType, RequireFields<SubscriptionProjectCreatedArgs, 'filter'>>;
  projectDeleted?: SubscriptionResolver<Maybe<ResolversTypes['ID']>, "projectDeleted", ParentType, ContextType, RequireFields<SubscriptionProjectDeletedArgs, 'filter'>>;
  projectInviteCreated?: SubscriptionResolver<Maybe<ResolversTypes['ID']>, "projectInviteCreated", ParentType, ContextType, RequireFields<SubscriptionProjectInviteCreatedArgs, 'filter'>>;
  projectInviteDeleted?: SubscriptionResolver<Maybe<ResolversTypes['ID']>, "projectInviteDeleted", ParentType, ContextType, RequireFields<SubscriptionProjectInviteDeletedArgs, 'filter'>>;
  projectMemberCreated?: SubscriptionResolver<Maybe<ResolversTypes['ID']>, "projectMemberCreated", ParentType, ContextType, RequireFields<SubscriptionProjectMemberCreatedArgs, 'filter'>>;
  projectMemberDeleted?: SubscriptionResolver<Maybe<ResolversTypes['ID']>, "projectMemberDeleted", ParentType, ContextType, RequireFields<SubscriptionProjectMemberDeletedArgs, 'filter'>>;
  projectMemberUpdated?: SubscriptionResolver<Maybe<ResolversTypes['ID']>, "projectMemberUpdated", ParentType, ContextType, RequireFields<SubscriptionProjectMemberUpdatedArgs, 'filter'>>;
  projectUpdated?: SubscriptionResolver<Maybe<ResolversTypes['ID']>, "projectUpdated", ParentType, ContextType, RequireFields<SubscriptionProjectUpdatedArgs, 'filter'>>;
  userCreated?: SubscriptionResolver<Maybe<ResolversTypes['ID']>, "userCreated", ParentType, ContextType, RequireFields<SubscriptionUserCreatedArgs, 'filter'>>;
  userDeleted?: SubscriptionResolver<Maybe<ResolversTypes['ID']>, "userDeleted", ParentType, ContextType, RequireFields<SubscriptionUserDeletedArgs, 'filter'>>;
  userUpdated?: SubscriptionResolver<Maybe<ResolversTypes['ID']>, "userUpdated", ParentType, ContextType, RequireFields<SubscriptionUserUpdatedArgs, 'filter'>>;
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
  eBoard?: Resolver<Maybe<ResolversTypes['EBoard']>, ParentType, ContextType>;
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
  Subscription?: SubscriptionResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserLoginIdentity?: UserLoginIdentityResolvers<ContextType>;
  UserRole?: UserRoleResolvers<ContextType>;
  UserSocial?: UserSocialResolvers<ContextType>;
};

