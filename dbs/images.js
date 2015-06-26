import Datastore from 'nedb';
import config from 'config';

const images = new Datastore({
  filename: config.get('dbs').images.path,
  autoload: true
});

images.persistence.compactDatafile();

export default {
  images: images
};