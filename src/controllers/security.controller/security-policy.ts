import { PERMISSION } from "@twinlogix/typetta";

// CONFIG: Security policy
export const SecurityPolicy = {
  user: {
    domain: {
      userId: "id",
    },
    permissions: {
      UPDATE_PROFILE: {
        update: {
          username: true,
          displayName: true,
          projectMembers: true,
          roles: true,
          socials: true,
          bio: true,
        }
      },
      DELETE_PROFILE: PERMISSION.DELETE_ONLY,
      READ_PROFILE_PRIVATE: PERMISSION.READ_ONLY,
    }, 
    defaultPermissions: {
      read: {
        __typename: true,
        avatarLink: true,
        bannerLink: true,
        createdAt: true,
        id: true,
        username: true,
        displayName: true,
        projectMembers: true,
        roles: true,
        socials: true,
        bio: true,
        
        email: false,
        loginIdentities: false,
      }
    },
  },
  project: {
    domain: {
      projectId: "id",
    },
    permissions: {
      CREATE_PROJECT: PERMISSION.CREATE_ONLY,
      DELETE_PROJECT: PERMISSION.DELETE_ONLY,
      UPDATE_PROJECT: {
        completedAt: true,
        name: true,
        description: true,
        cardImageLink: true,
        bannerLink: true,
        galleryImageLinks: true,
        soundcloudEmbedSrc: true,
        downloadLinks: true,
        members: true,
      },
    },
    defaultPermissions: PERMISSION.READ_ONLY
  },
  projectMember: {
    domain: {
      projectMemberId: "id",
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  userLoginIdentity: {
    domain: {
      userId: "userId",
    },
    permissions: {
      UPDATE_PROFILE: PERMISSION.ALLOW,
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  userSocial: {
    domain: {
      userId: "userId",
    },
    permissions: {
      UPDATE_PROFILE: PERMISSION.ALLOW,
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  userRole: {
    domain: {
      userId: "userId",
    },
    permissions: {
      MANAGE_USER_ROLES: PERMISSION.ALLOW,
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  projectMemberRole: {
    domain: {
      projectMemberId: "projectMemberId",
    },
    permissions: {
      MANAGE_PROJECT_MEMBER_ROLES: PERMISSION.ALLOW,
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  eBoard: {
    domain: {
      userId: "userId"
    },
    permissions: {
      MANAGE_EBOARD: PERMISSION.ALLOW
    },
    defaultPermissions: PERMISSION.READ_ONLY 
  },
  eBoardRole: {
    domain: {
      eboardId: "eboardId",
    },
    permissions: {
      MANAGE_EBOARD: PERMISSION.ALLOW,
    },
    defaultPermissions: PERMISSION.READ_ONLY
  },
};