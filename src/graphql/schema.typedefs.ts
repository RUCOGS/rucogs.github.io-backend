import { gql } from 'graphql-tag'

const someVar = `
type Query {
  oof(sdfsd: String!): Boolean
}
`

export default gql`

scalar Date
scalar Json

enum RoleCode {
  SUPER_ADMIN,
  MODERATOR,
  USER,
  PROJECT_MEMBER,
  PROJECT_OWNER,
  
  # EBoard Roles
  PRESIDENT,
  VICE_PRESIDENT,
  EBOARD,
  ALUMNI,
  WEBMASTER,
  TREASURER,
  OUTREACH,
  BOT_DEVELOPER,
  CLUB_GRAPHIC_ARTIST,

  # Public roles
  ARTIST,
  PROGRAMMER,
  GAME_DESIGNER,
  MUSICIAN,
  SOUND_DESIGNER
  WRITER,
}

enum Permission {
  CREATE_PROJECT,
  DELETE_PROJECT,
  UPDATE_PROJECT,
  UPDATE_PROFILE,
  DELETE_PROFILE,
  READ_PROFILE_PRIVATE,
  MANAGE_EBOARD,
  MANAGE_USER_ROLES,
  MANAGE_PROJECT_MEMBER_ROLES,
}

type SomeType @entity @mongodb {
  id: ID! @id(from: "db") @alias(value: "_id")
  someField: Date @schema(metadata: [{ key: "keyOne", value: [{ key: "nestedKey", value: true }] }, { key: "keyTwo", value: [ "one", 2, "three", true ]}])
}

type User @entity @mongodb {
  id: ID! @id(from: "db") @alias(value: "_id")
  createdAt: Date @schema(metadata: [{ key: "createdAt", value: true }])
  updatedAt: Date @schema(metadata: [{ key: "createdAt", value: true }])

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
  eboard: EBoard @foreignRef(refFrom: "userId")
}

type EBoard @entity @mongodb {
  id: ID! @id(from: "db") @alias(value: "_id")
  user: User! @innerRef
  userId: ID!
  createdAt: Date! @default(from: "generator")
  graduatedAt: Date
  roles: [EBoardRole!]! @foreignRef(refFrom: "eboardId")
}

type EBoardRole @entity @mongodb {
  id: ID! @id(from: "db") @alias(value: "_id")
  roleCode: RoleCode!
  eboard: EBoard! @innerRef
  eboardId: ID!
}

type UserRole @entity @mongodb {
  id: ID! @id(from: "db") @alias(value: "_id")
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
  createdAt: Date @schema(metadata: [{ key: "createdAt", value: true }])
  updatedAt: Date @schema(metadata: [{ key: "createdAt", value: true }])

  completedAt: Date
  name: String!
  pitch: String!
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
  createdAt: Date @schema(metadata: [{ key: "createdAt", value: true }])
  updatedAt: Date @schema(metadata: [{ key: "createdAt", value: true }])

  contributions: String!
  roles: [ProjectMemberRole!]! @foreignRef(refFrom: "projectMemberId")         
  project: Project! @innerRef
  projectId: ID!
  user: User! @innerRef
  userId: ID! @schema(metadata: [{unique: 0}])
}

type ProjectMemberRole @entity @mongodb {
  id: ID! @id(from: "db") @alias(value: "_id")
  roleCode: RoleCode! @schema(metadata: [{unique: 0}])
  projectMember: ProjectMember! @innerRef
  projectMemberId: ID!
}
`