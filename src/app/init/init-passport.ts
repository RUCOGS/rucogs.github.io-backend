import { User, UserModel } from '../models';
import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { Config as AuthConfig } from '../config/auth.config';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export default function(passport: PassportStatic): void {
  // Set up local strategy
  passport.use(new LocalStrategy(function(username, password, done) {
    UserModel.findOne({
      username: username
    })
      // When calling populate(), make sure to pass in an object
      // that indicates what fields are populated with what types.
      // This stops typescript from complaining about nonexistant
      // fields.
      // .populate<{ roles: Role[]; }>('roles', '-__v')
      .exec((err, user) => {
        if (err) {
          // The 'done' callback accepts an error, a user, and a message.
          // If we have an error, then we should pass false for the user.
          //
          // Note that done function returns void, therefore
          // by returning the function we exit early.
          return done(err, false, { message: err.message });
        }
        if (!user) {
          return done(null, false, { message: 'User not found.' });
        }

        const passwordIsValid = bcrypt.compareSync(
          password,
          user.password
        );

        if (!passwordIsValid) {
          return done(null, false, { message: 'Invalid password!' });
        }

        // const token = jwt.sign({ id: user.id }, AuthConfig.SECRET, {
        //   expiresIn: 86400 // 24 hours
        // });

        // const authorities = [];

        // for (let i = 0; i < user.roles.length; i++) {
        //   authorities.push('ROLE_' + user.roles[i].name.toUpperCase());
        // }

        return done(null, user);
      });
  }));

  // Set up Discord strategy
  passport.use(new DiscordStrategy({
    clientID: AuthConfig.DISCORD_CLIENT,
    clientSecret: AuthConfig.DISCORD_SECRET,
    callbackURL: AuthConfig.DISCORD_CLIENT_REDIRECT,
    scope: ['identify', 'email', 'guilds', 'guilds.join']
  }, (accessToken, refreshToken, profile, done) => {
    console.log('Discord Profile: \n' + JSON.stringify(profile));
    void UserModel.findOneAndUpdate(
      {
        discordId: profile.id
      },
      {
        $setOnInsert: {
          username: profile.username,
          email: profile.email,
          discordId: profile.id
        } as User
      },
      {
        new: true,
        upsert: true
      },
      (err, user) => {
        if (err) {
          return done(err, false, { message: err.message });
        }
        if (!user) {
          return done(null, false, { message: 'User not found.' });
        }

        // User should technically always exist, because findOneAndUpdate
        // will attempt to create the user if they do not exist.
        return done(err, user);
      });
  }));

  // Set up Google strategy
  passport.use(new GoogleStrategy({
    clientID: AuthConfig.GOOGLE_CLIENT,
    clientSecret: AuthConfig.GOOGLE_SECRET,
    callbackURL: AuthConfig.GOOGLE_CLIENT_REDIRECT,
    scope: ['profile', 'email']
  }, (accessToken, refreshToken, profile, done) => {
    console.log('Google Profile: \n' + JSON.stringify(profile));
    UserModel.findOneAndUpdate(
      {
        googleId: profile.id
      },
      {
        $setOnInsert: {
          username: profile.displayName.replace(' ', ''),
          email: profile.emails[0].value,
          googleId: profile.id
        } as User
      },
      {
        new: true,
        upsert: true
      })
      .exec((err, user) => {
        if (err) {
          return done(err, false, { message: err.message });
        }
        if (!user) {
          return done(null, false, { message: 'User not found.' });
        }

        // User should technically always exist, because findOneAndUpdate
        // will attempt to create the user if they do not exist.
        return done(err, user);
      });
  }));
}
