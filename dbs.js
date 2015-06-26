import Datastore from 'nedb';

const db = new Datastore({
  filename: serverConfig.db.path,
  autoload: true
});

db.persistence.compactDatafile();

export default db;