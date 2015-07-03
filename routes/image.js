import config from 'config';
import { Router } from 'express';
import multer from 'multer';
import uuid from 'node-uuid';
import sizeOf from 'image-size';
import aws from '../aws';

import { ensureAuthenticated } from '../utils';
import { ContentTypes } from '../constants';

import { images } from '../dbs/images';

const router = Router();
const AWSConfig = config.get('aws');

router.get('/', ensureAuthenticated, (req, res) => {
  res.setHeader('Content-Type', ContentTypes.HTML);
  images.find({user: req.user._id}, (err, userImages) => {
    if (err) res.send(err);
    else res.render('image/index', {images: userImages, user: req.user});
  });
});

router.get('/:id', (req, res) => {
  images.findOne({_id: req.params.id}, (err, image) => {
    if (err) {
      res.setHeader('Content-Type', ContentTypes.JSON);
      res.send(err);
    } else {
      res.setHeader('Content-Type', ContentTypes.HTML);
      res.render('image/image', {image: image});
    }
  });
});

router.get('/:id/delete', ensureAuthenticated, (req, res) => {
  if (req.query.confirm !== 'true') {
    res.redirect('/image');
  }
  images.findOne({_id: req.params.id, user: req.user._id}, (err, image) => {
    if (err) {
      res.setHeader('Content-Type', ContentTypes.JSON);
      res.send(err);
    } else if (image) {
      const s3 = new aws.S3({params: {Bucket: AWSConfig.s3.bucket}});
      images.remove({_id: req.params.id}, {}, removeErr => {
        if (removeErr) {
          res.send(removeErr);
        } else {
          s3.deleteObject({
            Key: image.awsKey
          }, () => {
            res.redirect('/image');
          });
        }
      });
    } else {
      res.redirect('/image');
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

  const image = req.files.image[0];
  const id = uuid();
  const key = `${id}.${image.name.split('.').slice(-1)[0].toLowerCase()}`;
  const s3 = new aws.S3({params: {Bucket: AWSConfig.s3.bucket, Key: key, ACL: 'public-read'}});

  s3.upload({
    Body: image.buffer
  }, err => {
    if (err) res.send(err);
    else {
      images.insert({
            _id: id,
            user: req.user._id,
            name: image.originalname,
            awsKey: key,
            type: image.type,
            size: sizeOf(image.buffer),
            url: `https://s3-${AWSConfig.region}.amazonaws.com/${AWSConfig.s3.bucket}/${key}`
          }, () => {
            res.redirect(`/image/${id}`);
          });
    }
  });
});

export default router;
