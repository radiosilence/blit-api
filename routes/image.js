import express from 'express';
import React from 'react/addons';
import multipart from 'connect-multiparty';
import { ensureAuthenticated } from '../utils';
import { ContentTypes } from '../constants';

const router = express.Router();

// router.get('/retina', (req, res) => {
//   res.setHeader('Content-Type', ContentTypes.HTML);
//   res.send(React.renderToStaticMarkup(
//     <html>
//       <body>
//         <img
//           style={{transform: 'scale(0.5)'}}
//           src={req.query.src} />
//       </body>
//     </html>
//   ));
// });

router.get('/upload', ensureAuthenticated, (req, res) => {
  res.setHeader('Content-Type', ContentTypes.HTML);
  res.send(React.renderToStaticMarkup(
    <html>
      <body>
        <form action="/image/upload" method="post" encType="multipart/form-data">
          <input type="file" name="image" />
          <input type="text" name="url" />
          <input type="submit" />
        </form>
      </body>
    </html>
  ));
});

router.post('/upload', multipart(), ensureAuthenticated, (req, res) => {
  res.send(JSON.stringify(req.files));
});

export default router;