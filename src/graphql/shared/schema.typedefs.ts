import { gql } from 'apollo-server';

export default gql`
  scalar Date
  scalar Json

  enum RoleCode {
    SUPER_ADMIN
    MODERATOR
    USER

    PROJECT_MEMBER
    PROJECT_OFFICER
    PROJECT_OWNER

    # EBoard Roles
    PRESIDENT
    VICE_PRESIDENT
    EBOARD
    WEBMASTER
    EVENT_COORDINATOR
    TREASURER
    OUTREACH
    BOT_DEVELOPER
    CLUB_GRAPHIC_ARTIST

    # Public roles
    ARTIST
    PROGRAMMER
    GAME_DESIGNER
    MUSICIAN
    SOUND_DESIGNER
    WRITER
  }

  enum Permission {
    CREATE_PROJECT
    DELETE_PROJECT
    UPDATE_PROJECT
    TRANSFER_PROJECT_OWNERSHIP

    MANAGE_PROJECT_INVITES

    CREATE_PROJECT_MEMBER
    MANAGE_PROJECT_MEMBER
    MANAGE_PROJECT_MEMBER_ROLES

    CREATE_USER
    UPDATE_USER
    DELETE_USER
    MANAGE_USER_ROLES
    READ_USER_PRIVATE
    UPDATE_USER_PRIVATE

    MANAGE_EBOARD
    MANAGE_EBOARD_ROLES

    MANAGE_METADATA
  }

  enum Access {
    OPEN
    INVITE
    CLOSED
  }

  enum InviteType {
    INCOMING
    OUTGOING
  }

  type User @entity @mongodb {
    id: ID! @id(from: "db") @alias(value: "_id")
    createdAt: Date @schema(metadata: [{ key: "createdAt", value: true }])
    updatedAt: Date @schema(metadata: [{ key: "updatedAt", value: true }])

    email: String
    username: String!
    displayName: String!
    classYear: Int
    bio: String
    bannerLink: String
    avatarLink: String
    loginIdentities: [UserLoginIdentity!]! @foreignRef(refFrom: "userId")
    socials: [UserSocial!]! @foreignRef(refFrom: "userId")
    projectMembers: [ProjectMember!]! @foreignRef(refFrom: "userId")
    roles: [UserRole!]! @foreignRef(refFrom: "userId")
    eBoard: EBoard @foreignRef(refFrom: "userId")
    projectInvites: [ProjectInvite!]! @foreignRef(refFrom: "userId")
  }

  type EBoard @entity @mongodb {
    id: ID! @id(from: "db") @alias(value: "_id")
    user: User! @innerRef
    userId: ID!
    createdAt: Date @schema(metadata: [{ key: "createdAt", value: true }])
    updatedAt: Date @schema(metadata: [{ key: "updatedAt", value: true }])
    bio: String
    avatarLink: String
    terms: [EBoardTerm!]! @foreignRef(refFrom: "eBoardId")
  }

  type EBoardTerm @entity @mongodb {
    id: ID! @id(from: "db") @alias(value: "_id")
    eBoard: EBoard! @innerRef
    eBoardId: ID!
    year: Int!
    roles: [EBoardTermRole!]! @foreignRef(refFrom: "termId")
  }

  type EBoardTermRole @entity @mongodb {
    id: ID! @id(from: "db") @alias(value: "_id")
    roleCode: RoleCode!
    term: EBoardTerm! @innerRef
    termId: ID!
  }

  type UserRole @entity @mongodb {
    id: ID! @id(from: "db") @alias(value: "_id")
    roleCode: RoleCode! @schema(metadata: [{ key: "unique", value: true }])
    user: User! @innerRef
    userId: ID! @schema(metadata: [{ key: "unique", value: true }])
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
    name: String! @schema(metadata: [{ key: "unique", value: true }])
    identityId: String!
    data: Json
    user: User! @innerRef
    userId: ID!
  }

  type Project @entity @mongodb {
    id: ID! @id(from: "db") @alias(value: "_id")
    createdAt: Date @schema(metadata: [{ key: "createdAt", value: true }])
    updatedAt: Date @schema(metadata: [{ key: "updatedAt", value: true }])

    completedAt: Date
    name: String!
    pitch: String!
    access: Access!
    description: String
    cardImageLink: String
    bannerLink: String
    tags: [String!]
    galleryImageLinks: [String!]
    soundcloudEmbedSrc: String
    downloadLinks: [String!]
    members: [ProjectMember!]! @foreignRef(refFrom: "projectId")
    invites: [ProjectInvite!]! @foreignRef(refFrom: "projectId")
    discordConfig: ProjectDiscordConfig @foreignRef(refFrom: "projectId")
  }

  type ProjectDiscordConfig @entity @mongodb {
    id: ID! @id(from: "db") @alias(value: "_id")
    createdAt: Date @schema(metadata: [{ key: "createdAt", value: true }])
    updatedAt: Date @schema(metadata: [{ key: "updatedAt", value: true }])

    project: Project! @innerRef
    projectId: ID!
    textChannelIds: [String!]
    voiceChannelIds: [String!]
    categoryId: String
  }

  type ProjectMember @entity @mongodb {
    id: ID! @id(from: "db") @alias(value: "_id")
    createdAt: Date @schema(metadata: [{ key: "createdAt", value: true }])
    updatedAt: Date @schema(metadata: [{ key: "updatedAt", value: true }])

    contributions: String
    roles: [ProjectMemberRole!]! @foreignRef(refFrom: "projectMemberId")
    project: Project! @innerRef
    projectId: ID!
    user: User! @innerRef
    userId: ID! @schema(metadata: [{ key: "unique", value: true }])
  }

  type ProjectMemberRole @entity @mongodb {
    id: ID! @id(from: "db") @alias(value: "_id")
    roleCode: RoleCode! @schema(metadata: [{ key: "unique", value: true }])
    projectMember: ProjectMember! @innerRef
    projectMemberId: ID!
  }

  type ProjectInvite @entity @mongodb {
    id: ID! @id(from: "db") @alias(value: "_id")
    createdAt: Date @schema(metadata: [{ key: "createdAt", value: true }])
    type: InviteType!
    user: User! @innerRef
    userId: ID! @schema(metadata: [{ key: "unique", value: true }])
    project: Project! @innerRef
    projectId: ID! @schema(metadata: [{ key: "unique", value: true }])
  }
`;
