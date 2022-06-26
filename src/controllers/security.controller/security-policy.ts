import { PERMISSION } from '@twinlogix/typetta';

// CONFIG: Security policy
export const SecurityPolicy = {
  user: {
    domain: {
      userId: 'id',
    },
    permissions: {
      READ_USER_PRIVATE: PERMISSION.READ_ONLY,
    },
    defaultPermissions: {
      read: {
        __typename: true,
        avatarLink: true,
        bannerLink: true,
        createdAt: true,
        updatedAt: true,
        id: true,
        username: true,
        displayName: true,
        projectMembers: true,
        classYear: true,
        roles: true,
        socials: true,
        bio: true,
        eBoard: true,

        email: false,
        loginIdentities: false,
      },
    },
  },
  project: {
    domain: {
      projectId: 'id',
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  projectMember: {
    domain: {
      projectMemberId: 'id',
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  userLoginIdentity: {
    domain: {
      userId: 'userId',
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  userSocial: {
    domain: {
      userId: 'userId',
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  userRole: {
    domain: {
      userId: 'userId',
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  projectMemberRole: {
    domain: {
      projectMemberId: 'projectMemberId',
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  eBoard: {
    domain: {
      userId: 'userId',
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  eBoardTerm: {
    domain: {
      userId: 'userId',
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  eBoardTermRole: {
    domain: {
      eBoardId: 'eBoardId',
    },
    defaultPermissions: PERMISSION.READ_ONLY,
  },
  projectInvite: {
    domain: {
      projectInviteId: 'id',
    },
    permissions: {
      MANAGE_PROJECT_INVITES: PERMISSION.READ_ONLY,
    },
  },
};
