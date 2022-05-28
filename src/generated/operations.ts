import { gql } from 'graphql-tag'

export default gql`
  enum SortDirection {
    asc
    desc
  }

  enum StringFilterMode {
    SENSITIVE
    INSENSITIVE
  }

  input StringFilterInput {
    eq: String
    ne: String
    in: [String!]
    nin: [String!]
    exists: Boolean
    contains: String
    startsWith: String
    endsWith: String
    mode: StringFilterMode
  }

  input IntFilterInput {
    eq: Int
    ne: Int
    in: [Int!]
    nin: [Int!]
    exists: Boolean
    gte: Int
    gt: Int
    lte: Int
    lt: Int
  }

  input FloatFilterInput {
    eq: Float
    ne: Float
    in: [Float!]
    nin: [Float!]
    exists: Boolean
    gte: Float
    gt: Float
    lte: Float
    lt: Float
  }

  input BooleanFilterInput {
    eq: Boolean
    ne: Boolean
    in: [Boolean!]
    nin: [Boolean!]
    exists: Boolean
  }

  input IDFilterInput {
    eq: ID
    ne: ID
    in: [ID!]
    nin: [ID!]
    exists: ID
  }

  scalar Date
  scalar Json

  input DateFilterInput {
    eq: Date
    ne: Date
    in: [Date!]
    nin: [Date!]
    exists: Boolean
  }

  input JsonFilterInput {
    eq: Json
    ne: Json
    in: [Json!]
    nin: [Json!]
    exists: Boolean
  }

  input PermissionFilterInput {
    eq: Permission
    ne: Permission
    in: [Permission!]
    nin: [Permission!]
    exists: Boolean
    contains: String
    startsWith: String
    endsWith: String
    mode: StringFilterMode
  }

  input RoleCodeFilterInput {
    eq: RoleCode
    ne: RoleCode
    in: [RoleCode!]
    nin: [RoleCode!]
    exists: Boolean
    contains: String
    startsWith: String
    endsWith: String
    mode: StringFilterMode
  }

  ########### Project ###########
  input ProjectInsertInput {
    bannerLink: String
    cardImageLink: String
    completedAt: Date
    createdAt: Date
    description: String!
    downloadLinks: [String!]!
    galleryImageLinks: [String!]!
    name: String!
    soundcloudEmbedSrc: String
    updatedAt: Date!
  }
  input ProjectUpdateInput {
    bannerLink: String
    cardImageLink: String
    completedAt: Date
    createdAt: Date
    description: String
    downloadLinks: [String!]
    galleryImageLinks: [String!]
    name: String
    soundcloudEmbedSrc: String
    updatedAt: Date
  }
  input ProjectSortInput {
    bannerLink: SortDirection
    cardImageLink: SortDirection
    completedAt: SortDirection
    createdAt: SortDirection
    description: SortDirection
    downloadLinks: SortDirection
    galleryImageLinks: SortDirection
    id: SortDirection
    name: SortDirection
    soundcloudEmbedSrc: SortDirection
    updatedAt: SortDirection
  }
  input ProjectFilterInput {
    bannerLink: StringFilterInput
    cardImageLink: StringFilterInput
    completedAt: DateFilterInput
    createdAt: DateFilterInput
    description: StringFilterInput
    downloadLinks: StringFilterInput
    galleryImageLinks: StringFilterInput
    id: IDFilterInput
    name: StringFilterInput
    soundcloudEmbedSrc: StringFilterInput
    updatedAt: DateFilterInput
    and_: [ProjectFilterInput!]
    or_: [ProjectFilterInput!]
    nor_: [ProjectFilterInput!]
  }
  input ProjectRelationsFilterInput {
    members: ProjectMemberFindInput
  }
  input ProjectFindInput {
    filter: ProjectFilterInput
    sorts: [ProjectSortInput!]
    skip: Int
    limit: Int
    relations: ProjectRelationsFilterInput
  }
  ########### Project ###########

  ########### ProjectMember ###########
  input ProjectMemberInsertInput {
    contributions: String!
    projectId: ID!
    userId: ID!
  }
  input ProjectMemberUpdateInput {
    contributions: String
    projectId: ID
    userId: ID
  }
  input ProjectMemberSortInput {
    contributions: SortDirection
    id: SortDirection
    projectId: SortDirection
    userId: SortDirection
  }
  input ProjectMemberFilterInput {
    contributions: StringFilterInput
    id: IDFilterInput
    projectId: IDFilterInput
    userId: IDFilterInput
    and_: [ProjectMemberFilterInput!]
    or_: [ProjectMemberFilterInput!]
    nor_: [ProjectMemberFilterInput!]
  }
  input ProjectMemberRelationsFilterInput {
    project: ProjectFindInput
    roles: ProjectMemberRoleFindInput
    user: UserFindInput
  }
  input ProjectMemberFindInput {
    filter: ProjectMemberFilterInput
    sorts: [ProjectMemberSortInput!]
    skip: Int
    limit: Int
    relations: ProjectMemberRelationsFilterInput
  }
  ########### ProjectMember ###########

  ########### ProjectMemberRole ###########
  input ProjectMemberRoleInsertInput {
    projectMemberId: ID!
    roleCode: RoleCode!
  }
  input ProjectMemberRoleUpdateInput {
    projectMemberId: ID
    roleCode: RoleCode
  }
  input ProjectMemberRoleSortInput {
    id: SortDirection
    projectMemberId: SortDirection
    roleCode: SortDirection
  }
  input ProjectMemberRoleFilterInput {
    id: IDFilterInput
    projectMemberId: IDFilterInput
    roleCode: RoleCodeFilterInput
    and_: [ProjectMemberRoleFilterInput!]
    or_: [ProjectMemberRoleFilterInput!]
    nor_: [ProjectMemberRoleFilterInput!]
  }
  input ProjectMemberRoleRelationsFilterInput {
    projectMember: ProjectMemberFindInput
    role: RoleFindInput
  }
  input ProjectMemberRoleFindInput {
    filter: ProjectMemberRoleFilterInput
    sorts: [ProjectMemberRoleSortInput!]
    skip: Int
    limit: Int
    relations: ProjectMemberRoleRelationsFilterInput
  }
  ########### ProjectMemberRole ###########

  ########### Role ###########
  input RoleInsertInput {
    code: RoleCode!
    permissions: [Permission]!
  }
  input RoleUpdateInput {
    permissions: [Permission]
  }
  input RoleSortInput {
    code: SortDirection
    permissions: SortDirection
  }
  input RoleFilterInput {
    code: RoleCodeFilterInput
    permissions: PermissionFilterInput
    and_: [RoleFilterInput!]
    or_: [RoleFilterInput!]
    nor_: [RoleFilterInput!]
  }
  input RoleFindInput {
    filter: RoleFilterInput
    sorts: [RoleSortInput!]
    skip: Int
    limit: Int
  }
  ########### Role ###########

  ########### User ###########
  input UserInsertInput {
    avatarLink: String
    bannerLink: String
    bio: String
    createdAt: Date
    displayName: String
    email: String!
    username: String
  }
  input UserUpdateInput {
    avatarLink: String
    bannerLink: String
    bio: String
    createdAt: Date
    displayName: String
    email: String
    username: String
  }
  input UserSortInput {
    avatarLink: SortDirection
    bannerLink: SortDirection
    bio: SortDirection
    createdAt: SortDirection
    displayName: SortDirection
    email: SortDirection
    id: SortDirection
    username: SortDirection
  }
  input UserFilterInput {
    avatarLink: StringFilterInput
    bannerLink: StringFilterInput
    bio: StringFilterInput
    createdAt: DateFilterInput
    displayName: StringFilterInput
    email: StringFilterInput
    id: IDFilterInput
    username: StringFilterInput
    and_: [UserFilterInput!]
    or_: [UserFilterInput!]
    nor_: [UserFilterInput!]
  }
  input UserRelationsFilterInput {
    loginIdentities: UserLoginIdentityFindInput
    projectMembers: ProjectMemberFindInput
    roles: UserRoleFindInput
    socials: UserSocialFindInput
  }
  input UserFindInput {
    filter: UserFilterInput
    sorts: [UserSortInput!]
    skip: Int
    limit: Int
    relations: UserRelationsFilterInput
  }
  ########### User ###########

  ########### UserLoginIdentity ###########
  input UserLoginIdentityInsertInput {
    data: Json
    identityId: String!
    name: String!
    userId: ID!
  }
  input UserLoginIdentityUpdateInput {
    data: Json
    identityId: String
    name: String
    userId: ID
  }
  input UserLoginIdentitySortInput {
    data: SortDirection
    id: SortDirection
    identityId: SortDirection
    name: SortDirection
    userId: SortDirection
  }
  input UserLoginIdentityFilterInput {
    data: JsonFilterInput
    id: IDFilterInput
    identityId: StringFilterInput
    name: StringFilterInput
    userId: IDFilterInput
    and_: [UserLoginIdentityFilterInput!]
    or_: [UserLoginIdentityFilterInput!]
    nor_: [UserLoginIdentityFilterInput!]
  }
  input UserLoginIdentityRelationsFilterInput {
    user: UserFindInput
  }
  input UserLoginIdentityFindInput {
    filter: UserLoginIdentityFilterInput
    sorts: [UserLoginIdentitySortInput!]
    skip: Int
    limit: Int
    relations: UserLoginIdentityRelationsFilterInput
  }
  ########### UserLoginIdentity ###########

  ########### UserRole ###########
  input UserRoleInsertInput {
    roleCode: RoleCode!
    userId: ID!
  }
  input UserRoleUpdateInput {
    roleCode: RoleCode
    userId: ID
  }
  input UserRoleSortInput {
    id: SortDirection
    roleCode: SortDirection
    userId: SortDirection
  }
  input UserRoleFilterInput {
    id: IDFilterInput
    roleCode: RoleCodeFilterInput
    userId: IDFilterInput
    and_: [UserRoleFilterInput!]
    or_: [UserRoleFilterInput!]
    nor_: [UserRoleFilterInput!]
  }
  input UserRoleRelationsFilterInput {
    role: RoleFindInput
    user: UserFindInput
  }
  input UserRoleFindInput {
    filter: UserRoleFilterInput
    sorts: [UserRoleSortInput!]
    skip: Int
    limit: Int
    relations: UserRoleRelationsFilterInput
  }
  ########### UserRole ###########

  ########### UserSocial ###########
  input UserSocialInsertInput {
    link: String!
    platform: String!
    userId: ID!
    username: String!
  }
  input UserSocialUpdateInput {
    link: String
    platform: String
    userId: ID
    username: String
  }
  input UserSocialSortInput {
    id: SortDirection
    link: SortDirection
    platform: SortDirection
    userId: SortDirection
    username: SortDirection
  }
  input UserSocialFilterInput {
    id: IDFilterInput
    link: StringFilterInput
    platform: StringFilterInput
    userId: IDFilterInput
    username: StringFilterInput
    and_: [UserSocialFilterInput!]
    or_: [UserSocialFilterInput!]
    nor_: [UserSocialFilterInput!]
  }
  input UserSocialRelationsFilterInput {
    user: UserFindInput
  }
  input UserSocialFindInput {
    filter: UserSocialFilterInput
    sorts: [UserSocialSortInput!]
    skip: Int
    limit: Int
    relations: UserSocialRelationsFilterInput
  }
  ########### UserSocial ###########

  type Query {
    projects(filter: ProjectFilterInput, sorts: [ProjectSortInput!], relations: ProjectRelationsFilterInput, skip: Int, limit: Int): [Project!]!
    projectMembers(filter: ProjectMemberFilterInput, sorts: [ProjectMemberSortInput!], relations: ProjectMemberRelationsFilterInput, skip: Int, limit: Int): [ProjectMember!]!
    projectMemberRoles(filter: ProjectMemberRoleFilterInput, sorts: [ProjectMemberRoleSortInput!], relations: ProjectMemberRoleRelationsFilterInput, skip: Int, limit: Int): [ProjectMemberRole!]!
    roles(filter: RoleFilterInput, sorts: [RoleSortInput!], skip: Int, limit: Int): [Role!]!
    users(filter: UserFilterInput, sorts: [UserSortInput!], relations: UserRelationsFilterInput, skip: Int, limit: Int): [User!]!
    userLoginIdentitys(filter: UserLoginIdentityFilterInput, sorts: [UserLoginIdentitySortInput!], relations: UserLoginIdentityRelationsFilterInput, skip: Int, limit: Int): [UserLoginIdentity!]!
    userRoles(filter: UserRoleFilterInput, sorts: [UserRoleSortInput!], relations: UserRoleRelationsFilterInput, skip: Int, limit: Int): [UserRole!]!
    userSocials(filter: UserSocialFilterInput, sorts: [UserSocialSortInput!], relations: UserSocialRelationsFilterInput, skip: Int, limit: Int): [UserSocial!]!
  }

  type Mutation {
    createProject(record: ProjectInsertInput!): Project!
    updateProjects(filter: ProjectFilterInput!, changes: ProjectUpdateInput!): Boolean
    deleteProjects(filter: ProjectFilterInput!): Boolean
    createProjectMember(record: ProjectMemberInsertInput!): ProjectMember!
    updateProjectMembers(filter: ProjectMemberFilterInput!, changes: ProjectMemberUpdateInput!): Boolean
    deleteProjectMembers(filter: ProjectMemberFilterInput!): Boolean
    createProjectMemberRole(record: ProjectMemberRoleInsertInput!): ProjectMemberRole!
    updateProjectMemberRoles(filter: ProjectMemberRoleFilterInput!, changes: ProjectMemberRoleUpdateInput!): Boolean
    deleteProjectMemberRoles(filter: ProjectMemberRoleFilterInput!): Boolean
    createRole(record: RoleInsertInput!): Role!
    updateRoles(filter: RoleFilterInput!, changes: RoleUpdateInput!): Boolean
    deleteRoles(filter: RoleFilterInput!): Boolean
    createUser(record: UserInsertInput!): User!
    updateUsers(filter: UserFilterInput!, changes: UserUpdateInput!): Boolean
    deleteUsers(filter: UserFilterInput!): Boolean
    createUserLoginIdentity(record: UserLoginIdentityInsertInput!): UserLoginIdentity!
    updateUserLoginIdentitys(filter: UserLoginIdentityFilterInput!, changes: UserLoginIdentityUpdateInput!): Boolean
    deleteUserLoginIdentitys(filter: UserLoginIdentityFilterInput!): Boolean
    createUserRole(record: UserRoleInsertInput!): UserRole!
    updateUserRoles(filter: UserRoleFilterInput!, changes: UserRoleUpdateInput!): Boolean
    deleteUserRoles(filter: UserRoleFilterInput!): Boolean
    createUserSocial(record: UserSocialInsertInput!): UserSocial!
    updateUserSocials(filter: UserSocialFilterInput!, changes: UserSocialUpdateInput!): Boolean
    deleteUserSocials(filter: UserSocialFilterInput!): Boolean
  }
`
