import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/facebook', passport.authenticate('facebook'), req => {});

router.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default router;
