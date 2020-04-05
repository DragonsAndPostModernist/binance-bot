class Candlesticks{
    constructor( symbol, data ){
        this.candles = [];
        this.symbol = symbol;
        this.populateCandles( data )
    }

    populateCandles( data ){
      
        data.forEach( candle => {
            this.candles.push({time:candle[0], o:candle[1], h:candle[2],l:candle[3], c:candle[4], v:candle[5], ct:candle[6],t:candle[7], bv:candle[8],av:candle[9],bv:candle[10]});
        });
 
    }

    getCandles(){
        return { candles:this.candles, timstamp:this.candles[this.candles.length - 1].time, symbol:this.symbol }
    }
}

module.exports = {
    Candlesticks:Candlesticks
}