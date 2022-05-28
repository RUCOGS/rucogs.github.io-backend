import { gql } from 'graphql-tag'

export default gql`

scalar Date
scalar Json

enum RoleCode {
  SUPER_ADMIN,
  MODERATOR,
  USER,
  PROJECT_MEMBER,
  PROJECT_OWNER,
}

enum Permission {
  CREATE_PROJECT,
  DELETE_PROJECT,
  UPDATE_PROJECT,
  UPDATE_PROFILE,
  DELETE_PROFILE,
  READ_PROFILE_PRIVATE,
  MANAGE_USER_ROLES,
  MANAGE_PROJECT_MEMBER_ROLES,
}

type Role @entity @mongodb {
  code: RoleCode! @id(from: "user")
  permissions: [Permission]!
}

type User @entity @mongodb {
  id: ID! @id(from: "db") @alias(value: "_id")
  createdAt: Date! @default(from: "generator")
  email: String!
  username: String
  displayName: String
  bio: String
  bannerLink: String
  avatarLink: String  
  loginIdentities: [UserLoginIdentity!]! @foreignRef(refFrom: "userId")
  socials: [UserSocial!]! @foreignRef(refFrom: "userId")
  projectMembers: [ProjectMember!]! @foreignRef(refFrom: "userId")
  roles: [UserRole!]! @foreignRef(refFrom: "userId")
}

type UserRole @entity @mongodb {
  id: ID! @id(from: "db") @alias(value: "_id")
  role: Role! @innerRef(refFrom: "roleCode", refTo: "code")
  roleCode: RoleCode! @schema(metadata: [{unique: 0}])
  user: User! @innerRef
  userId: ID! @schema(metadata: [{unique: 0}])
}

type UserSocial @entity @mongodb {
  id: ID! @id(from: "db") @alias(value: "_id")
  platform: String!
  username: String!
  link: String!
  user: User! @innerRef
  userId: ID!
}

type UserLoginIdentity @entity @mongodb {
  id: ID! @id(from: "db") @alias(value: "_id")
  name: String! @schema(metadata: [{unique: 0}])
  identityId: String!
  data: Json
  user: User! @innerRef 
  userId: ID!
}

type Project @entity @mongodb {
  id: ID! @id(from: "db") @alias(value: "_id")
  createdAt: Date! @default(from: "generator")
  updatedAt: Date!
  completedAt: Date
  name: String!
  description: String!
  cardImageLink: String
  bannerLink: String
  galleryImageLinks: [String!]!
  soundcloudEmbedSrc: String
  downloadLinks: [String!]!
  members: [ProjectMember!] @foreignRef(refFrom: "projectId")
}

type ProjectMember @entity @mongodb {
  id: ID! @id(from: "db") @alias(value: "_id")
  contributions: String!
  roles: [ProjectMemberRole!]! @foreignRef(refFrom: "projectMemberId")         
  project: Project! @innerRef
  projectId: ID!
  user: User! @innerRef
  userId: ID! @schema(metadata: [{unique: 0}])
}

type ProjectMemberRole @entity @mongodb {
  id: ID! @id(from: "db") @alias(value: "_id")
  role: Role! @innerRef(refFrom: "roleCode", refTo: "code") @schema(metadata: [{unique: 0}])
  roleCode: RoleCode! @schema(metadata: [{unique: 0}])
  projectMember: ProjectMember! @innerRef
  projectMemberId: ID!
}
`