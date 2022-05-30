import * as types from './resolvers.types'
export const resolvers: { Mutation: types.MutationResolvers; Query: types.QueryResolvers } = {
  Query: {
    eBoards: (parent, args, context, info) => context.entityManager.eBoard.resolvers.read(args, info),
    eBoardRoles: (parent, args, context, info) => context.entityManager.eBoardRole.resolvers.read(args, info),
    projects: (parent, args, context, info) => context.entityManager.project.resolvers.read(args, info),
    projectMembers: (parent, args, context, info) => context.entityManager.projectMember.resolvers.read(args, info),
    projectMemberRoles: (parent, args, context, info) => context.entityManager.projectMemberRole.resolvers.read(args, info),
    users: (parent, args, context, info) => context.entityManager.user.resolvers.read(args, info),
    userLoginIdentitys: (parent, args, context, info) => context.entityManager.userLoginIdentity.resolvers.read(args, info),
    userRoles: (parent, args, context, info) => context.entityManager.userRole.resolvers.read(args, info),
    userSocials: (parent, args, context, info) => context.entityManager.userSocial.resolvers.read(args, info),
  },
  Mutation: {
    createEBoard: async (parent, args, context, info) => context.entityManager.eBoard.resolvers.create(args, info),
    updateEBoards: async (parent, args, context) => context.entityManager.eBoard.resolvers.update(args),
    deleteEBoards: async (parent, args, context) => context.entityManager.eBoard.resolvers.delete(args),
    createEBoardRole: async (parent, args, context, info) => context.entityManager.eBoardRole.resolvers.create(args, info),
    updateEBoardRoles: async (parent, args, context) => context.entityManager.eBoardRole.resolvers.update(args),
    deleteEBoardRoles: async (parent, args, context) => context.entityManager.eBoardRole.resolvers.delete(args),
    createProject: async (parent, args, context, info) => context.entityManager.project.resolvers.create(args, info),
    updateProjects: async (parent, args, context) => context.entityManager.project.resolvers.update(args),
    deleteProjects: async (parent, args, context) => context.entityManager.project.resolvers.delete(args),
    createProjectMember: async (parent, args, context, info) => context.entityManager.projectMember.resolvers.create(args, info),
    updateProjectMembers: async (parent, args, context) => context.entityManager.projectMember.resolvers.update(args),
    deleteProjectMembers: async (parent, args, context) => context.entityManager.projectMember.resolvers.delete(args),
    createProjectMemberRole: async (parent, args, context, info) => context.entityManager.projectMemberRole.resolvers.create(args, info),
    updateProjectMemberRoles: async (parent, args, context) => context.entityManager.projectMemberRole.resolvers.update(args),
    deleteProjectMemberRoles: async (parent, args, context) => context.entityManager.projectMemberRole.resolvers.delete(args),
    createUser: async (parent, args, context, info) => context.entityManager.user.resolvers.create(args, info),
    updateUsers: async (parent, args, context) => context.entityManager.user.resolvers.update(args),
    deleteUsers: async (parent, args, context) => context.entityManager.user.resolvers.delete(args),
    createUserLoginIdentity: async (parent, args, context, info) => context.entityManager.userLoginIdentity.resolvers.create(args, info),
    updateUserLoginIdentitys: async (parent, args, context) => context.entityManager.userLoginIdentity.resolvers.update(args),
    deleteUserLoginIdentitys: async (parent, args, context) => context.entityManager.userLoginIdentity.resolvers.delete(args),
    createUserRole: async (parent, args, context, info) => context.entityManager.userRole.resolvers.create(args, info),
    updateUserRoles: async (parent, args, context) => context.entityManager.userRole.resolvers.update(args),
    deleteUserRoles: async (parent, args, context) => context.entityManager.userRole.resolvers.delete(args),
    createUserSocial: async (parent, args, context, info) => context.entityManager.userSocial.resolvers.create(args, info),
    updateUserSocials: async (parent, args, context) => context.entityManager.userSocial.resolvers.update(args),
    deleteUserSocials: async (parent, args, context) => context.entityManager.userSocial.resolvers.delete(args),
  },
}
