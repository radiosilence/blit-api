// Core
import config from 'config';
import express from 'express';

// Express
import session from 'express-session';
import serveStatic from 'serve-static';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import connectNedbSession from 'connect-nedb-session';


// Auth
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { ensureAuthenticated } from './utils';

// DBs
import { users } from './dbs/auth';

// Routes
import routes from './routes/index';
import auth from './routes/auth';
import image from './routes/image';

const app = express();
const NedbStore = connectNedbSession(session);

// Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
app.use(logger());
app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({
  secret: config.get('express').session.secret,
  store: new NedbStore({
    filename: config.get('express').session.storePath
  })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/auth', auth);
app.use('/image', image);
app.use(serveStatic(__dirname + '/public'));

// Passport config
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new FacebookStrategy({
    clientID: config.get('facebook').appId,
    clientSecret: config.get('facebook').appSecret,
    callbackURL: `http://localhost:${config.get('http').port}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'name', 'photos', 'gender']
  },
  (accessToken, refreshToken, profile, done) => {
    users.findOne({facebookId: profile.id}, (err, user) => {
      console.log("HERE", err, user);
      if (user)
        done(err, user);
      else
        users.insert({facebookId: profile.id, name: profile.name, photo: profile.photo}, (err, newUser) => {
          done(err, newUser);
        });
    });
  }
));

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

export default app;