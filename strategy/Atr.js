const technicalIndicators = require('technicalindicators');
technicalIndicators.setConfig('precision', 10);
let ATR =  technicalIndicators.ATR;
const THRESHOLD_COUNT = 10;
class Atr {

    static getInstance( closes,highs,lows, price ){
        return new Atr( closes,highs,lows, price ); 
    }
    constructor( closes,highs,lows, price  ){
        this.closes = closes;
        this.highs = highs;
        this.lows = lows;
        this.price = Number(price);
        this.thresholdCount = 0;
    }

    updateBuffer( price, high, low ){
        this.closes.shift();
        this.highs.shift();
        this.lows.shift();
        this.closes.push(Number(price));
        this.highs.push(Number(high));
        this.lows.push(Number(low))
    }
    run( price ){
         this.updateBuffer( price );
         let current = this.getATR(this.closes);
    }
    getATR(bufferH, bufferL, bufferC){
        let inputATR = {
            high : bufferH,
            low  : bufferL,
            close: bufferC,
            period : 14
        };
        let atr = new ATR(inputATR);
        return atr.getResult();
    }
}

module.exports = {
    Atr:Atr
}