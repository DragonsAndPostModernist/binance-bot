Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
const crypto = require('crypto');
let sanitizer = require('sanitizer');
const intervals = ["1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M"]
const getMaxSize = (strings) => {
    let length = strings.length;
    let maxSize =0;
    for (let i = 0; i < length ; i++) {
        maxSize = (maxSize < strings[i].toString().length) ? strings[i].toString().length : maxSize;
    }
    return maxSize;
};

const splitAtInterval = str => {
    const [, ...arr] = str.match(/(\d*)([\s\S]*)/);
    return arr;
};
module.exports.setEndDate = (endDate, intervalMap ) =>{
     endDate[intervalMap.setter]( endDate[intervalMap.getter]() + intervalMap.val );
     return endDate;
};
module.exports.getIntervaDateMap = (interval) =>{
    let intervalSplit = splitAtInterval(interval);
    switch(intervalSplit[1]){
        case "m": {
            return { getter:"getMinutes", setter:"setMinutes", val:Number(intervalSplit[0]) };
        } 
        case "h": {
            return { getter:"getHours",setter:"setHours", val:Number(intervalSplit[0]) };
        }
        case "d": {
            return { getter:"getHours",setter:"setHours", val:(Number(intervalSplit[0]) * 24 ) };
        }
        case "w": {
            return { getter:"getHours",setter:"setHours", val:(7 * 24) };
        }
        case "M": {
            return { getter:"getMonth",setter:"setMonth", val:Number(intervalSplit[0]) };
        }
    }
};

module.exports.intervalMapper = (interval, _date) =>{
        let date = new Date(_date);
        let intervalSplit = splitAtInterval(interval);
        switch(intervalSplit[1]){
            case "m": {
                date = date.setMinutes(date.getMinutes() - Number(intervalSplit[0]));
                return date;
            } 
            case "h": {
                date = date.setHours(date.getHours() - Number(intervalSplit[0]));
                return date;
            }
            case "d": {
                date = date.setHours(date.getHours() - (Number(intervalSplit[0]) * 24 ));
                return date;
            }
            case "w": {
                date = date.setHours(date.getHours() - (7 * 24 ));
                return date;
            }
            case "M": {
                date = date.setMonth(date.getMonth) - Number(intervalSplit[0]);
                 return date;
            }
        }
};



module.exports.dateToUnixTimeStamp = (date) =>{
   return  date.getUnixTime();
};

module.exports.objectToKeyValueArrays = (object) =>{
    let buffer1 = [];
    let buffer2 = [];
    Object.keys(object).forEach(key => { buffer1.push( key ), buffer2.push( object[key] ) });
    return {keys:buffer1, values:buffer2 };
};
module.exports.objectCheck=(object,keys)=>{
    if(typeof keys === "string"){
        return Object.keys(object).includes(keys)
    }
    if(object && keys.length){
      let isCorrectObject = true;
      keys.forEach((key)=>{
        if(!Object.keys(object).includes(key)){
            isCorrectObject = false
        }
      });
        return isCorrectObject
    }
    return false;
};

module.exports.reverseData =  (data) =>{
    let buffer = [];
    let len = data.length - 1;
    for (let i = len; i >=0; i--){
        buffer.push(data[i])
    }
    return buffer;
};

module.exports.closes = ( candles ) =>{
    let buffer = [];
    candles.forEach(( candle )=>{
        buffer.push( Number(candle.c))
    });
    return buffer;
}
module.exports.highs  = ( candles ) =>{
    let buffer = [];
    candles.forEach(( candle )=>{
        buffer.push( candle.h)
    });
    return buffer;
}
module.exports.lows   = ( candles) =>{
    let buffer = [];
    candles.forEach(( candle )=>{
        buffer.push( candle.l)
    });
    return buffer;
}
module.exports.open   = ( candles) =>{
    let buffer = [];
    candles.forEach(( candle )=>{
        buffer.push( candle.o)
    });
    return buffer;
}
module.exports.volume = ( candles) =>{
    let buffer = [];
    candles.forEach(( candle )=>{
        buffer.push( candle.v)
    });
    return buffer;
}

module.exports.deepCopy = (obj) =>{
    return JSON.parse(JSON.stringify(obj));
};

module.exports.sleepy = (timeout = null) =>{
    return new Promise((resolve, reject)=>{
      setTimeout(function(){
          resolve(false);
      }, timeout || 500)
  })
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
            buffer.push(col.toString().padStart(( ( 19 - col.length) + 2 ), ' '));

        }else{
            buffer.push(col.toString())
        }

    });
    return buffer;
};
module.exports.sanitize = (data) =>{
    if(typeof data === 'object'){
        Object.keys(data).forEach(key => {
           data[key] = sanitizer.sanitize(data[key])
        });
        return data;
    }
    return sanitizer.sanitize(data);
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
