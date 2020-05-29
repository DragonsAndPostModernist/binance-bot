
const { MacdIndicator } =  require("../indicators/Indicators");
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
       return MacdIndicator.getData(closes);
    }
}

module.exports = {
    Macd:Macd
}