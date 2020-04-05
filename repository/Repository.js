let NeDB = require("./DB");
let db = null;
let pool = null;

try {
    pool = connectionPool;
}catch (e) {
    pool = [];
}

let res = {};
const connect =(collection) =>{
    let connectionFound = false;
    // see if we have already a connection in pool.
    pool.forEach((connection) => {
        if (Object.keys(connection)[0] === collection) {
            db = connection[collection];
            connectionFound = true;
        }
    });
    if(connectionFound){
        return false;
    } else{
        db = NeDB.connect("./db/"+collection);
        pool.push({[collection]:db});
        return false;
    }
};

const load = (collection_name) =>{
     // load the collection (file)  will be created if doesn't exist 
     connect(collection_name);
};

module.exports.setRes = (response)=>{
    res = response;
};

/**
 *
 * @param collection_name   the target collection
 * @param entity             the entity that is being added
 * @returns {Promise<any>}  query result
 *
 * Adds a list or single entity to the database
 */
module.exports.add =(collection_name,entity) =>{
    return new Promise((resolve, reject) => {
        load(collection_name);
        db.insert(entity, function (err, newDoc) {   
            if(err){
                console.log(err)
            }
            else{
                resolve(newDoc);
            }
        });
    });
};
/**
 *
 * @param collection_name   the target collection
 * @param query             the query string for result filtering
 * @returns {Promise<any>}  database result
 *
 * return a entity by its id
 */
module.exports.getBy =(collection_name,query) =>{
    
    return new Promise((resolve, reject) => {
        load(collection_name);
        db.findOne(query, function (err, docs) {
            if(err){
                console.log(err);
            }
            else{
                resolve(docs);
            }
        });
   });
};


module.exports.getAll = (collection_name) =>{
    return new Promise((resolve, reject) => {
        load(collection_name);
        db.find({}, function (err, docs) {
            if(err){
                console.log(error)
            }
            else{
                resolve(docs);
            }
        });
    });
};

module.exports.countAll=(collection_name)=>{
    return new Promise((resolve, reject) => {
        load(collection_name);
        db.count({}, function (err, count) {
            if(err){
                console.log(error)
            }
            else{
                resolve(count);
            }
        });
    });
};

module.exports.count = (collection_name,query) =>{
    return new Promise((resolve, reject) => {
        load(collection_name);
        db.count(query, function (err, count) {
            if(err){
                console.log(error)
            }
            else{
                resolve(count);
            }
        });
    });
};

module.exports.update = (collection_name,index,entity) =>{
    return new Promise((resolve, reject) => {
        load(collection_name);
        db.update(index, entity, {}, function (err, numReplaced) {
            if(err){
                console.log(error)
            }
            else{
                resolve(numReplaced);
            }
        });
    });
};

module.exports._delete = (collection_name,entity) =>{
    return new Promise((resolve, reject) => {
        load(collection_name);
        db.remove(entity, {}, function (err, numRemoved) {
            if(err){
                console.log(error)
            }
            else{
                resolve(numRemoved);
            }
        });
    });
};
/**
 * 
 * <  Add your required methods here follow the pattern as shown in the above examples >
 * 
 * please vist : https://github.com/louischatriot/nedb to learn more about nedb 
 * 
 */