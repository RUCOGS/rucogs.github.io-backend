import { Request, Response } from 'express';
import * as express from 'express';
import { Project, ProjectModel, RoleType } from '@app/models';
import { AuthJwt } from '@app/middlewares';

const router = express.Router();

router.use(function(req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  res.type('json');
  next();
});

// TODO: Implement pagination using cursors to return only a section of all projects at a time.
//       We can move the cursor around easily without too much cost by calling cursor.skip(number of items);
//       The current implementation may overload the server if there are too many projects.

router.get('/',
  (req: Request & AuthJwt.UserIdMetadata, res: Response) => {
    void ProjectModel.find({}, (err: Error, projects: Project[]) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(200).send(projects);
    });
  });

router.get('/:id',
  (req: Request & AuthJwt.UserIdMetadata, res: Response) => {
    const { id } = req.params;

    // Mongoose automatically casts string ids to ObjectIds.
    void ProjectModel.findById(id, (err: Error, project: Project) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (!project) {
        return res.status(404).send({ message: 'Project not found.' });
      }

      return res.status(200).send(project);
    });
  });

router.post('/',
  [
    AuthJwt.verifyToken,
    AuthJwt.getRoles,
    AuthJwt.hasRole(RoleType.Admin)
  ],
  (req: Request & AuthJwt.UserIdMetadata & AuthJwt.RolesMetadata, res: Response) => {
    // TODO: Add email verification
    //       See this: https://stackoverflow.com/questions/39092822/how-to-confirm-email-address-using-express-node

    void ProjectModel.create(req.body, (err: Error, project: Project) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(201).send(project);
    });
  });

router.put('/:id',
  [
    AuthJwt.verifyToken,
    AuthJwt.getRoles
  ],
  async(req: Request & AuthJwt.UserIdMetadata & AuthJwt.RolesMetadata, res: Response) => {
    const { id } = req.params;

    try {
      const project = await ProjectModel.findById(id);
      if (project === null) {
        res.status(404).send({ message: 'Project not found.' });
        return;
      }
      const isProjectAdmin = await project.isMember(req.userId, RoleType.ProjectAdmin);

      if (req.hasRole(RoleType.Admin) || isProjectAdmin) {
        const updatedProject = await ProjectModel.findByIdAndUpdate(id,
          {
            $set: req.body
          },
          {
            returnDocument: 'after',
            runValidators: true
          });
        res.status(200).send(updatedProject);
        return;
      } else {
        res.status(403).send({ message: 'Unauthorized.' });
        return;
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

router.delete('/:id',
  [
    AuthJwt.verifyToken,
    AuthJwt.getRoles,
    AuthJwt.hasRole(RoleType.Admin)
  ],
  (req: Request & AuthJwt.UserIdMetadata & AuthJwt.RolesMetadata, res: Response) => {
    const { id } = req.params;

    void ProjectModel.findOneAndDelete({ _id: id },
      (err: Error, project: Project) => {
        if (err) {
          return res.status(400).send({ message: err.message });
        }
        if (!project) {
          return res.status(404).send({ message: 'Project not found.' });
        }

        return res.status(200).send(project);
      });
  });

export default router;
