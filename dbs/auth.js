import Datastore from 'nedb';
import config from 'config';

const users = new Datastore({
  filename: config.get('dbs').users.path,
  autoload: true
});

users.persistence.compactDatafile();

export default {
  users: users
};