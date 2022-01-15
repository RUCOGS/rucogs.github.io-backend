/* eslint-disable @typescript-eslint/promise-function-async */

/*

Common Errors:
  "TypeError: mime.getType is not a function"
    You need to set the 'Content-Type' header for the request.

  "describe with no children (describe() or it())"
    it() blocks must have at least one expectation in them.

  result is null for mongoose (err, result) callbacks
    Don't use 'query.exec((err, result) => {})'. It seems like the callback
    inside of exec is broken for some queries. Instead, either do
    'query.exec().then((result) => {}).catch((err) => {})' or just use
    awaits by doing 'const result = await query();`.

  Expected object to be of a kind of Object but as ...
    You need to use 'getWebModel(object)' to convert models that are not
    'web models' (aka models from the body of a web request, which are just
    an object with fields representing data attached to it. There are no
    methods, inheritance, or anything for web models). By converting everything
    to web models, we can then compare them against one another using
    `expect(webModelA).toEqual(webModelB)`.
*/

import * as server from '@tests/server';
import { Express } from 'express';
import request from 'supertest';
import usersRouter from '@routes/users.routes';
import { getPublicUser, mongoose, Role, RoleModel, User, UserModel } from '@app/models';
import initializeRoles from '@app/init/init-roles';
import { getAuthToken } from '@controllers/auth.controller';
import { getWebModel } from '@tests/utils';

// 'joc' is used to build comparison queries for jasmine
// For example if you wanted to check if an object 'A'
// has the key value pairs of another object 'B', you
// could do
//
// expect(A).toEqual(joc(B));
const joc = jasmine.objectContaining;

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
  // { testId: 1, testUserCount: 0 },
  // { testId: 2, testUserCount: 1 },
  { testId: 3, testUserCount: 5 }
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
      allUsers.length = 0;
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
      await server.clearServer();
    });

    describe('when GET users,', function() {
      function makeRequest(token: string, userId: string = ''): request.Test {
        if (userId === '') {
          return request(app)
            .get('/users')
            .set('x-access-token', token);
        }
        return request(app)
          .get(`/users/${userId}`)
          .set('x-access-token', token);
      }

      it("should return all users' public info", async function() {
        await makeRequest(token)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            const publicUsers = allUsers.map((user) => getPublicUser(user));
            const responseUsers = (response.body as any[]);
            for (const publicUser of publicUsers) {
              expect(responseUsers).toContain(joc(getWebModel(publicUser)));
            }
          });
      });

      it('should return public user info if searched user is own user', async function() {
        await makeRequest(token, user._id)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(joc(getWebModel(getPublicUser(user))));
          });
      });

      it("should return public user info if searched user isn't own user", async function() {
        for (const someUser of allUsers) {
          if (someUser !== user) {
            await makeRequest(token, someUser._id)
              .expect('Content-Type', /json/)
              .expect(200)
              .then((response) => {
                expect(response.body).toEqual(joc(getWebModel(getPublicUser(someUser))));
              });
          }
        }
      });

      it("should return not found if searched user doesn't exist", async function() {
        const nonexistantId = new mongoose.Types.ObjectId();
        await makeRequest(token, nonexistantId.toString())
          .expect(404);
      });

      it('if token is invalid, should return unauthorized', async function() {
        await makeRequest('faketoken')
          .expect(401);
      });

      it('should return unauthorized for searching users if token is invalid', async function() {
        await makeRequest('faketoken', user._id)
          .expect(401);
      });
    });

    describe('when GET private users,', function() {
      function makeRequest(token: string, userId: string = ''): request.Test {
        if (userId === '') {
          return request(app)
            .get('/users/private')
            .set('x-access-token', token);
        }
        return request(app)
          .get(`/users/${userId}/private`)
          .set('x-access-token', token);
      }

      describe('if you are admin,', function() {
        it("should return all users' full info", async function() {
          await makeRequest(adminToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              const responseUsers = (response.body as any[]);
              for (const user of allUsers) {
                expect(responseUsers).toContain(joc(getWebModel(user)));
              }
            });
        });

        it("should return full user info if searched user isn't own user", async function() {
          for (const someUser of allUsers) {
            if (someUser !== user) {
              await makeRequest(adminToken, someUser._id)
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                  expect(response.body).toEqual(joc(getWebModel(someUser)));
                });
            }
          }
        });

        it("should return not found if searched user doesn't exist", async function() {
          const nonexistantId = new mongoose.Types.ObjectId();
          await makeRequest(adminToken, nonexistantId.toString())
            .expect(404);
        });
      });

      describe('if you are not admin,', function() {
        it('should return forbidden if you are not admin', async function() {
          await makeRequest(token)
            .expect('Content-Type', /json/)
            .expect(403);
        });

        it('should return your full user info if searched user is own user', async function() {
          await makeRequest(token, user._id)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              expect(response.body).toEqual(joc(getWebModel(user)));
            });
        });

        it("should return forbidden if searched user isn't own user", async function() {
          for (const someUser of allUsers) {
            if (someUser !== user) {
              await makeRequest(token, someUser._id)
                .expect(403);
            }
          }
        });
      });

      it('if token is invalid, should return unauthorized', async function() {
        await makeRequest('faketoken')
          .expect(401);
      });

      it('if token is invalid, if searching users, should return unauthorized', async function() {
        await makeRequest('faketoken', user._id)
          .expect(401);
      });
    });

    describe('when POST user,', function() {
      const newUser = {
        email: 'NewUser@test.com',
        displayName: 'NewUser',
        username: 'newuser',
        password: 'newuserpassword'
      };

      function makeRequest(token: string, newUser: any): request.Test {
        return request(app)
          .post('/users')
          .type('application/json')
          .set('x-access-token', token)
          .send(newUser);
      }

      describe('if you are admin,', function() {
        it('should add user to DB', async function() {
          await makeRequest(adminToken, newUser);
          expect(await UserModel.findOne(newUser)).toBeTruthy();
        });
        it('should return posted user', async function() {
          await makeRequest(adminToken, newUser)
            .expect('Content-Type', /json/)
            .expect(201)
            .then((response) => {
              expect(response.body).toEqual(joc(getWebModel(newUser)));
            });
        });
      });

      describe('if you are not admin,', function() {
        it('should return forbidden', async function() {
          await makeRequest(token, newUser)
            .expect(403);
        });

        it('should not edit the DB', async function() {
          await makeRequest(token, newUser);
          expect(await UserModel.findOne(newUser)).toBeFalsy();
        });
      });

      it('if token is invalid, should return unauthorized', async function() {
        await makeRequest('invalidToken', newUser)
          .expect(401);
      });
    });

    describe('when PUT user,', function() {
      const userUpdate = {
        email: 'UpdatedEmail@test.com',
        displayName: 'UpdatedUsername',
        username: 'updatedUsername'
      };

      let roleUpdate: any;

      beforeEach(() => {
        roleUpdate = {
          roles: [getRoleId('moderator')]
        };
      });

      // DO NOT abstract 'makeRequest' further than one level.
      // (ie. `makeRequest()` should not contain another `make...Request()` call.)
      // Any further abstraction within test code will hurt readability, because
      // we end up with atrociously long function names and incredibly scattered code.
      function makeRequest(token: string, userId: string, updateBody: any): request.Test {
        return request(app)
          .put(`/users/${userId}`)
          .type('application/json')
          .set('x-access-token', token)
          .send(updateBody);
      }

      describe('if you are admin,', function() {
        const fullUserUpdate = {
          ...userUpdate,
          ...roleUpdate
        };

        it('should update user in DB', async function() {
          for (const someUser of allUsers) {
            await makeRequest(adminToken, someUser._id, fullUserUpdate);
            expect(getWebModel(await UserModel.findById(someUser._id))).toEqual(joc(fullUserUpdate));
          }
        });

        it('should return updated user', async function() {
          await makeRequest(adminToken, user._id, fullUserUpdate)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              expect(response.body).toEqual(joc(fullUserUpdate));
            });
        });

        it("should return not found if searched user doesn't exist", async function() {
          const nonexistantId = new mongoose.Types.ObjectId();
          await makeRequest(adminToken, nonexistantId.toString(), fullUserUpdate)
            .expect(404);
        });
      });

      describe('if you are not admin,', function() {
        describe('if update own,', function() {
          describe('if update own roles,', function() {
            it('should return forbidden', async function() {
              await makeRequest(token, user._id, roleUpdate)
                .expect(403);
            });

            it('should not edit the DB', async function() {
              await makeRequest(token, user._id, roleUpdate);
              expect(getWebModel(await UserModel.findById(user._id))).toEqual(getWebModel(user));
            });
          });
          describe('if update own user info,', function() {
            it('should return updated user', async function() {
              await makeRequest(token, user._id, userUpdate)
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                  expect(response.body).toEqual(joc(userUpdate));
                });
            });

            it('should update user in DB', async function() {
              await makeRequest(token, user._id, userUpdate);
              expect(await UserModel.findById(user._id)).toEqual(joc(userUpdate));
            });
          });
        });

        describe('if update another user,', function() {
          it('should return forbidden', async function() {
            for (const someUser of allUsers) {
              if (someUser._id !== user._id) {
                await makeRequest(token, someUser._id, userUpdate)
                  .expect(403);
              }
            }
          });

          it('should not edit the DB', async function() {
            for (const someUser of allUsers) {
              if (someUser._id !== user._id) {
                await makeRequest(token, someUser._id, userUpdate);
                expect(getWebModel(await UserModel.findById(someUser._id))).toEqual(getWebModel(someUser));
              }
            }
          });
        });
      });

      it('if token is invalid, should return unauthorized', async function() {
        await makeRequest('invalidToken', user._id, userUpdate)
          .expect(401);
      });
    });

    describe('when DELETE user,', function() {
      function makeRequest(token: string, userId: string): request.Test {
        return request(app)
          .delete(`/users/${userId}`)
          .set('x-access-token', token);
      }

      describe('if you are admin,', function() {
        it('should delete user in DB', async function() {
          for (const someUser of allUsers) {
            await makeRequest(adminToken, someUser._id);
            expect(await UserModel.findById(someUser._id)).toBeFalsy();
          }
        });

        it('should return deleted user', async function() {
          await makeRequest(adminToken, user._id)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              expect(response.body).toEqual(getWebModel(user));
            });
        });

        it("should return not found if searched user doesn't exist", async function() {
          const nonexistantId = new mongoose.Types.ObjectId();
          await makeRequest(adminToken, nonexistantId.toString())
            .expect(404);
        });
      });

      describe('if you are not admin,', function() {
        describe('if deleting another user,', function() {
          it('should return forbidden', async function() {
            for (const someUser of allUsers) {
              if (someUser._id !== user._id) {
                await makeRequest(token, someUser._id)
                  .expect(403);
              }
            }
          });

          it('should not edit the DB', async function() {
            for (const someUser of allUsers) {
              if (someUser._id !== user._id) {
                await makeRequest(token, someUser._id);
                expect(await UserModel.findById(someUser._id)).toBeTruthy();
              }
            }
          });
        });

        describe('if deleting own user,', function() {
          it('should delete user in DB', async function() {
            await makeRequest(token, user._id);
            expect(await UserModel.findById(user._id)).toBeFalsy();
          });

          it('should return deleted user', async function() {
            await makeRequest(token, user._id)
              .expect('Content-Type', /json/)
              .expect(200)
              .then((response) => {
                expect(response.body).toEqual(joc(getWebModel(user)));
              });
          });
        });
      });
    });
  });
}
