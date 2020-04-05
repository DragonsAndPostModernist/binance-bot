const technicalIndicators = require('technicalindicators');
technicalIndicators.setConfig('precision', 10);
let MACD =  technicalIndicators.MACD;
const THRESHOLD_COUNT = 10;
class Macd {

    static getInstance( closes, price ){
        return new Macd( closes, price); 
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
         let current = this.getMacd(this.closes);
    }
    getMacd(closes){
        let macdInput = {
            values            : closes,
            fastPeriod        : 5,
            slowPeriod        : 8,
            signalPeriod      :  3,
            SimpleMAOscillator: true,
            SimpleMASignal    : true
        };
        let macd= new Macd(macdInput);
        return macd.getResult();
    }
}

module.exports = {
    Macd:Macd
}