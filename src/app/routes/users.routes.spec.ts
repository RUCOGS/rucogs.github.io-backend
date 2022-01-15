import * as server from '@tests/server';
import { Express } from 'express';
import request from 'supertest';
import usersRouter from '@routes/users.routes';
import { getPublicUser, mongoose, Role, RoleModel, User, UserModel } from '@app/models';
import initializeRoles from '@app/init/init-roles';
import { getAuthToken } from '@controllers/auth.controller';
import { convertToWebModel } from '@tests/utils';

const app = server.app;

beforeAll(async() => {
  // Server already starts the db and everything, so no need
  // to start it on our end.
  await server.startServer((app: Express) => {
    app.use('/users', usersRouter);
  });
}, 10_000);
afterAll(async() => { await server.closeServer(); });

// Paramterized test
for (const { testId, testUserCount } of [
  { testId: 1, testUserCount: 0 },
  { testId: 2, testUserCount: 1 },
  { testId: 2, testUserCount: 5 }
]) {
  describe(`User routes [${testId}],`, function() {
    let user: User;
    let adminUser: User;
    let token: string;
    let adminToken: string;
    const allUsers: User[] = [];
    let roles: Role[];

    function getRoleId(name: string): string {
      return roles.find((x) => x.name === name).id;
    }

    async function createTestUsers(amount: number): Promise<void> {
      for (let i = 0; i < 5; i++) {
        const newUser = await UserModel.create({
          email: `test${i}@test.com`,
          username: `test${i}`,
          displayName: `Test${i}`,
          password: `Hashed Password ${i}`
        });
        allUsers.push(newUser);
      }
    }

    beforeEach(async() => {
      await createTestUsers(testUserCount);
      await initializeRoles();
      roles = await RoleModel.find({});
      user = await UserModel.create({
        email: 'test@test.com',
        username: 'test',
        displayName: 'Test',
        password: 'Hashed Password',
        roles: [getRoleId('user')]
      });
      adminUser = await UserModel.create({
        email: 'admin@test.com',
        username: 'admin',
        displayName: 'Admin',
        password: 'Hashed Password',
        roles: [getRoleId('user'), getRoleId('admin')]
      });
      allUsers.push(user);
      allUsers.push(adminUser);

      token = getAuthToken(user);
      adminToken = getAuthToken(adminUser);
    });
    afterEach(async() => {
      allUsers.length = 0;
      await server.clearServer();
    });

    describe('when GET users,', function() {
      it("should return all users' public info", async function() {
        await request(app)
          .get('/users')
          .set('x-access-token', token)
          .expect('Content-Type', 'application/json')
          .expect(200)
          .then((response) => {
            const publicUsers = allUsers.map((user) => getPublicUser(user));
            const responseUsers = (response.body as any[]);
            for (const publicUser of publicUsers) {
              expect(responseUsers).toContain(jasmine.objectContaining(convertToWebModel(publicUser)));
            }
          });
      });

      it('should return public user info if searched user is own user', async function() {
        await request(app)
          .get(`/users/${user._id}`)
          .set('x-access-token', token)
          .expect('Content-Type', 'application/json')
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(jasmine.objectContaining(convertToWebModel(getPublicUser(user))));
          });
      });

      it("should return public user info if searched user isn't own user", async function() {
        for (const someUser of allUsers) {
          if (someUser !== user) {
            await request(app)
              .get(`/users/${someUser._id}`)
              .set('x-access-token', token)
              .expect('Content-Type', 'application/json')
              .expect(200)
              .then((response) => {
                expect(response.body).toEqual(jasmine.objectContaining(convertToWebModel(getPublicUser(someUser))));
              });
          }
        }
      });

      it("should return not found if searched user doesn't exist", async function() {
        const nonexistantId = new mongoose.Types.ObjectId();
        await request(app)
          .get(`/users/${nonexistantId.toString()}`)
          .set('x-access-token', token)
          .expect(404);
      });

      it('if token is invalid, should return unauthorized', async function() {
        await request(app)
          .get('/users')
          .set('x-access-token', 'faketoken')
          .expect(401);
      });

      it('should return unauthorized for searching users if token is invalid', async function() {
        await request(app)
          .get(`/users/${user._id}`)
          .set('x-access-token', 'faketoken')
          .expect(401);
      });
    });

    describe('when GET private users,', function() {
      describe('if you are admin,', function() {
        it("should return all users' full info", async function() {
          await request(app)
            .get('/users/private')
            .set('x-access-token', adminToken)
            .expect('Content-Type', 'application/json')
            .expect(200)
            .then((response) => {
              const responseUsers = (response.body as any[]);
              for (const user of allUsers) {
                expect(responseUsers).toContain(jasmine.objectContaining(convertToWebModel(user)));
              }
            });
        });

        it("should return full user info if searched user isn't own user", async function() {
          for (const someUser of allUsers) {
            if (someUser !== user) {
              await request(app)
                .get(`/users/${someUser._id}/private`)
                .set('x-access-token', adminToken)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .then((response) => {
                  expect(response.body).toEqual(jasmine.objectContaining(convertToWebModel(someUser)));
                });
            }
          }
        });

        it("should return not found if searched user doesn't exist", async function() {
          const nonexistantId = new mongoose.Types.ObjectId();
          await request(app)
            .get(`/users/${nonexistantId.toString()}/private`)
            .set('x-access-token', adminToken)
            .expect(404);
        });
      });

      describe('if you are not admin,', function() {
        it('should return forbidden if you are not admin', async function() {
          await request(app)
            .get('/users/private')
            .set('x-access-token', token)
            .expect('Content-Type', 'application/json')
            .expect(403);
        });

        it('should return your full user info if searched user is own user', async function() {
          await request(app)
            .get(`/users/${user._id}/private`)
            .set('x-access-token', token)
            .expect('Content-Type', 'application/json')
            .expect(200)
            .then((response) => {
              expect(response.body).toEqual(jasmine.objectContaining(convertToWebModel(user)));
            });
        });

        it("should return forbidden if searched user isn't own user", async function() {
          for (const someUser of allUsers) {
            if (someUser !== user) {
              await request(app)
                .get(`/users/${someUser._id}/private`)
                .set('x-access-token', token)
                .expect(403);
            }
          }
        });
      });

      it('if token is invalid, should return unauthorized', async function() {
        await request(app)
          .get('/users/private')
          .set('x-access-token', 'faketoken')
          .expect(401);
      });

      it('should return unauthorized for searching users if token is invalid', async function() {
        await request(app)
          .get(`/users/${user._id}/private`)
          .set('x-access-token', 'faketoken')
          .expect(401);
      });
    });

    describe('when POST user,', function() {
      const newUser = {
        email: 'NewUser@test.com',
        displayName: 'NewUser',
        username: 'newuser',
        password: 'newuserpassword'
      } as User;

      describe('if you are admin,', function() {
        it('should add user to DB', async function() {
          await request(app)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('x-access-token', adminToken)
            .send(newUser);
          await UserModel.findOne(newUser as any)
            .exec((err, user: User | false) => {
              if (err) {
                throw err;
              }
              expect(user).toBeTruthy();
            });
        });
        it('should return posted user', async function() {
          await request(app)
            .post('/users')
            .set('Content-Type', 'application/json')
            .set('x-access-token', adminToken)
            .send(newUser)
            .expect('Content-Type', 'application/json')
            .expect(201)
            .then((response) => {
              expect(response).toEqual(jasmine.objectContaining(convertToWebModel(newUser)));
            });
        });
      });

      describe('if you are not admin,', function() {
        it('should return forbidden', async function() {
          await request(app)
            .post('/users')
            .set('x-access-token', adminToken)
            .send(newUser)
            .expect('Content-Type', 'application/json')
            .expect(403);
        });

        it('should not edit the DB', async function() {
          await request(app)
            .post('/users')
            .set('x-access-token', adminToken)
            .send(newUser);
          await UserModel.findOne(newUser as any)
            .exec((err, user: User | false) => {
              if (err) {
                throw err;
              }
              expect(user).toBeFalsy();
            });
        });
      });

      it('if token is invalid, should return unauthorized', async function() {
        await request(app)
          .post('/users')
          .set('x-access-token', 'faketoken')
          .send(newUser)
          .expect(401);
      });
    });

    describe('when PUT user,', function() {
      const userUpdate = {
        email: 'UpdatedEmail@test.com',
        displayName: 'UpdatedUsername',
        username: 'updatedUsername'
      };

      const roleUpdate = {
        roles: [getRoleId('moderator')]
      };

      // eslint-disable-next-line @typescript-eslint/promise-function-async
      function makeUpdateRequest(userId: string, token: string, updateBody: any): request.Test {
        return request(app)
          .post(`/users/${userId}`)
          .set('x-access-token', token)
          .send(updateBody);
      }

      // eslint-disable-next-line @typescript-eslint/promise-function-async
      function makeUserUpdateRequest(userId: string, token: string): request.Text {
        return makeUpdateRequest(userId, token, userUpdate);
      }

      // eslint-disable-next-line @typescript-eslint/promise-function-async
      function makeRoleUpdateRequest(userId: string, token: string): request.Text {
        return makeUpdateRequest(userId, token, roleUpdate);
      }

      describe('if you are admin,', function() {
        const fullUserUpdate = {
          ...userUpdate,
          ...roleUpdate
        };

        const fullUserUpdateJasmineCompare = {
          ...userUpdate,
          roles: jasmine.objectContaining({
            roles: getRoleId('moderator')
          })
        };

        // eslint-disable-next-line @typescript-eslint/promise-function-async
        function makeAdminAuthFullUserUpdateRequest(userId: string): request.Test {
          return makeUpdateRequest(userId, adminToken, fullUserUpdate);
        }

        it('should update user in DB', async function() {
          for (const someUser of allUsers) {
            await makeAdminAuthFullUserUpdateRequest(someUser._id);
            await UserModel.findById(someUser._id)
              .exec((err, user: User | false) => {
                if (err) {
                  throw err;
                }
                expect(user).toEqual(jasmine.objectContaining(fullUserUpdateJasmineCompare));
              });
          }
        });

        it('should return updated user', async function() {
          await makeAdminAuthFullUserUpdateRequest(user._id)
            .expect('Content-Type', 'application/json')
            .expect(201)
            .then((response) => {
              expect(response).toEqual(jasmine.objectContaining(fullUserUpdateJasmineCompare));
            });
        });

        it("should return not found if searched user doesn't exist", async function() {
          const nonexistantId = new mongoose.Types.ObjectId();
          await makeAdminAuthFullUserUpdateRequest(nonexistantId.toString())
            .expect(404);
        });
      });

      describe('if you are not admin,', function() {
        // eslint-disable-next-line @typescript-eslint/promise-function-async
        function makeUserAuthUserUpdateRequest(user, ) {
          return makeUserUpdateRequest(user, token);
        }

        describe('if update own,', function() {
          // eslint-disable-next-line @typescript-eslint/promise-function-async
          function makeUpdateSelfUserAuthUserUpdateRequest() {

          }

          describe('if update own roles,', function() {
            // eslint-disable-next-line @typescript-eslint/promise-function-async
            function makeUserAuthRoleUpdateRequest(userId: string): request.Test {
              return makeRoleUpdateRequest(userId, token);
            }

            it('should return forbidden', async function() {
              await makeRoleUpdateRequest()
                .expect(403);
            });

            it('should not edit the DB', async function() {
              await makeRoleUpdateRequest()
              await UserModel.findById(user._id)
                .exec((err, foundUser: User | false) => {
                  if (err) {
                    throw err;
                  }
                  expect(foundUser).toEqual(convertToWebModel(user));
                });
            });
          });
        });

        describe('if update another user,', function() {
          // eslint-disable-next-line @typescript-eslint/promise-function-async
          function makeAnotherUserUpdateRequest(someUser: User): request.Test {
            return request(app)
              .post(`/users/${someUser._id}`)
              .set('x-access-token', token)
              .send(roleUpdate);
          }

          it('should return forbidden', async function() {
            for (const someUser of allUsers) {
              if (someUser._id !== user._id) {
                await makeAnotherUserUpdateRequest(someUser)
                  .expect(403);
              }
            }
          });

          it('should not edit the DB', async function() {
            for (const someUser of allUsers) {
              if (someUser._id !== user._id) {
                await makeAnotherUserUpdateRequest(someUser);
                await UserModel.findById(someUser._id)
                  .exec((err, foundUser: User | false) => {
                    if (err) {
                      throw err;
                    }
                    expect(foundUser).toEqual(convertToWebModel(someUser));
                  });
              }
            }
          });
        });
      });
    });

    describe('when DELETE user,', function() {
      // eslint-disable-next-line @typescript-eslint/promise-function-async
      function makeDeleteRequest(someUser: User, token: string): request.Test {
        return request(app)
          .delete(`/users/${someUser._id}`)
          .set('x-access-token', adminToken);
      }

      describe('if you are admin,', function() {
        // eslint-disable-next-line @typescript-eslint/promise-function-async
        function makeAdminDeleteRequest(someUser: User): request.Test {
          return makeDeleteRequest(someUser, adminToken);
        }

        it('should delete user in DB', async function() {
          for (const someUser of allUsers) {
            await makeAdminDeleteRequest(someUser);
            await UserModel.findById(someUser._id)
              .exec((err, user: User | false) => {
                if (err) {
                  throw err;
                }
                expect(user).toBeFalsy();
              });
          }
        });

        it('should return deleted user', async function() {
          await makeAdminDeleteRequest(user)
            .expect('Content-Type', 'application/json')
            .expect(201)
            .then((response) => {
              expect(response).toEqual(jasmine.objectContaining(user));
            });
        });

        it("should return not found if searched user doesn't exist", async function() {
          const nonexistantId = new mongoose.Types.ObjectId();
          await request(app)
            .put(`/users/${nonexistantId.toString()}`)
            .set('x-access-token', token)
            .expect(404);
        });
      });

      describe('if you are not admin,', function() {
        // eslint-disable-next-line @typescript-eslint/promise-function-async
        function makeUserDeleteRequest(someUser: User): request.Test {
          return makeDeleteRequest(someUser, token);
        }

        describe('if deleting another user', function() {
          it('should return forbidden', async function() {
            for (const someUser of allUsers) {
              if (someUser._id !== user._id) {
                await makeUserDeleteRequest(someUser)
                  .expect(403);
              }
            }
          });

          it('should not edit the DB', async function() {
            for (const someUser of allUsers) {
              if (someUser._id !== user._id) {
                await makeUserDeleteRequest(someUser);
                await UserModel.findById(someUser._id)
                  .exec((err, foundUser: User | false) => {
                    if (err) {
                      throw err;
                    }
                    expect(foundUser).toBeTruthy();
                  });
              }
            }
          });
        });

        describe('if deleting own user,', function() {
          // eslint-disable-next-line @typescript-eslint/promise-function-async
          function makeOwnUserDeleteRequest(): request.Test {
            return makeUserDeleteRequest(user);
          }

          it('should delete user in DB', async function() {
            await makeOwnUserDeleteRequest();
            await UserModel.findById(user._id)
              .exec((err, user: User | false) => {
                if (err) {
                  throw err;
                }
                expect(user).toBeFalsy();
              });
          });

          it('should return deleted user', async function() {
            await makeOwnUserDeleteRequest()
              .expect('Content-Type', 'application/json')
              .expect(201)
              .then((response) => {
                expect(response).toEqual(jasmine.objectContaining(user));
              });
          });
        });
      });
    });
  });
}
