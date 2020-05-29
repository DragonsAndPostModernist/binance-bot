let repo = require("../../repository/Repository")
let { Strategy } = require("../../strategy/Strategy");
let { Candle } = require("../../model/Candle");
let utils = require("../../lib/Utils");

const BUY = "BUY";
const SELL = "SELL";
const PENDING = "PENDING"
class TradeService{

    static getInstance( cp ){
        return new TradeService( cp )
    }

    constructor( cp ){
        this.currencyPair  = cp;
        this.prevCandles = null;
        this.candle = new Candle();
        this.startTime = null;
        this.endTime = null;
        this.strategyImp  = null;
        this.candlesCached =[];
    }


    async execute( ticker,  socket ){
        if( this.prevCandles === null || this.prevCandles === [] ){ 
            this.prevCandles =  await repo.getBy("candles", {symbol:this.currencyPair });
        }
        await this.configureStrategy( ticker );
        this.updateCandle( ticker );
        let rsiData = await this.runStrategy( ticker );
        console.log( rsiData );
        socket.emit('ticker', {ticker, rsiData})
    }
    updateCandle(ticker) {
        if (new Date().getTime >= this.endTime) {
            this.candle.close({ closingPrice: ticker.p, lastVol: ticker.q });
            this.candlesCached.push(JSON.parse(JSON.stringify(this.candle)));
            this.candle = new Candle();
            this.startTime = null;
            this.endTime = null;
        }
        else {
            this.candle.updateCandle({ price: ticker.p, volume: ticker.q });
        }
    }

    async runStrategy(ticker) {
        let strategyResult = this.strategyImp.run(ticker.p);
        if( strategyResult.value > 70 ){ strategyResult.signal = SELL}
        else if( strategyResult.value <= 30 ){ strategyResult.signal = BUY}
        else{ strategyResult.signal =""}
        return strategyResult;
    }

    async configureStrategy(ticker) {
        let RuntimeStrategy = Strategy.factory("rsi");
        this.strategyImp = (this.strategyImp === null) ? new RuntimeStrategy(this.prevCandles.candles) : this.strategyImp;
        this.startTime = (this.startTime === null) ? new Date(ticker.T) : this.startTime;
        this.endTime = (this.endTime === null) ? utils.setEndDate(new Date(this.startTime.getTime()), utils.getIntervaDateMap("30m") ): this.endTime;
    }
}


module.exports = {
    TradeService:TradeService
}