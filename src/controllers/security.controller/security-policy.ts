import { SecureEntityManagerParams } from '@controllers/entity-manager.controller';
import { PERMISSION } from '@twinlogix/typetta';

function getSecurityPolicy() {
  return (<SecureEntityManagerParams['security']>{
    policies: {
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
            netId: true,
            manualVerified: true,
            username: true,
            displayName: true,
            projectMembers: true,
            classYear: true,
            roles: true,
            socials: true,
            bio: true,
            eBoard: true,
          },
        },
      },
      project: {
        domain: {
          projectId: 'id',
        },
        defaultPermissions: PERMISSION.READ_ONLY,
      },
      projectDiscordConfig: {
        domain: {
          projectId: 'projectId',
        },
        permissions: {
          MANAGE_PROJECT_DISCORD: PERMISSION.READ_ONLY,
        },
      },
      projectMember: {
        domain: {},
        defaultPermissions: PERMISSION.READ_ONLY,
      },
      userLoginIdentity: {
        domain: {
          userId: 'userId',
        },
        permissions: {
          READ_USER_PRIVATE: PERMISSION.READ_ONLY,
        },
      },
      userSocial: {
        domain: {},
        defaultPermissions: PERMISSION.READ_ONLY,
      },
      userRole: {
        domain: {},
        defaultPermissions: PERMISSION.READ_ONLY,
      },
      projectMemberRole: {
        domain: {},
        defaultPermissions: PERMISSION.READ_ONLY,
      },
      eBoard: {
        domain: {},
        defaultPermissions: PERMISSION.READ_ONLY,
      },
      eBoardTerm: {
        domain: {},
        defaultPermissions: PERMISSION.READ_ONLY,
      },
      eBoardTermRole: {
        domain: {},
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
    },
  })?.policies;
}

export const SecurityPolicy = getSecurityPolicy();
