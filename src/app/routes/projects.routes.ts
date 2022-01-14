import { Request, Response } from 'express';
import * as express from 'express';
// import { AuthJwt } from '../middlewares';
import { Project, ProjectModel } from '@app/models';
import { AuthJwt } from '@app/middlewares';
import { is } from 'typescript-is';

const router = express.Router();

router.use(function(req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

// TODO: Implement pagination using cursors to return only a section of all projects at a time.
//       We can move the cursor around easily without too much cost by calling cursor.skip(number of items);
//       The current implementation may overload the server if there are too many projects.

router.get('/', [AuthJwt.verifyToken], function(req: Request, res: Response) {
  ProjectModel.find({})
    .exec((err, projects: Project[]) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      return res.status(200).send(projects);
    });
});

router.get('/:id',
  [
    AuthJwt.verifyToken
  ],
  (req: Request, res: Response) => {
    const { id } = req.params;

    if (!is<Project>(req)) {
      return res.status(400).send({ message: 'Expected a Project for the request body!' });
    }

    // Mongoose automatically casts string ids to ObjectIds.
    ProjectModel.findById(id)
      .exec((err, project: Project) => {
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
    AuthJwt.getRoles
    // Anyone can create a project
  ],
  (req: Request, res: Response) => {
    // TODO: Add email verification
    //       See this: https://stackoverflow.com/questions/39092822/how-to-confirm-email-address-using-express-node

    void ProjectModel.create(req.body, (err: Error, project: Project) => {
      if (err) {
        res.status(500).send({ message: err.message });
      }
    });
    // TODO NOW: Store a reference to the newly created project inside the
    //           people who are a part of the project.
  });

router.put('/:id',
  [
    AuthJwt.verifyToken,
    AuthJwt.getRoles
  ],
  (req: Request & AuthJwt.UserIdMetadata & AuthJwt.RolesMetadata, res: Response) => {
    const { id } = req.params;

    // TODO NOW: Find out how to query for a project that contains a member.
    // ProjectModel.find({
    //   match {

    //   }
    // })
    if (id === req.userId || req.hasRole('admin')) {
      void ProjectModel.findByIdAndUpdate(id,
        {
          $setOnInsert: req.body
        },
        {
          new: true
        },
        (err, project) => {
          if (err) {
            res.status(500).send({ message: err.message });
            return;
          }

          res.status(200);
        });
    }
  });

export default router;
