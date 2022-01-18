import { getAuthToken } from '@app/controllers/auth.controller';
import initializeRoles from '@init/init-roles';
import { Role, RoleModel, UserModel, UserDoc, RoleType } from '@app/models';

export let user: UserDoc;
export let adminUser: UserDoc;
export let token: string;
export let adminToken: string;
export const allUsers: UserDoc[] = [];
export let roles: Role[];

export function getRoleId(name: string): string {
  return roles.find((x) => x.name === name).id;
}

async function createTestUsers(count: number): Promise<void> {
  allUsers.length = 0;
  for (let i = 0; i < count; i++) {
    const newUser = await UserModel.create({
      email: `test${i}@test.com`,
      username: `test${i}`,
      displayName: `Test${i}`,
      password: `Hashed Password ${i}`
    });
    allUsers.push(newUser);
  }
}

export const init = async(testUserCount: number = 5): Promise<void> => {
  await initializeRoles();
  roles = await RoleModel.find({});
  await createTestUsers(testUserCount);
  user = await UserModel.create({
    email: 'test@test.com',
    username: 'test',
    displayName: 'Test',
    password: 'Hashed Password',
    roles: [getRoleId(RoleType.User)]
  });
  adminUser = await UserModel.create({
    email: 'admin@test.com',
    username: 'admin',
    displayName: 'Admin',
    password: 'Hashed Password',
    roles: [getRoleId(RoleType.User), getRoleId(RoleType.Admin)]
  });

  allUsers.push(user);
  allUsers.push(adminUser);

  token = getAuthToken(user);
  adminToken = getAuthToken(adminUser);
};
