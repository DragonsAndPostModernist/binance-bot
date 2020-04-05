const technicalIndicators = require('technicalindicators');
technicalIndicators.setConfig('precision', 10);
let BOLLINGER =  technicalIndicators.BollingerBands;
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
        let input = {
            period : 20,
            values : closes,
            stdDev : 2

        };
        let bb = new BB(input);
        return bb.getResult();
    }
  
}

module.exports = {
    Bollinger:Bollinger
}