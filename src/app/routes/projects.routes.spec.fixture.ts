import { getAuthToken } from '@app/controllers/auth.controller';
import { Project, ProjectModel, UserDoc, UserModel, RoleType } from '@app/models';
import { randSubarray, rng } from '@tests/utils';
import * as usersFixture from './users.routes.spec.fixture';
export * from './users.routes.spec.fixture';

export let nomadUser: UserDoc;
export let nomadToken: string;

export let projectMemberUser: UserDoc;
export let projectMemberToken: string;
export let project: Project;
export const allProjects: Project[] = [];

async function createTestProjects(count: number): Promise<void> {
  allProjects.length = 0;
  for (let i = 0; i < count; i++) {
    const projectMembers = randSubarray(usersFixture.allUsers, rng.int(Math.floor(usersFixture.allUsers.length / 4), usersFixture.allUsers.length))
      .map(user => {
        return {
          user: user._id,
          roles: [usersFixture.getRoleId(RoleType.ProjectMember)]
        };
      });
    // Give the first member admin
    projectMembers[0].roles.push(usersFixture.getRoleId(RoleType.ProjectAdmin));
    const newProject = await ProjectModel.create({
      title: `Test Project ${i}`,
      description: 'Testing out the backend!',
      // Randomly generates members using the same seed.
      members: projectMembers
    });
    allProjects.push(newProject);
  }
}

export const init = async(testUserCount: number = 5, testProjectCount: number = 5): Promise<void> => {
  await usersFixture.init(testUserCount);
  await createTestProjects(testProjectCount);

  projectMemberUser = await UserModel.create({
    email: 'testProjectMember@test.com',
    username: 'testprojectmember',
    displayName: 'TestProjectMember',
    password: 'Hashed Password'
  });
  usersFixture.allUsers.push(projectMemberUser);
  projectMemberToken = getAuthToken(projectMemberUser);

  nomadUser = await UserModel.create({
    username: 'nomad',
    displayName: 'Nomad',
    email: 'nomad@test.com',
    password: 'Hashed Password'
  });
  usersFixture.allUsers.push(nomadUser);
  nomadToken = getAuthToken(nomadUser);

  project = await ProjectModel.create({
    title: 'Test Project',
    description: 'Testing out the backend!',
    members: [
      {
        user: usersFixture.user._id,
        roles: [usersFixture.getRoleId(RoleType.ProjectMember), usersFixture.getRoleId(RoleType.ProjectAdmin)]
      },
      {
        user: projectMemberUser._id,
        roles: [usersFixture.getRoleId(RoleType.ProjectMember)]
      }
    ]
  });
  allProjects.push(project);
};
