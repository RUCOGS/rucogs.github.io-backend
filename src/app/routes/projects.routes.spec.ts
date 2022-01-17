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
import projectsRouter from '@routes/projects.routes';
import { mongoose, ProjectModel } from '@app/models';
import { getWebModel } from '@tests/utils';
import * as fixture from './projects.routes.spec.fixture';

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
    app.use('/projects', projectsRouter);
  });
}, 10_000);
afterAll(async() => { await server.closeServer(); });

describe("'/projects' route,", function() {
  beforeEach(fixture.init);
  afterEach(async() => {
    await server.clearServer();
  });

  describe('when GET projects,', function() {
    function makeRequest(token: string, projectId: string = ''): request.Test {
      if (projectId === '') {
        return request(app)
          .get('/projects')
          .set('x-access-token', token);
      }
      return request(app)
        .get(`/projects/${projectId}`)
        .set('x-access-token', token);
    }

    it('should return all projects', async function() {
      await makeRequest(fixture.token)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          const responseProjects = (response.body as any[]);
          for (const someProject of fixture.allProjects) {
            expect(responseProjects).toContain(joc(getWebModel(someProject)));
          }
        });
    });

    it('should return project info if searched project exists', async function() {
      for (const someProject of fixture.allProjects) {
        if (someProject._id !== fixture.project._id) {
          await makeRequest(fixture.token, someProject._id)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
              expect(response.body).toEqual(joc(getWebModel(someProject)));
            });
        }
      }
    });

    it("should return not found if searched project doesn't exist", async function() {
      const nonexistantId = new mongoose.Types.ObjectId();
      await makeRequest(fixture.token, nonexistantId.toString())
        .expect(404);
    });

    it('if token is invalid, should return unauthorized', async function() {
      await makeRequest('faketoken')
        .expect(401);
    });

    it('should return unauthorized for searching users if token is invalid', async function() {
      await makeRequest('faketoken', fixture.user._id)
        .expect(401);
    });
  });

  describe('when POST project,', function() {
    let newProject: any;
    let newProjectQuery: any;
    let jocNewProject: any;

    beforeEach(() => {
      newProject = {
        title: 'New Project',
        description: 'Put me into the DB!',
        members: [{
          user: fixture.user._id,
          roles: [fixture.getRoleId('project_member'), fixture.getRoleId('project_admin')]
        }]
      };
      newProjectQuery = {
        title: 'New Project',
        description: 'Put me into the DB!'
      };
      jocNewProject = joc({
        title: 'New Project',
        description: 'Put me into the DB!',
        members: [joc({
          user: fixture.user._id.toString(),
          roles: [fixture.getRoleId('project_member'), fixture.getRoleId('project_admin')]
        })]
      });
    });

    function makeRequest(token: string, newProject: any): request.Test {
      return request(app)
        .post('/projects')
        .type('application/json')
        .set('x-access-token', token)
        .send(newProject);
    }

    describe('if you are admin,', function() {
      it('should add project to DB', async function() {
        await makeRequest(fixture.adminToken, newProject);
        expect(await ProjectModel.findOne(newProjectQuery)).toBeTruthy();
      });

      it('should return posted project', async function() {
        const response = await makeRequest(fixture.adminToken, newProject)
          .expect('Content-Type', /json/)
          .expect(201);
        expect(response.body).toEqual(jocNewProject);
      });

      describe('if extra data is sent,', function() {
        let newProjectWithJunk: any;

        beforeEach(() => {
          newProjectWithJunk = {
            junk: 'this is some junk',
            name: 'junk information',
            ...newProject
          };
        });

        it('should return success and ignore extra data', async function() {
          await makeRequest(fixture.adminToken, newProjectWithJunk)
            .expect(201);
        });

        it('should edit the DB and ignore extra data', async function() {
          const response = await makeRequest(fixture.adminToken, newProjectWithJunk);
          expect(response.body).toEqual(jocNewProject);
        });
      });
    });

    describe('if you are not admin,', function() {
      it('should return forbidden', async function() {
        await makeRequest(fixture.token, newProject)
          .expect(403);
      });

      it('should not edit the DB', async function() {
        await makeRequest(fixture.token, newProject);
        expect(await ProjectModel.findOne(newProject)).toBeFalsy();
      });
    });

    it('if token is invalid, should return unauthorized', async function() {
      await makeRequest('invalidToken', newProject)
        .expect(401);
    });
  });

  describe('when PUT project,', function() {
    const projectUpdate = {
      title: 'Updated Project',
      description: 'I have a new description.'
    };

    const immutableUpdate = {
      creationDate: new Date('2019-05-23')
    };

    let memberUpdate: any;
    let fullProjectUpdate: any;
    let jocFullProjectUpdate: any;

    beforeEach(() => {
      memberUpdate = {
        members: [{
          user: fixture.adminUser._id,
          roles: [fixture.getRoleId('project_member'), fixture.getRoleId('project_admin')]
        }]
      };
      fullProjectUpdate = {
        ...projectUpdate,
        ...memberUpdate
      };
      jocFullProjectUpdate = joc({
        ...projectUpdate,
        members: [joc({
          user: fixture.adminUser._id.toString(),
          roles: [fixture.getRoleId('project_member'), fixture.getRoleId('project_admin')]
        })]
      });
    });

    // DO NOT abstract 'makeRequest' further than one level.
    // (ie. `makeRequest()` should not contain another `make...Request()` call.)
    // Any further abstraction within test code will hurt readability, because
    // we end up with atrociously long function names and incredibly scattered code.
    function makeRequest(token: string, projectId: string, updateBody: any): request.Test {
      return request(app)
        .put(`/projects/${projectId}`)
        .type('application/json')
        .set('x-access-token', token)
        .send(updateBody);
    }

    describe('if you are admin,', function() {
      it('should update project in DB', async function() {
        for (const someProject of fixture.allProjects) {
          await makeRequest(fixture.adminToken, someProject._id, fullProjectUpdate);
          expect(getWebModel(await ProjectModel.findById(someProject._id))).toEqual(jocFullProjectUpdate);
        }
      });

      it('should return updated project', async function() {
        await makeRequest(fixture.adminToken, fixture.project._id, fullProjectUpdate)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(jocFullProjectUpdate);
          });
      });

      it("should return not found if searched project doesn't exist", async function() {
        const nonexistantId = new mongoose.Types.ObjectId();
        await makeRequest(fixture.adminToken, nonexistantId.toString(), fullProjectUpdate)
          .expect(404);
      });

      describe('if modifying immutable fields,', function() {
        it('should not edit the DB', async function() {
          await makeRequest(fixture.adminToken, fixture.project._id, immutableUpdate);
          expect(getWebModel(await ProjectModel.findById(fixture.project._id))).toEqual(getWebModel(fixture.project));
        });
      });
    });

    describe('if you are project admin for the project,', function() {
      it('should update project in DB', async function() {
        await makeRequest(fixture.token, fixture.project._id, fullProjectUpdate);
        expect(getWebModel(await ProjectModel.findById(fixture.project._id))).toEqual(jocFullProjectUpdate);
      });

      it('should return updated project', async function() {
        await makeRequest(fixture.token, fixture.project._id, fullProjectUpdate)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(jocFullProjectUpdate);
          });
      });
    });

    describe('if you are only project member for the project', function() {
      it('should return forbidden', async function() {
        await makeRequest(fixture.projectMemberToken, fixture.project._id, fullProjectUpdate)
          .expect(403);
      });

      it('should not edit the DB', async function() {
        await makeRequest(fixture.projectMemberToken, fixture.project._id, fullProjectUpdate);
        expect(getWebModel(await ProjectModel.findById(fixture.project._id))).toEqual(getWebModel(fixture.project));
      });
    });

    describe('if extra data is sent,', function() {
      const projectUpdateWithJunk = {
        junk: 'this is some junk',
        name: 'junk information',
        ...projectUpdate
      };

      it('should return success and ignore extra data', async function() {
        await makeRequest(fixture.token, fixture.project._id, projectUpdateWithJunk)
          .expect(200);
      });

      it('should edit the DB and ignore extra data', async function() {
        await makeRequest(fixture.token, fixture.project._id, projectUpdateWithJunk);
        expect(getWebModel(await ProjectModel.findById(fixture.project._id))).toEqual({ ...getWebModel(fixture.project), ...projectUpdate });
      });
    });

    it('if token is invalid, should return unauthorized', async function() {
      await makeRequest('invalidToken', fixture.project._id, projectUpdate)
        .expect(401);
    });
  });

  describe('when DELETE project,', function() {
    function makeRequest(token: string, projectId: string): request.Test {
      return request(app)
        .delete(`/projects/${projectId}`)
        .set('x-access-token', token);
    }

    describe('if you are admin,', function() {
      it('should delete project in DB', async function() {
        for (const someProject of fixture.allProjects) {
          await makeRequest(fixture.adminToken, someProject._id);
          expect(await ProjectModel.findById(someProject._id)).toBeFalsy();
        }
      });

      it('should return deleted project', async function() {
        await makeRequest(fixture.adminToken, fixture.project._id)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(getWebModel(fixture.project));
          });
      });

      it("should return not found if searched project doesn't exist", async function() {
        const nonexistantId = new mongoose.Types.ObjectId();
        await makeRequest(fixture.adminToken, nonexistantId.toString())
          .expect(404);
      });
    });

    describe('if you are not admin,', function() {
      it('should return forbidden', async function() {
        for (const someProject of fixture.allProjects) {
          if (someProject._id !== fixture.user._id) {
            await makeRequest(fixture.token, someProject._id)
              .expect(403);
          }
        }
      });

      it('should not edit the DB', async function() {
        for (const someProject of fixture.allProjects) {
          if (someProject._id !== fixture.user._id) {
            await makeRequest(fixture.token, someProject._id);
            expect(await ProjectModel.findById(someProject._id)).toBeTruthy();
          }
        }
      });
    });
  });
});
