import * as server from '@tests/server';
import { Express } from 'express';
import request from 'supertest';
import usersRouter from '@routes/users.routes';
import { getPublicUser, mongoose, RoleModel, User, UserModel } from '@app/models';
import initializeRoles from '@app/init/init-roles';
import { getAuthToken } from '@controllers/auth.controller';
import { convertToWebModel } from '@tests/utils';

describe('User routes,', function() {
  const app = server.app;

  beforeAll(async() => {
    // Server already starts the db and everything, so no need
    // to start it on our end.
    await server.startServer((app: Express) => {
      app.use('/users', usersRouter);
    });
  }, 10_000);
  afterAll(async() => { await server.closeServer(); });

  describe('when GET users,', function() {
    let user: User;
    let token: string;
    const allUsers: User[] = [];

    beforeAll(async() => {
      await initializeRoles();
      user = await UserModel.create({
        email: 'test@test.com',
        username: 'test',
        displayName: 'Test',
        password: 'Hashed Password'
      });
      allUsers.push(user);

      token = getAuthToken(user);

      for (let i = 0; i < 10; i++) {
        allUsers.push(await UserModel.create({
          email: `test${i}@test.com`,
          username: `test${i}`,
          displayName: `Test${i}`,
          password: `Hashed Password ${i}`
        }));
      }
    });
    afterAll(async() => { await server.clearServer(); });

    it("should return all users' public info", function(done) {
      void request(app)
        .get('/users')
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          const publicUsers = allUsers.map((user) => getPublicUser(user));
          const responseUsers = (response.body as any[]);
          for (const publicUser of publicUsers) {
            expect(responseUsers).toContain(jasmine.objectContaining(convertToWebModel(publicUser)));
          }
          done();
        });
    });

    it('should return public user info if searched user is own user', function(done) {
      void request(app)
        .get(`/users/${user._id}`)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(jasmine.objectContaining(convertToWebModel(getPublicUser(user))));
          done();
        });
    });

    it("should return public user info if searched user isn't own user", function(done) {
      void request(app)
        .get(`/users/${allUsers[4]._id}`)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(jasmine.objectContaining(convertToWebModel(getPublicUser(allUsers[4]))));
          done();
        });
    });

    it("should return not found if searched user doesn't exist", function(done) {
      const nonexistantId = new mongoose.Types.ObjectId();
      void request(app)
        .get(`/users/${nonexistantId.toString()}`)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          done();
        });
    });

    it('should return unauthorized if token is invalid', function(done) {
      void request(app)
        .get('/users')
        .set('x-access-token', 'faketoken')
        .expect('Content-Type', /json/)
        .expect(401)
        .then((response) => {
          done();
        });
    });

    it('should return unauthorized for searching users if token is invalid', function(done) {
      void request(app)
        .get(`/users/${user._id}`)
        .set('x-access-token', 'faketoken')
        .expect('Content-Type', /json/)
        .expect(401)
        .then((response) => {
          done();
        });
    });
  });

  describe('when GET private users,', function() {
    let user: User;
    let adminUser: User;
    let token: string;
    let adminToken: string;
    const allUsers: User[] = [];

    beforeAll(async() => {
      await initializeRoles();
      const roles = await RoleModel.find({});
      function getRoleId(name: string): string {
        return roles.find((x) => x.name === name).id;
      }

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

      for (let i = 0; i < 10; i++) {
        allUsers.push(await UserModel.create({
          email: `test${i}@test.com`,
          username: `test${i}`,
          displayName: `Test${i}`,
          password: `Hashed Password ${i}`
        }));
      }
    });
    afterAll(async() => { await server.clearServer(); });

    it("should return all users' full info if you are admin", function(done) {
      void request(app)
        .get('/users/private')
        .set('x-access-token', adminToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          const responseUsers = (response.body as any[]);
          for (const user of allUsers) {
            expect(responseUsers).toContain(jasmine.objectContaining(convertToWebModel(user)));
          }
          done();
        });
    });

    it('should return forbidden if you are not admin', function(done) {
      void request(app)
        .get('/users/private')
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(403)
        .then((response) => {
          done();
        });
    });

    it('should return your full user info if searched user is own user', function(done) {
      void request(app)
        .get(`/users/${user._id}/private`)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(jasmine.objectContaining(convertToWebModel(user)));
          done();
        });
    });

    it("should return forbidden if searched user isn't own user and you are not admin", function(done) {
      void request(app)
        .get(`/users/${allUsers[4]._id}/private`)
        .set('x-access-token', token)
        .expect('Content-Type', /json/)
        .expect(403)
        .then((response) => {
          done();
        });
    });

    it("should return full user info if searched user isn't own user but you are admin", function(done) {
      void request(app)
        .get(`/users/${allUsers[4]._id}/private`)
        .set('x-access-token', adminToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(jasmine.objectContaining(convertToWebModel(allUsers[4])));
          done();
        });
    });

    it("should return not found if searched user doesn't exist and your are admin", function(done) {
      const nonexistantId = new mongoose.Types.ObjectId();
      void request(app)
        .get(`/users/${nonexistantId.toString()}/private`)
        .set('x-access-token', adminToken)
        .expect('Content-Type', /json/)
        .expect(404)
        .then((response) => {
          done();
        });
    });

    it('should return unauthorized if token is invalid', function(done) {
      void request(app)
        .get('/users/private')
        .set('x-access-token', 'faketoken')
        .expect('Content-Type', /json/)
        .expect(401)
        .then((response) => {
          done();
        });
    });

    it('should return unauthorized for searching users if token is invalid', function(done) {
      void request(app)
        .get(`/users/${user._id}/private`)
        .set('x-access-token', 'faketoken')
        .expect('Content-Type', /json/)
        .expect(401)
        .then((response) => {
          done();
        });
    });
  });
});
