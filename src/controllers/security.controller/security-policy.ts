import { PERMISSION } from "@twinlogix/typetta";

// CONFIG: Security policy
export const SecurityPolicy = {
  user: {
    domain: {
      userId: "id",
    },
    permissions: {
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
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  userSocial: {
    domain: {
      userId: "userId",
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  userRole: {
    domain: {
      userId: "userId",
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  projectMemberRole: {
    domain: {
      projectMemberId: "projectMemberId",
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  eBoard: {
    domain: {
      userId: "userId"
    },
    defaultPermissions: PERMISSION.READ_ONLY 
  },
  eBoardRole: {
    domain: {
      eboardId: "eboardId",
    },
    defaultPermissions: PERMISSION.READ_ONLY
  },
};