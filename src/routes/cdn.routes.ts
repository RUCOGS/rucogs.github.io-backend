import { UPLOAD_DIRECTORY } from '@src/controllers/cdn.controller';
import express from 'express';
import got from 'got-cjs';
import sharp from 'sharp';

// ----- START HELPER ----- //
function keys<T extends object>(obj: T) {
  return Object.keys(obj) as Array<keyof T>;
}
// ----- END HELPER ------- //

const router = express.Router();

router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
  next();
});

// ----- REFRESH TOKENS ----- //
// router.post('/token', authController.processRefreshToken);

router.use('/cdn/dynamic/', (req, res, next) => {
  let image =
    req.query.src && typeof req.query.src === 'string'
      ? req.query.src
      : 'https://thumbs.dreamstime.com/b/businessman-hand-writing-demo-marker-business-concep-concept-96434578.jpg';

  let width = parseInt(req.query.width && typeof req.query.width === 'string' ? req.query.width : '100');
  let height = parseInt(req.query.height && typeof req.query.height === 'string' ? req.query.height : '100');

  width = Math.max(width, 600);
  height = Math.max(height, 600);

  var transformer = sharp()
    .resize(width, height, {
      fit: 'cover',
    })
    .on('info', function (info) {
      console.log(`⬆️ Resized image to [${info.width}, ${info.height}]`);
    });

  got.stream(image).pipe(transformer).pipe(res);
});
router.use('/', express.static(UPLOAD_DIRECTORY));

export default router;
