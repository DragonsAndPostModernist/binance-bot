// Type 3: Persistent datastore with automatic loading
let DataStore = require('nedb')
// You can issue commands right away
let db =null;
module.exports.connect = (database) =>{
    db = new DataStore({ filename: database, autoload: true });
  return db;
};
