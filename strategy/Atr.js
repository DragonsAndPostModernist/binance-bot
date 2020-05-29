const { AtrIndicator } =  require("../indicators/Indicators");
let utils = require("../lib/Utils")
const THRESHOLD_COUNT = 10;
class Atr {

    static getInstance( candles, price ){
        return new Atr ( candles, price ); 
    }
    constructor( candles, price  ){
        this.closes = utils.closes(candles);
        this.highs = utils.highs(candles);
        this.lows = utils.lows(candles);
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
         let current = this.getATR(this.highs, this.lows, this.closes);
         let avgTrueRange = current[current.length -1];
         if (avgTrueRange) {
            
         } else if (avgTrueRange) {
            
         } else {
             return {signal: null, context: "atr", value: avgTrueRange, status: "pending"}
         }
    }
    getATR(bufferH, bufferL, bufferC){
       return AtrIndicator.getData( bufferH, bufferL, bufferC )
    }
}

module.exports = {
    Atr:Atr
}