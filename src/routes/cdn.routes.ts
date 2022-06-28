import { UPLOAD_DIRECTORY } from '@src/controllers/cdn.controller';
import { ShapeUtil } from '@src/utils/shape-util';
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

router.use('/dynamic', async (req, res, next) => {
  let image =
    req.query.src && typeof req.query.src === 'string'
      ? req.query.src
      : 'https://thumbs.dreamstime.com/b/businessman-hand-writing-demo-marker-business-concep-concept-96434578.jpg';

  let width = parseInt(req.query.width && typeof req.query.width === 'string' ? req.query.width : '100');
  let height = parseInt(req.query.height && typeof req.query.height === 'string' ? req.query.height : '100');
  let crop = req.query.crop && typeof req.query.crop === 'string' ? req.query.crop : '';

  width = Math.min(width, 600);
  height = Math.min(height, 600);

  let transformer = sharp()
    .resize(width, height, {
      fit: 'cover',
    })
    .on('info', function (info) {
      console.log(`⬆️ Resized image to [${info.width}, ${info.height}]`);
    });

  if (crop === 'circle') {
    const circleImage = await ShapeUtil.drawCircle(width, height);
    transformer = transformer.png().composite([
      {
        input: Buffer.from(circleImage),
        blend: 'dest-in',
      },
    ]);
  }

  try {
    got.stream(image).pipe(transformer).pipe(res);
  } catch (err) {
    res.status(400);
  }
});
router.use('/', express.static(UPLOAD_DIRECTORY));

export default router;
