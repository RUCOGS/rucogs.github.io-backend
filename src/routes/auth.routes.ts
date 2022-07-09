import AuthConfig from '@src/config/auth.config.json';
import * as authController from '@src/controllers/auth.controller';
import * as verifyEmailController from '@src/controllers/verify-email.controller';
import pubsub, { PubSubEvents } from '@src/graphql/utils/pubsub';
import { RequestWithDefaultContext } from '@src/misc/context';
import { HttpError } from '@src/shared/utils';
import { assertRutgersEmailValid } from '@src/shared/validation';
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

router.get('/verify-rutgers-email', async (req: RequestWithDefaultContext, res) => {
  if (!req.context) throw new HttpError(500, 'Expected a request context.');

  const url = new URL(req.context.serverConfig.frontendDomain + '/result');

  const successMessage = () => {
    url.searchParams.append('title', 'Success');
    url.searchParams.append('body', 'Succesfully verified email!');
    res.redirect(url.toString());
  };

  const failMessage = () => {
    url.searchParams.append('title', 'Error');
    url.searchParams.append('body', 'Failed to verify email!');
    res.redirect(url.toString());
  };

  if (!req.query.token || typeof req.query.token !== 'string') {
    failMessage();
    return;
  }

  try {
    const token = await verifyEmailController.jwtVerifyAsync(req.query.token);
    assertRutgersEmailValid(token.verifiedEmail);
    const userExists = await req.context.unsecureEntityManager.user.exists({
      filter: { id: token.userId },
    });
    if (!userExists) throw new HttpError(500, 'Expected user to exist!');
    await req.context.unsecureEntityManager.user.updateOne({
      filter: { id: token.userId },
      changes: {
        rutgersEmail: token.verifiedEmail,
        rutgersVerified: true,
      },
    });

    const updatedUser = await req.context.unsecureEntityManager.user.findOne({
      filter: { id: token.userId },
    });
    pubsub.publish(PubSubEvents.UserUpdated, updatedUser);
  } catch (e) {
    failMessage();
    return;
  }

  successMessage();
});

export default router;
