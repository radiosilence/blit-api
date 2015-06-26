import express from 'express';
import React from 'react/addons';
import { ContentTypes } from '../constants';

const router = express.Router();

router.get('/retina', (req, res) => {
  res.setHeader('Content-Type', ContentTypes.HTML);
  res.send(React.renderToStaticMarkup(
    <html>
      <body>
        <img
          style={{transform: 'scale(0.5)'}}
          src={req.query.src} />
      </body>
    </html>
  ));
});

router.get('/upload', (req, res) => {
  res.setHeader('Content-Type', ContentTypes.HTML);
  res.send(React.renderToStaticMarkup(
    <html>
      <body>
        <form action="/api/images/upload" method="post">
          
        </form>
      </body>
    </html>
  ));
});
router.post('/upload', (req, res) => {

});

export default router;