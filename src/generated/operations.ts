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
scalar Upload

          input AccessFilterInput {
            eq: Access
            ne: Access
            in: [Access!]
            nin: [Access!]
            exists: Boolean
            contains: String
startsWith: String
endsWith: String
mode: StringFilterMode
          }

          input DateFilterInput {
            eq: Date
            ne: Date
            in: [Date!]
            nin: [Date!]
            exists: Boolean
          }

          input InviteTypeFilterInput {
            eq: InviteType
            ne: InviteType
            in: [InviteType!]
            nin: [InviteType!]
            exists: Boolean
            contains: String
startsWith: String
endsWith: String
mode: StringFilterMode
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

          input UploadFilterInput {
            eq: Upload
            ne: Upload
            in: [Upload!]
            nin: [Upload!]
            exists: Boolean
          }

          input UploadOperationFilterInput {
            eq: UploadOperation
            ne: UploadOperation
            in: [UploadOperation!]
            nin: [UploadOperation!]
            exists: Boolean
            contains: String
startsWith: String
endsWith: String
mode: StringFilterMode
          }

########### EBoard ###########
      input EBoardInsertInput {
        avatarLink: String
bio: String
createdAt: Date
updatedAt: Date
userId: ID!
      }
      input EBoardUpdateInput {
        avatarLink: String
bio: String
createdAt: Date
updatedAt: Date
userId: ID
      }
      input EBoardSortInput {
        avatarLink: SortDirection
bio: SortDirection
createdAt: SortDirection
id: SortDirection
updatedAt: SortDirection
userId: SortDirection
      }
      input EBoardFilterInput {
        avatarLink: StringFilterInput
bio: StringFilterInput
createdAt: DateFilterInput
id: IDFilterInput
updatedAt: DateFilterInput
userId: IDFilterInput
          and_: [EBoardFilterInput!]
          or_: [EBoardFilterInput!]
          nor_: [EBoardFilterInput!]
      }
      input EBoardRelationsFilterInput {
        terms: EBoardTermFindInput
user: UserFindInput
      }
      input EBoardFindInput {
        filter: EBoardFilterInput
        sorts: [EBoardSortInput!]
        skip: Int
        limit: Int
        relations: EBoardRelationsFilterInput
      }
########### EBoard ###########

########### EBoardTerm ###########
      input EBoardTermInsertInput {
        eBoardId: ID!
year: Int!
      }
      input EBoardTermUpdateInput {
        eBoardId: ID
year: Int
      }
      input EBoardTermSortInput {
        eBoardId: SortDirection
id: SortDirection
year: SortDirection
      }
      input EBoardTermFilterInput {
        eBoardId: IDFilterInput
id: IDFilterInput
year: IntFilterInput
          and_: [EBoardTermFilterInput!]
          or_: [EBoardTermFilterInput!]
          nor_: [EBoardTermFilterInput!]
      }
      input EBoardTermRelationsFilterInput {
        eBoard: EBoardFindInput
roles: EBoardTermRoleFindInput
      }
      input EBoardTermFindInput {
        filter: EBoardTermFilterInput
        sorts: [EBoardTermSortInput!]
        skip: Int
        limit: Int
        relations: EBoardTermRelationsFilterInput
      }
########### EBoardTerm ###########

########### EBoardTermRole ###########
      input EBoardTermRoleInsertInput {
        roleCode: RoleCode!
termId: ID!
      }
      input EBoardTermRoleUpdateInput {
roleCode: RoleCode
termId: ID
      }
      input EBoardTermRoleSortInput {
        id: SortDirection
roleCode: SortDirection
termId: SortDirection
      }
      input EBoardTermRoleFilterInput {
        id: IDFilterInput
roleCode: RoleCodeFilterInput
termId: IDFilterInput
          and_: [EBoardTermRoleFilterInput!]
          or_: [EBoardTermRoleFilterInput!]
          nor_: [EBoardTermRoleFilterInput!]
      }
      input EBoardTermRoleRelationsFilterInput {
        term: EBoardTermFindInput
      }
      input EBoardTermRoleFindInput {
        filter: EBoardTermRoleFilterInput
        sorts: [EBoardTermRoleSortInput!]
        skip: Int
        limit: Int
        relations: EBoardTermRoleRelationsFilterInput
      }
########### EBoardTermRole ###########

########### Project ###########
      input ProjectInsertInput {
        access: Access!
bannerLink: String
cardImageLink: String
completedAt: Date
createdAt: Date
description: String
downloadLinks: [String!]
galleryImageLinks: [String!]
name: String!
pitch: String!
soundcloudEmbedSrc: String
tags: [String!]
updatedAt: Date
      }
      input ProjectUpdateInput {
        access: Access
bannerLink: String
cardImageLink: String
completedAt: Date
createdAt: Date
description: String
downloadLinks: [String!]
galleryImageLinks: [String!]
name: String
pitch: String
soundcloudEmbedSrc: String
tags: [String!]
updatedAt: Date
      }
      input ProjectSortInput {
        access: SortDirection
bannerLink: SortDirection
cardImageLink: SortDirection
completedAt: SortDirection
createdAt: SortDirection
description: SortDirection
downloadLinks: SortDirection
galleryImageLinks: SortDirection
id: SortDirection
name: SortDirection
pitch: SortDirection
soundcloudEmbedSrc: SortDirection
tags: SortDirection
updatedAt: SortDirection
      }
      input ProjectFilterInput {
        access: AccessFilterInput
bannerLink: StringFilterInput
cardImageLink: StringFilterInput
completedAt: DateFilterInput
createdAt: DateFilterInput
description: StringFilterInput
downloadLinks: StringFilterInput
galleryImageLinks: StringFilterInput
id: IDFilterInput
name: StringFilterInput
pitch: StringFilterInput
soundcloudEmbedSrc: StringFilterInput
tags: StringFilterInput
updatedAt: DateFilterInput
          and_: [ProjectFilterInput!]
          or_: [ProjectFilterInput!]
          nor_: [ProjectFilterInput!]
      }
      input ProjectRelationsFilterInput {
        discordConfig: ProjectDiscordConfigFindInput
invites: ProjectInviteFindInput
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

########### ProjectDiscordConfig ###########
      input ProjectDiscordConfigInsertInput {
        categoryId: String
createdAt: Date
projectId: ID!
updatedAt: Date
      }
      input ProjectDiscordConfigUpdateInput {
        categoryId: String
createdAt: Date
projectId: ID
updatedAt: Date
      }
      input ProjectDiscordConfigSortInput {
        categoryId: SortDirection
createdAt: SortDirection
id: SortDirection
projectId: SortDirection
updatedAt: SortDirection
      }
      input ProjectDiscordConfigFilterInput {
        categoryId: StringFilterInput
createdAt: DateFilterInput
id: IDFilterInput
projectId: IDFilterInput
updatedAt: DateFilterInput
          and_: [ProjectDiscordConfigFilterInput!]
          or_: [ProjectDiscordConfigFilterInput!]
          nor_: [ProjectDiscordConfigFilterInput!]
      }
      input ProjectDiscordConfigRelationsFilterInput {
        project: ProjectFindInput
      }
      input ProjectDiscordConfigFindInput {
        filter: ProjectDiscordConfigFilterInput
        sorts: [ProjectDiscordConfigSortInput!]
        skip: Int
        limit: Int
        relations: ProjectDiscordConfigRelationsFilterInput
      }
########### ProjectDiscordConfig ###########

########### ProjectInvite ###########
      input ProjectInviteInsertInput {
        createdAt: Date
projectId: ID!
type: InviteType!
userId: ID!
      }
      input ProjectInviteUpdateInput {
        createdAt: Date
projectId: ID
type: InviteType
userId: ID
      }
      input ProjectInviteSortInput {
        createdAt: SortDirection
id: SortDirection
projectId: SortDirection
type: SortDirection
userId: SortDirection
      }
      input ProjectInviteFilterInput {
        createdAt: DateFilterInput
id: IDFilterInput
projectId: IDFilterInput
type: InviteTypeFilterInput
userId: IDFilterInput
          and_: [ProjectInviteFilterInput!]
          or_: [ProjectInviteFilterInput!]
          nor_: [ProjectInviteFilterInput!]
      }
      input ProjectInviteRelationsFilterInput {
        project: ProjectFindInput
user: UserFindInput
      }
      input ProjectInviteFindInput {
        filter: ProjectInviteFilterInput
        sorts: [ProjectInviteSortInput!]
        skip: Int
        limit: Int
        relations: ProjectInviteRelationsFilterInput
      }
########### ProjectInvite ###########

########### ProjectMember ###########
      input ProjectMemberInsertInput {
        contributions: String
createdAt: Date
projectId: ID!
updatedAt: Date
userId: ID!
      }
      input ProjectMemberUpdateInput {
        contributions: String
createdAt: Date
projectId: ID
updatedAt: Date
userId: ID
      }
      input ProjectMemberSortInput {
        contributions: SortDirection
createdAt: SortDirection
id: SortDirection
projectId: SortDirection
updatedAt: SortDirection
userId: SortDirection
      }
      input ProjectMemberFilterInput {
        contributions: StringFilterInput
createdAt: DateFilterInput
id: IDFilterInput
projectId: IDFilterInput
updatedAt: DateFilterInput
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
      }
      input ProjectMemberRoleFindInput {
        filter: ProjectMemberRoleFilterInput
        sorts: [ProjectMemberRoleSortInput!]
        skip: Int
        limit: Int
        relations: ProjectMemberRoleRelationsFilterInput
      }
########### ProjectMemberRole ###########

########### Subscription ###########
      input SubscriptionInsertInput {
        eBoardCreated: EBoardInsertInput
eBoardDeleted: EBoardInsertInput
eBoardTermCreated: EBoardTermInsertInput
eBoardTermDeleted: EBoardTermInsertInput
eBoardTermUpdated: EBoardTermInsertInput
eBoardUpdated: EBoardInsertInput
projectCreated: ProjectInsertInput
projectDeleted: ProjectInsertInput
projectInviteCreated: ProjectInviteInsertInput
projectInviteDeleted: ProjectInviteInsertInput
projectMemberCreated: ProjectMemberInsertInput
projectMemberDeleted: ProjectMemberInsertInput
projectMemberUpdated: ProjectMemberInsertInput
projectUpdated: ProjectInsertInput
userCreated: UserInsertInput
userDeleted: UserInsertInput
userLoginIdentityCreated: UserLoginIdentityInsertInput
userLoginIdentityDeleted: UserLoginIdentityInsertInput
userLoginIdentityUpdated: UserLoginIdentityInsertInput
userUpdated: UserInsertInput
      }
      input SubscriptionUpdateInput {
        eBoardCreated: EBoardUpdateInput
eBoardDeleted: EBoardUpdateInput
eBoardTermCreated: EBoardTermUpdateInput
eBoardTermDeleted: EBoardTermUpdateInput
eBoardTermUpdated: EBoardTermUpdateInput
eBoardUpdated: EBoardUpdateInput
projectCreated: ProjectUpdateInput
projectDeleted: ProjectUpdateInput
projectInviteCreated: ProjectInviteUpdateInput
projectInviteDeleted: ProjectInviteUpdateInput
projectMemberCreated: ProjectMemberUpdateInput
projectMemberDeleted: ProjectMemberUpdateInput
projectMemberUpdated: ProjectMemberUpdateInput
projectUpdated: ProjectUpdateInput
userCreated: UserUpdateInput
userDeleted: UserUpdateInput
userLoginIdentityCreated: UserLoginIdentityUpdateInput
userLoginIdentityDeleted: UserLoginIdentityUpdateInput
userLoginIdentityUpdated: UserLoginIdentityUpdateInput
userUpdated: UserUpdateInput
      }
      input SubscriptionSortInput {
        eBoardCreated: EBoardSortInput
eBoardDeleted: EBoardSortInput
eBoardTermCreated: EBoardTermSortInput
eBoardTermDeleted: EBoardTermSortInput
eBoardTermUpdated: EBoardTermSortInput
eBoardUpdated: EBoardSortInput
projectCreated: ProjectSortInput
projectDeleted: ProjectSortInput
projectInviteCreated: ProjectInviteSortInput
projectInviteDeleted: ProjectInviteSortInput
projectMemberCreated: ProjectMemberSortInput
projectMemberDeleted: ProjectMemberSortInput
projectMemberUpdated: ProjectMemberSortInput
projectUpdated: ProjectSortInput
userCreated: UserSortInput
userDeleted: UserSortInput
userLoginIdentityCreated: UserLoginIdentitySortInput
userLoginIdentityDeleted: UserLoginIdentitySortInput
userLoginIdentityUpdated: UserLoginIdentitySortInput
userUpdated: UserSortInput
      }
########### Subscription ###########

########### User ###########
      input UserInsertInput {
        avatarLink: String
bannerLink: String
bio: String
classYear: Int
createdAt: Date
displayName: String!
email: String
updatedAt: Date
username: String!
      }
      input UserUpdateInput {
        avatarLink: String
bannerLink: String
bio: String
classYear: Int
createdAt: Date
displayName: String
email: String
updatedAt: Date
username: String
      }
      input UserSortInput {
        avatarLink: SortDirection
bannerLink: SortDirection
bio: SortDirection
classYear: SortDirection
createdAt: SortDirection
displayName: SortDirection
email: SortDirection
id: SortDirection
updatedAt: SortDirection
username: SortDirection
      }
      input UserFilterInput {
        avatarLink: StringFilterInput
bannerLink: StringFilterInput
bio: StringFilterInput
classYear: IntFilterInput
createdAt: DateFilterInput
displayName: StringFilterInput
email: StringFilterInput
id: IDFilterInput
updatedAt: DateFilterInput
username: StringFilterInput
          and_: [UserFilterInput!]
          or_: [UserFilterInput!]
          nor_: [UserFilterInput!]
      }
      input UserRelationsFilterInput {
        eBoard: EBoardFindInput
loginIdentities: UserLoginIdentityFindInput
projectInvites: ProjectInviteFindInput
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
      eBoards(filter: EBoardFilterInput, sorts: [EBoardSortInput!], relations: EBoardRelationsFilterInput, skip: Int, limit: Int): [EBoard!]!
eBoardTerms(filter: EBoardTermFilterInput, sorts: [EBoardTermSortInput!], relations: EBoardTermRelationsFilterInput, skip: Int, limit: Int): [EBoardTerm!]!
eBoardTermRoles(filter: EBoardTermRoleFilterInput, sorts: [EBoardTermRoleSortInput!], relations: EBoardTermRoleRelationsFilterInput, skip: Int, limit: Int): [EBoardTermRole!]!
projects(filter: ProjectFilterInput, sorts: [ProjectSortInput!], relations: ProjectRelationsFilterInput, skip: Int, limit: Int): [Project!]!
projectDiscordConfigs(filter: ProjectDiscordConfigFilterInput, sorts: [ProjectDiscordConfigSortInput!], relations: ProjectDiscordConfigRelationsFilterInput, skip: Int, limit: Int): [ProjectDiscordConfig!]!
projectInvites(filter: ProjectInviteFilterInput, sorts: [ProjectInviteSortInput!], relations: ProjectInviteRelationsFilterInput, skip: Int, limit: Int): [ProjectInvite!]!
projectMembers(filter: ProjectMemberFilterInput, sorts: [ProjectMemberSortInput!], relations: ProjectMemberRelationsFilterInput, skip: Int, limit: Int): [ProjectMember!]!
projectMemberRoles(filter: ProjectMemberRoleFilterInput, sorts: [ProjectMemberRoleSortInput!], relations: ProjectMemberRoleRelationsFilterInput, skip: Int, limit: Int): [ProjectMemberRole!]!
users(filter: UserFilterInput, sorts: [UserSortInput!], relations: UserRelationsFilterInput, skip: Int, limit: Int): [User!]!
userLoginIdentitys(filter: UserLoginIdentityFilterInput, sorts: [UserLoginIdentitySortInput!], relations: UserLoginIdentityRelationsFilterInput, skip: Int, limit: Int): [UserLoginIdentity!]!
userRoles(filter: UserRoleFilterInput, sorts: [UserRoleSortInput!], relations: UserRoleRelationsFilterInput, skip: Int, limit: Int): [UserRole!]!
userSocials(filter: UserSocialFilterInput, sorts: [UserSocialSortInput!], relations: UserSocialRelationsFilterInput, skip: Int, limit: Int): [UserSocial!]!
    }


    type Mutation {
      createEBoard(record: EBoardInsertInput!): EBoard!
updateEBoards(filter: EBoardFilterInput!, changes: EBoardUpdateInput!): Boolean
deleteEBoards(filter: EBoardFilterInput!): Boolean
createEBoardTerm(record: EBoardTermInsertInput!): EBoardTerm!
updateEBoardTerms(filter: EBoardTermFilterInput!, changes: EBoardTermUpdateInput!): Boolean
deleteEBoardTerms(filter: EBoardTermFilterInput!): Boolean
createEBoardTermRole(record: EBoardTermRoleInsertInput!): EBoardTermRole!
updateEBoardTermRoles(filter: EBoardTermRoleFilterInput!, changes: EBoardTermRoleUpdateInput!): Boolean
deleteEBoardTermRoles(filter: EBoardTermRoleFilterInput!): Boolean
createProject(record: ProjectInsertInput!): Project!
updateProjects(filter: ProjectFilterInput!, changes: ProjectUpdateInput!): Boolean
deleteProjects(filter: ProjectFilterInput!): Boolean
createProjectDiscordConfig(record: ProjectDiscordConfigInsertInput!): ProjectDiscordConfig!
updateProjectDiscordConfigs(filter: ProjectDiscordConfigFilterInput!, changes: ProjectDiscordConfigUpdateInput!): Boolean
deleteProjectDiscordConfigs(filter: ProjectDiscordConfigFilterInput!): Boolean
createProjectInvite(record: ProjectInviteInsertInput!): ProjectInvite!
updateProjectInvites(filter: ProjectInviteFilterInput!, changes: ProjectInviteUpdateInput!): Boolean
deleteProjectInvites(filter: ProjectInviteFilterInput!): Boolean
createProjectMember(record: ProjectMemberInsertInput!): ProjectMember!
updateProjectMembers(filter: ProjectMemberFilterInput!, changes: ProjectMemberUpdateInput!): Boolean
deleteProjectMembers(filter: ProjectMemberFilterInput!): Boolean
createProjectMemberRole(record: ProjectMemberRoleInsertInput!): ProjectMemberRole!
updateProjectMemberRoles(filter: ProjectMemberRoleFilterInput!, changes: ProjectMemberRoleUpdateInput!): Boolean
deleteProjectMemberRoles(filter: ProjectMemberRoleFilterInput!): Boolean
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