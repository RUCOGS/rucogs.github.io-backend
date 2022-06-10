import { MutationResolvers, Permission, QueryResolvers } from '@src/generated/graphql-endpoint.types';
import { ApolloResolversContext } from '@src/misc/context';
import { makePermsCalc } from '@src/shared/security';
import { HttpError } from '@src/utils';

export default {
  // Mutation: {
  //   sendInvite: async (parent, args, context: ApolloResolversContext, info) => {
  //     if (!context.securityContext)
  //       throw new HttpError(400, "Expected context.securityContext.");
      
  //     // Check permissions
  //     if (!makePermsCalc()
  //         .withContext(context.securityContext)
  //         .hasPermission(Permission.CreateProject)) {
  //       throw new HttpError(401, "Not authorized!");
  //     }

  //     const userId = req.context.securityContext.userId!;
  //     let response = {};
  //     const transSucceeded = await startEntityManagerTransaction(req, next, async (transEntityManager) => {
  //       const insertedProject = await transEntityManager.project.insertOne({
  //         record: {
  //           name: req.body.name,
  //           pitch: req.body.pitch,
  //           access: req.body.access,
  //           description: "",
  //           downloadLinks: [],
  //           galleryImageLinks: [],
  //         }
  //       });

  //       const projectOwner = await transEntityManager.projectMember.insertOne({
  //         record: {
  //           userId,
  //           contributions: "",
  //           projectId: insertedProject.id,
  //           createdAt: Date.now()
  //         }
  //       })

  //       await daoInsertRolesBatch({
  //         dao: transEntityManager.projectMemberRole, 
  //         roleCodes: [RoleCode.ProjectMember, RoleCode.ProjectOwner],
  //         idKey: "projectMemberId",
  //         id: projectOwner.id
  //       });

  //       response = {
  //         message: "New project upload success!",
  //         data: {
  //           id: insertedProject.id
  //         }
  //       };
  //     });
  //     return transSucceeded;
  //   }
  // },
  // Mutation: { 
    
  // }
} as { Query: QueryResolvers, Mutation: MutationResolvers };