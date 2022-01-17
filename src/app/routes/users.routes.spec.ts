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
import { getPublicUser, mongoose, UserModel } from '@app/models';
import { getWebModel } from '@tests/utils';
import * as fixture from './users.routes.spec.fixture';

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

describe("'/users' route,", function() {
  beforeEach(fixture.init);
  afterEach(async() => {
    await server.clearServer();
  });

  describe('when GET users,', function() {
    describe('when GET public users,', function() {
      describe('when get all,', function() {
        function makeRequest(token: string): request.Test {
          return request(app)
            .get('/users')
            .set('x-access-token', token);
        }

        it("should return all users' public info", async function() {
          await makeRequest(fixture.token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              const publicUsers = fixture.allUsers.map((user) => getPublicUser(user));
              const responseUsers = (response.body as any[]);
              for (const publicUser of publicUsers) {
                expect(responseUsers).toContain(joc(getWebModel(publicUser)));
              }
            });
        });

        it('if token is invalid, should return unauthorized', async function() {
          await makeRequest('faketoken')
            .expect(401);
        });
      });

      describe('when get specific user,', function() {
        function makeRequest(token: string, userId: string): request.Test {
          return request(app)
            .get(`/users/${userId}`)
            .set('x-access-token', token);
        }

        it('if searched user is own user, should return public user info', async function() {
          await makeRequest(fixture.token, fixture.user._id)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              expect(response.body).toEqual(joc(getWebModel(getPublicUser(fixture.user))));
            });
        });

        it("if searched user isn't own user, should return public user info", async function() {
          for (const someUser of fixture.allUsers) {
            if (someUser !== fixture.user) {
              await makeRequest(fixture.token, someUser._id)
                .expect('Content-Type', /json/)
                .expect(200)
                .then((response) => {
                  expect(response.body).toEqual(joc(getWebModel(getPublicUser(someUser))));
                });
            }
          }
        });

        it("if searched user doesn't exist, should return not found", async function() {
          const nonexistantId = new mongoose.Types.ObjectId();
          await makeRequest(fixture.token, nonexistantId.toString())
            .expect(404);
        });

        it('if token is invalid, should return unauthorized', async function() {
          await makeRequest('faketoken', fixture.user._id)
            .expect(401);
        });
      });
    });

    describe('when GET private users,', function() {
      describe('when get all,', function() {
        function makeRequest(token: string): request.Test {
          return request(app)
            .get('/users/private')
            .set('x-access-token', token);
        }

        describe('if you are admin,', function() {
          it("should return all users' full info", async function() {
            await makeRequest(fixture.adminToken)
              .expect('Content-Type', /json/)
              .expect(200)
              .then((response) => {
                const responseUsers = (response.body as any[]);
                for (const user of fixture.allUsers) {
                  expect(responseUsers).toContain(joc(getWebModel(user)));
                }
              });
          });

          describe('if you are user,', function() {
            it('if get all, should return forbidden', async function() {
              await makeRequest(fixture.token)
                .expect('Content-Type', /json/)
                .expect(403);
            });
          });
        });

        it('if token is invalid, should return unauthorized', async function() {
          await makeRequest('faketoken')
            .expect(401);
        });
      });

      describe('when get specific user,', function() {
        function makeRequest(token: string, userId: string): request.Test {
          return request(app)
            .get(`/users/${userId}/private`)
            .set('x-access-token', token);
        }

        describe('if you are admin,', function() {
          it("should return full user info if searched user isn't own user", async function() {
            for (const someUser of fixture.allUsers) {
              if (someUser !== fixture.user) {
                await makeRequest(fixture.adminToken, someUser._id)
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
            await makeRequest(fixture.adminToken, nonexistantId.toString())
              .expect(404);
          });
        });

        describe('if you are user,', function() {
          it('if searched user is own user, should return your full user info', async function() {
            await makeRequest(fixture.token, fixture.user._id)
              .expect('Content-Type', /json/)
              .expect(200)
              .then((response) => {
                expect(response.body).toEqual(joc(getWebModel(fixture.user)));
              });
          });

          it("if searched user isn't own user, should return forbidden", async function() {
            for (const someUser of fixture.allUsers) {
              if (someUser !== fixture.user) {
                await makeRequest(fixture.token, someUser._id)
                  .expect(403);
              }
            }
          });
        });

        it('if token is invalid, should return unauthorized', async function() {
          await makeRequest('faketoken', fixture.user._id)
            .expect(401);
        });
      });
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

    describe('if extra data is sent,', function() {
      const junk = {
        junk: 'this is some junk',
        name: 'junk information'
      };
      const newUserWithJunk = {
        ...newUser,
        ...junk
      };

      for (const { testId, token } of [
        { testId: 'admin', token: fixture.adminToken }
      ]) {
        describe(`for ${testId},`, function() {
          it('should return success and ignore extra data', async function() {
            await makeRequest(token, newUserWithJunk)
              .expect(201);
          });

          it('should edit the DB and ignore extra data', async function() {
            const response = await makeRequest(token, newUserWithJunk);
            expect(response.body).not.toEqual(joc(getWebModel(junk)));
            expect(response.body).toEqual(joc(getWebModel(newUser)));
          });
        });
      }
    });

    describe('if you are admin,', function() {
      it('should add user to DB', async function() {
        await makeRequest(fixture.adminToken, newUser);
        expect(await UserModel.findOne(newUser)).toBeTruthy();
      });

      it('should return posted user', async function() {
        const response = await makeRequest(fixture.adminToken, newUser)
          .expect('Content-Type', /json/)
          .expect(201);
        expect(response.body).toEqual(joc(getWebModel(newUser)));
      });
    });

    describe('if you are not admin,', function() {
      it('should return forbidden', async function() {
        await makeRequest(fixture.token, newUser)
          .expect(403);
      });

      it('should not edit the DB', async function() {
        await makeRequest(fixture.token, newUser);
        expect(await UserModel.findOne(newUser)).toBeFalsy();
      });
    });

    it('if token is invalid, should return unauthorized', async function() {
      await makeRequest('invalidToken', newUser)
        .expect(401);
    });
  });

  describe('when PUT user,', function() {
    const userLevelUpdate = {
      email: 'UpdatedEmail@test.com',
      displayName: 'UpdatedUsername',
      username: 'updatedUsername'
    };

    let adminLevelUpdate: any;

    beforeEach(() => {
      adminLevelUpdate = {
        roles: [fixture.getRoleId('moderator')]
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
        ...userLevelUpdate,
        ...adminLevelUpdate
      };

      it('should update user in DB', async function() {
        for (const someUser of fixture.allUsers) {
          await makeRequest(fixture.adminToken, someUser._id, fullUserUpdate);
          expect(getWebModel(await UserModel.findById(someUser._id))).toEqual(joc(fullUserUpdate));
        }
      });

      it('should return updated user', async function() {
        await makeRequest(fixture.adminToken, fixture.user._id, fullUserUpdate)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(joc(fullUserUpdate));
          });
      });

      it("should return not found if searched user doesn't exist", async function() {
        const nonexistantId = new mongoose.Types.ObjectId();
        await makeRequest(fixture.adminToken, nonexistantId.toString(), fullUserUpdate)
          .expect(404);
      });
    });

    describe('if you are user,', function() {
      describe('if update own,', function() {
        describe('if update own unauthorized fields,', function() {
          it('should return forbidden', async function() {
            await makeRequest(fixture.token, fixture.user._id, adminLevelUpdate)
              .expect(403);
          });

          it('should not edit the DB', async function() {
            await makeRequest(fixture.token, fixture.user._id, adminLevelUpdate);
            expect(getWebModel(await UserModel.findById(fixture.user._id))).toEqual(getWebModel(fixture.user));
          });
        });
        describe('if update own authorized fields,', function() {
          it('should return updated user', async function() {
            await makeRequest(fixture.token, fixture.user._id, userLevelUpdate)
              .expect('Content-Type', /json/)
              .expect(200)
              .then((response) => {
                expect(response.body).toEqual(joc(userLevelUpdate));
              });
          });

          it('should update user in DB', async function() {
            await makeRequest(fixture.token, fixture.user._id, userLevelUpdate);
            expect(await UserModel.findById(fixture.user._id)).toEqual(joc(userLevelUpdate));
          });
        });
      });

      describe('if update another user,', function() {
        it('should return forbidden', async function() {
          for (const someUser of fixture.allUsers) {
            if (someUser._id !== fixture.user._id) {
              await makeRequest(fixture.token, someUser._id, userLevelUpdate)
                .expect(403);
            }
          }
        });

        it('should not edit the DB', async function() {
          for (const someUser of fixture.allUsers) {
            if (someUser._id !== fixture.user._id) {
              await makeRequest(fixture.token, someUser._id, userLevelUpdate);
              expect(getWebModel(await UserModel.findById(someUser._id))).toEqual(getWebModel(someUser));
            }
          }
        });
      });
    });

    describe('if extra data is sent,', function() {
      const userUpdateWithJunk = {
        junk: 'this is some junk',
        name: 'junk information',
        ...userLevelUpdate
      };

      for (const { testId, token } of [
        { testId: 'admin', token: fixture.adminToken },
        { testId: 'user', token: fixture.token }
      ]) {
        describe(`for ${testId},`, function() {
          it('should return success and ignore extra data', async function() {
            await makeRequest(token, fixture.user._id, userUpdateWithJunk)
              .expect(200);
          });

          it('should edit the DB and ignore extra data', async function() {
            await makeRequest(token, fixture.user._id, userUpdateWithJunk);
            expect(getWebModel(await UserModel.findById(fixture.user._id))).toEqual({ ...getWebModel(fixture.user), ...userLevelUpdate });
          });
        });
      }
    });

    it('if token is invalid, should return unauthorized', async function() {
      await makeRequest('invalidToken', fixture.user._id, userLevelUpdate)
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
        for (const someUser of fixture.allUsers) {
          await makeRequest(fixture.adminToken, someUser._id);
          expect(await UserModel.findById(someUser._id)).toBeFalsy();
        }
      });

      it('should return deleted user', async function() {
        await makeRequest(fixture.adminToken, fixture.user._id)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(getWebModel(fixture.user));
          });
      });

      it("should return not found if searched user doesn't exist", async function() {
        const nonexistantId = new mongoose.Types.ObjectId();
        await makeRequest(fixture.adminToken, nonexistantId.toString())
          .expect(404);
      });
    });

    describe('if you are user,', function() {
      describe('if deleting another user,', function() {
        it('should return forbidden', async function() {
          for (const someUser of fixture.allUsers) {
            if (someUser._id !== fixture.user._id) {
              await makeRequest(fixture.token, someUser._id)
                .expect(403);
            }
          }
        });

        it('should not edit the DB', async function() {
          for (const someUser of fixture.allUsers) {
            if (someUser._id !== fixture.user._id) {
              await makeRequest(fixture.token, someUser._id);
              expect(await UserModel.findById(someUser._id)).toBeTruthy();
            }
          }
        });
      });

      describe('if deleting own user,', function() {
        it('should delete user in DB', async function() {
          await makeRequest(fixture.token, fixture.user._id);
          expect(await UserModel.findById(fixture.user._id)).toBeFalsy();
        });

        it('should return deleted user', async function() {
          await makeRequest(fixture.token, fixture.user._id)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              expect(response.body).toEqual(joc(getWebModel(fixture.user)));
            });
        });
      });
    });
  });
});
