/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/promise-function-async */

import * as server from '@tests/server';
import { Express } from 'express';
import request from 'supertest';
import projectsRouter from '@routes/projects.routes';
import { mongoose, Project, ProjectModel } from '@app/models';
import { getWebModel } from '@tests/utils';
import * as fixture from './projects.routes.spec.fixture';
import { getRoleId } from './users.routes.spec.fixture';

const joc = jasmine.objectContaining;

const app = server.app;

beforeAll(async() => {
  await server.startServer((app: Express) => {
    app.use('/projects', projectsRouter);
  });
}, 10_000);
afterAll(async() => { await server.closeServer(); });

describe("'/projects/:id/members' route,", function() {
  beforeEach(fixture.init);
  afterEach(async() => {
    await server.clearServer();
  });

  describe('when GET member,', function() {
    describe('if get all,', function() {
      function makeRequest(projectId: string): request.Test {
        return request(app)
          .get(`/projects/${projectId}/members`);
      }

      it('should return all members', async function() {
        await makeRequest(fixture.project._id)
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual(joc({
              members: [joc({
                user: fixture.user._id
              })]
            }));
          });
      });
    });

    describe('if get by id,', function() {
      function makeRequest(projectId: string, memberId: string): request.Test {
        return request(app)
          .get(`/projects/${projectId}/members/${memberId}`);
      }

      describe('if member exists', function() {
        // A project member's id is expected
        // to be equal to the member's user id.
        it('should return member', async function() {
          await makeRequest(fixture.project._id, fixture.user._id)
            .expect(200)
            .then((response) => {
              expect(response.body).toEqual(joc({
                user: fixture.user._id,
                roles: [fixture.getRoleId('project_member'), fixture.getRoleId('project_admin')]
              }));
            });
        });
      });

      describe("if member doesn't exist,", function() {
        it('should return not found.', async function() {
          const nonexistantId = new mongoose.Types.ObjectId();
          await makeRequest(fixture.project._id, nonexistantId.toString())
            .expect(404);
        });
      });
    });
  });

  describe('when POST member,', function() {
    // User without a project, which lets us test joining project functionality.
    let completedProject: Project;

    beforeEach(async() => {
      completedProject = await ProjectModel.create({
        title: 'Test Project',
        description: 'Testing out the backend!',
        creationDate: Date.now(),
        completionDate: Date.now(),
        members: [
          {
            user: fixture.user._id,
            roles: [fixture.getRoleId('project_member'), fixture.getRoleId('project_admin')]
          },
          {
            user: fixture.adminUser._id,
            roles: [fixture.getRoleId('project_member'), fixture.getRoleId('project_admin')]
          }
        ]
      });
      fixture.allProjects.push(completedProject);
    });

    function makeRequest(token: string, projectId: string, requestBody: any): request.Test {
      return request(app)
        .post(`/projects/${projectId}/members`)
        .type('application/json')
        .set('x-access-token', token)
        .send(requestBody);
    }

    describe('if admin', function() {
      it('should return location to user', async function() {
        const response = await makeRequest(fixture.adminToken, fixture.project._id, { user: fixture.nomadUser._id })
          .expect(201);
        expect(response.headers['Location']).toBeDefined();
        await request(app)
          .get(response.headers['Location'])
          .expect(201);
      });

      it('should add nomad user', async function() {
        await makeRequest(fixture.adminToken, fixture.project._id, { user: fixture.nomadUser._id });
        expect(getWebModel(await ProjectModel.findById(fixture.project._id)))
          .toEqual(joc({
            roles: joc({
              user: fixture.nomadUser._id
            })
          }));
      });
    });

    describe('if project admin', function() {
      it('should return location to user', async function() {
        const response = await makeRequest(fixture.token, fixture.project._id, { user: fixture.nomadUser._id })
          .expect(201);
        expect(response.headers['Location']).toBeDefined();
        await request(app)
          .get(response.headers['Location'])
          .expect(201);
      });

      it('should add nomad user', async function() {
        await makeRequest(fixture.token, fixture.project._id, { user: fixture.nomadUser._id });
        expect(getWebModel(await ProjectModel.findById(fixture.project._id)))
          .toEqual(joc({
            roles: joc({
              user: fixture.nomadUser._id
            })
          }));
      });
    });

    describe('if not project admin', function() {
      describe('if you are already in project,', function() {
        it('should return bad request', async function() {
          await makeRequest(fixture.token, fixture.project._id, { user: fixture.user._id })
            .expect(400);
        });

        it('should not edit DB', async function() {
          await makeRequest(fixture.token, fixture.project._id, { user: fixture.user._id });
          expect(getWebModel(await ProjectModel.findById(fixture.project._id))).toEqual(getWebModel(fixture.project));
        });
      });

      describe('if project is completed,', function() {
        it('should return bad request', async function() {
          await makeRequest(fixture.nomadToken, completedProject._id, { user: fixture.nomadUser._id })
            .expect(400);
        });

        it('should not edit DB', async function() {
          await makeRequest(fixture.nomadToken, completedProject._id, { user: fixture.nomadUser._id });
          expect(getWebModel(await ProjectModel.findById(completedProject._id))).toEqual(getWebModel(completedProject));
        });
      });

      describe('if project is ongoing,', function() {
        it('should return location to user', async function() {
          const response = await makeRequest(fixture.nomadToken, fixture.project._id, { user: fixture.nomadUser._id })
            .expect(201);
          expect(response.headers['Location']).toBeDefined();
          await request(app)
            .get(response.headers['Location'])
            .expect(201);
        });

        it('should add nomad user to project with default fields', async function() {
          await makeRequest(fixture.nomadToken, fixture.project._id, { user: fixture.nomadUser._id });
          expect(getWebModel(await ProjectModel.findById(fixture.project._id)))
            .toEqual(joc({
              roles: joc({
                user: fixture.nomadUser._id,
                roles: [getRoleId('project_user')]
              })
            }));
        });

        describe('if attempt to set fields outside permission,', function() {
          it('should add nomad user to project with default fields', async function() {
            await makeRequest(fixture.nomadToken, fixture.project._id, { user: fixture.nomadUser._id, roles: [getRoleId('project_user'), getRoleId('project_admin')] });
            expect(getWebModel(await ProjectModel.findById(fixture.project._id)))
              .toEqual(joc({
                roles: joc({
                  user: fixture.nomadUser._id,
                  roles: [getRoleId('project_user')]
                })
              }));
          });
        });
      });
    });
  });

  describe('when PUT member,', function() {
    let weakProjectMemberUpdate: any;
    let fullProjectMemberUpdate: any;

    beforeEach(() => {
      // Regular update cannot add 'project_admin' role.
      weakProjectMemberUpdate = {
        roles: [fixture.getRoleId('project_member')]
      };
      fullProjectMemberUpdate = {
        roles: [fixture.getRoleId('project_member'), fixture.getRoleId('project_admin')]
      };
    });

    function makeRequest(token: string, projectId: string, memberId: string, requestBody: any): request.Test {
      return request(app)
        .put(`/projects/${projectId}/members/${memberId}`)
        .type('application/json')
        .set('x-access-token', token)
        .send(requestBody);
    }

    describe('if admin', function() {
      it('should update user in project', async function() {
        await makeRequest(fixture.adminToken, fixture.project._id, fixture.projectMemberUser._id, fullProjectMemberUpdate);
        expect(getWebModel(await ProjectModel.findById(fixture.project._id)).members)
          .toContain(joc(fullProjectMemberUpdate));
      });
    });

    describe('if project admin', function() {
      it('should update user in project', async function() {
        await makeRequest(fixture.token, fixture.project._id, fixture.projectMemberUser._id, fullProjectMemberUpdate);
        expect(getWebModel(await ProjectModel.findById(fixture.project._id)).members)
          .toContain(joc(fullProjectMemberUpdate));
      });
    });

    describe('if project member', function() {
      it('should update user in project', async function() {
        await makeRequest(fixture.projectMemberToken, fixture.project._id, fixture.projectMemberUser._id, fullProjectMemberUpdate);
        expect(getWebModel(await ProjectModel.findById(fixture.project._id)).members)
          .toContain(joc(fullProjectMemberUpdate));
      });

      describe('if attempt to set fields outside permission,', function() {
        it('should ignore fields outside permission', async function() {
          await makeRequest(fixture.nomadToken, fixture.project._id, fixture.projectMemberUser._id, fullProjectMemberUpdate);
          expect(getWebModel(await ProjectModel.findById(fixture.project._id)).members)
            .toContain(joc(weakProjectMemberUpdate));
        });
      });
    });
  });

  describe('when DELETE member,', function() {
    function makeRequest(token: string, projectId: string, memberId: string): request.Test {
      return request(app)
        .delete(`/projects/${projectId}/members/${memberId}`);
    }

    describe('if admin,', function() {
      it('should delete user from project', async function() {
        await makeRequest(fixture.adminToken, fixture.project._id, fixture.projectMemberUser._id)
          .expect(200);
        expect(await ProjectModel.findById(fixture.project._id)).toBeFalsy();
      });
    });

    describe('if project admin,', function() {
      it('should delete user from project', async function() {
        await makeRequest(fixture.token, fixture.project._id, fixture.projectMemberUser._id)
          .expect(200);
        expect(await ProjectModel.findById(fixture.project._id))
          .not.toContain(joc({
            user: fixture.projectMemberUser._id
          }));
      });
    });

    describe('if project member and deleting self,', function() {
      it('should delete self from project', async function() {
        await makeRequest(fixture.projectMemberToken, fixture.project._id, fixture.projectMemberUser._id)
          .expect(200);
        expect(await ProjectModel.findById(fixture.project._id))
          .not.toContain(joc({
            user: fixture.projectMemberUser._id
          }));
      });
    });

    describe('if outsider', function() {
      it('should return unauthorized', async function() {
        await makeRequest(fixture.nomadToken, fixture.project._id, fixture.projectMemberUser._id)
          .expect(403);
      });

      it('should not edit DB', async function() {
        await makeRequest(fixture.nomadToken, fixture.project._id, fixture.projectMemberUser._id);
        expect(getWebModel(await ProjectModel.findById(fixture.project._id))).toEqual(getWebModel(fixture.project));
      });
    });
  });
});
