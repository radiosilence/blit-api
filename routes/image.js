import config from 'config';
import express from 'express';
import React from 'react/addons';
import multer from 'multer';
import uuid from 'node-uuid';
import sizeOf from 'image-size';
import aws from '../aws';

import { ensureAuthenticated } from '../utils';
import { ContentTypes } from '../constants';

import { images } from '../dbs/images';

const router = express.Router();
const AWSConfig = config.get('aws');

router.get('/retina/:id', (req, res) => {
  res.setHeader('Content-Type', ContentTypes.HTML);
  images.findOne({_id : req.params.id}, (err, image) => {
    if (err) {
      res.send(err);
      return;
    }
    console.log("IMAGE", image);
    res.send(React.renderToStaticMarkup(
      <html>
        <body>
          <img
            style={{width: `${image.size.width / 2}px`, height: `${image.size.height / 2}px`}}
            src={image.url} />
        </body>
      </html>
    ));
  });
});

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

router.post('/upload', ensureAuthenticated, multer({
  putSingleFilesInArray: true,
  inMemory: true
}), (req, res) => {
  res.setHeader('Content-Type', ContentTypes.JSON);
  let image = req.files.image[0];
  let id = uuid();
  let key = `${id}.${image.name.split('.').slice(-1)[0]}`;
  let s3 = new aws.S3({params: {Bucket: AWSConfig.s3.bucket, Key: key, ACL: 'public-read'}});
  s3.upload({
    Body: image.buffer
  }, (err, data) => {
    images.insert({
      _id: id,
      name: image.name,
      type: image.type,
      size: sizeOf(image.buffer),
      url: `https://s3-${AWSConfig.region}.amazonaws.com/${AWSConfig.s3.bucket}/${key}`
    }, (err, newImage) => {
      res.redirect(`/image/retina/${id}`)
    });
  });
});

export default router;