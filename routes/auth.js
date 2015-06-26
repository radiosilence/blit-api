import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/facebook', passport.authenticate('facebook'), (req, res) => {});

router.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
  res.redirect('/')
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default router;