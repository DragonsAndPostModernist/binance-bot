module.exports.objectToKeyValueArrays = (object) =>{
    let buffer1 = [];
    let buffer2 = [];
    Object.keys(object).forEach(key => { buffer1.push( key ), buffer2.push( object[key] ) });
    return {keys:buffer1, values:buffer2 };
};

const getMaxSize = (strings) => {
    let length = strings.length;
    let maxSize =0;
    for (let i = 0; i < length ; i++) {
        maxSize = (maxSize < strings[i].toString().length) ? strings[i].toString().length : maxSize;
    }
    return maxSize;
};

module.exports.getMaxStringLength = ( strings ) =>{
    return getMaxSize(strings)
};

module.exports.stringFormatterAlignColumns = ( cols, array ) =>{

    let buffer = [];
    cols.forEach((col, index)=>{
        if(index > 0){
            // retieve the strings padding
            let padding  = array[index].search(/\S/);
            // padd the column value at start
            buffer.push(col.toString().padStart(( padding ) + 4, ' '));

        }else{
            buffer.push(col.toString())
        }

    });
    return buffer;
};

module.exports.stringFormatterAlignStart = ( strings, maxSize =null ) =>{



    let getStringSize = (string) =>{
        return string.toString().length;
    };

    let buffer = [];
    let length  = strings.length;
    let max = (maxSize === null) ? getMaxSize(strings) : maxSize;
    strings.forEach(( string )=>{
        let stringSize = getStringSize( string )
        if(stringSize < max){
            buffer.push(string.toString().padStart((max - stringSize) + 4))
        }else{
            buffer.push(string.toString())
        }
    });
   return buffer;
};
