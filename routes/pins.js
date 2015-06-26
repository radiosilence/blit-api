import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/', (res, req) => {
  passport.authenticate();
});