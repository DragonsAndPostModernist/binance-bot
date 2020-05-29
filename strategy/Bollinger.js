const { BollingerIndicator } = require("../indicators/Indicators");
const THRESHOLD_COUNT = 10;
class Bollinger {

    static getInstance( closes, price ){
        return new Bollinger( closes, price); 
    }
    constructor( closes, price ){
        this.closes = closes;
        this.price = Number(price);
        this.thresholdCount = 0;
    }

    updateBuffer( price ){
        this.closes.shift();
        this.closes.push(Number(price))
    }
    run( price ){
         this.updateBuffer( price );
         let current = this.getBollinger(this.closes);
    }
    getBollinger(closes){
        return BollingerIndicator.getData( closes );
    }
  
}

module.exports = {
    Bollinger:Bollinger
}