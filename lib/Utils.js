module.exports.objectToKeyValueArrays = (object) =>{
    let buffer1 = [];
    let buffer2 = [];
    Object.keys(object).forEach(key => { buffer1.push( key ), buffer2.push( object[key] ) });
    return {keys:buffer1, values:buffer2 };
}