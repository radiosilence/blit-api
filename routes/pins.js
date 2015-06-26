import express from 'express';
import passport from 'passport';
import { ensureAuthenticated } from '../utils';

const router = express.Router();

// router.get('/', (res, req) => {
//   passport.authenticate('facebook');
// });