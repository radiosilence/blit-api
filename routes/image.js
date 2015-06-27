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

router.get('/', ensureAuthenticated, (req, res) => {
  res.setHeader('Content-Type', ContentTypes.HTML);
  images.find({user: req.user._id}, (err, userImages) => {
    res.render('image/index', {images: userImages});    
  })
});

router.get('/:id', (req, res) => {
  images.findOne({_id : req.params.id}, (err, image) => {

    if (err) {
      res.setHeader('Content-Type', ContentTypes.JSON);
      res.send(err);
    } else {
      res.setHeader('Content-Type', ContentTypes.HTML);
      res.render('image/image', {image: image});
    }
  });
});

router.post('/upload', ensureAuthenticated, multer({
  putSingleFilesInArray: true,
  inMemory: true
}), (req, res) => {
  res.setHeader('Content-Type', ContentTypes.JSON);

  if (!req.files.image) {
    res.redirect('/image');
    return;
  }

  let image = req.files.image[0];
  let id = uuid();
  let key = `${id}.${image.name.split('.').slice(-1)[0]}`;
  let s3 = new aws.S3({params: {Bucket: AWSConfig.s3.bucket, Key: key, ACL: 'public-read'}});
  
  s3.upload({
    Body: image.buffer
  }, (err, data) => {
    images.insert({
      _id: id,
      user: req.user._id,
      name: image.originalname,
      type: image.type,
      size: sizeOf(image.buffer),
      url: `https://s3-${AWSConfig.region}.amazonaws.com/${AWSConfig.s3.bucket}/${key}`
    }, (err, newImage) => {
      res.redirect(`/image/${id}`)
    });
  });
});

export default router;