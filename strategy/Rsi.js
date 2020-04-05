const technicalIndicators = require('technicalindicators');
technicalIndicators.setConfig('precision', 10);
let RSI =  technicalIndicators.RSI;
const THRESHOLD_COUNT = 10;

const utils = require("../lib/Utils");
class Rsi {

    static getInstance( closes, price ){
        return new Rsi( closes, price); 
    }
    constructor( candles, price ){
        
        this.closes = utils.closes( candles );
        this.price = Number(price);
        this.thresholdCount = 0;
    }

    updateBuffer( price ){
        this.closes.pop();
        this.closes.push(Number(price))
    }
    run( price ){
         this.updateBuffer( price );
         let currentRsi = this.getRSI( this.closes);

        if( currentRsi <=30 ){
            if( this.thresholdCount > THRESHOLD_COUNT){
                return { signal:"Buy", context:"rsi", value:currentRsi, status:"resolved" }
            }else{
                return { signal:null, context:"rsi", value:currentRsi, status:"pending" }
            }
         }
         else if( currentRsi >=80 ){
            if( this.thresholdCount > THRESHOLD_COUNT){
                return { signal:"Sell", context:"rsi", value:currentRsi, status:"resolved" }
            }else{
                return { signal:null, context:"rsi", value:currentRsi, status:"pending" }
            }
        }else{
            return { signal:null, context:"rsi", value:currentRsi, status:"pending" }
        }
    }
    getRSI(buffer){
        let inputRSI = {
            values : buffer,
            period : 14
        };
        let rsi= new RSI(inputRSI);
        return rsi.getResult();
    }
}

module.exports = {
    Rsi:Rsi
}