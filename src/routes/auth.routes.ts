import AuthConfig from '@src/config/auth.config.json';
import * as authController from '@src/controllers/auth.controller';
import express from 'express';
import passport from 'passport';

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

// ----- SETUP OAUTH ----- //
for (const providerName of keys(AuthConfig.oauth)) {
  const provider = AuthConfig.oauth[providerName];

  router.get('/thirdparty/' + providerName, passport.authenticate(providerName));
  router.get(
    '/thirdparty/' + providerName + '/callback',
    authController.passportAuthenticateUserAndSendAuthToken(providerName),
  );
}

export default router;
