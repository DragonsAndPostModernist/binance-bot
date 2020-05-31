
const utils = require('../../lib/Utils');
const color = require("colors")
const { ServiceInterface } = require("./ServiceInterface")
const { Candlesticks } = require("../../model/Candlesticks");
const repository = require("../../repository/Repository"); 
let { IndicatorBuilder } = require("../../indicators/Indicators");
let { Candle   }  = require("../../model/Candle");
let { Strategy }  = require("../../strategy/Strategy");

class SimulationService extends ServiceInterface {

    
    static getInstance(){
        return new SimulationService();
    }
    constructor() {
        super();
        this.strategy      = null;
        this.currencyPair  = null;
        this.entryPrice    = null;
        this.exchangeFee   = null;
        this.buyPct        = null;
        this.sellPct       = null;
        this.limitBuy      = null;
        this.limitSell     = null;
        this.sellStopPct   = null;
        this.buyStopPct    = null;
        this.history       = null;
        this.useLimit = null;
        this.useStop =null;
        this.indicatorBuffer = [];
        this.strategyService = null;
        this.tradeFor = null;
        this.qty = 0;
    }
    async configureStrategy() {
        this.history = (this.history === null) ? await repository.getBy("candles", { symbol: this.currencyPair }) : this.history;
    }

    async execute(){
        await this.configureStrategy();
        console.log("");
        console.log(" Simulation Service ".green + " Pair: ".grey+" "+this.currencyPair.yellow);
        this.indicatorBuffer = IndicatorBuilder.build(this.strategy, this.history.candles);
        this.strategyService = Strategy.simulationFactory(this.strategy, this.tradeFor);
        this.strategyService.setCandles( this.history.candles )
            .setIndicators( this.indicatorBuffer)
            .setExchangeData({
                entryPrice: this.entryPrice,
                exchangeFee:this.exchangeFee ,
                buyPct:this.buyPct,
                sellPct:this.sellPct,
                limitBuy:this.limitBuy,
                limitSell:this.limitSell,
                sellStopPct:this.sellStopPct,
                buyStopPct:this.buyStopPct,
                useLimit:this.useLimit,
                useStop:this.useStop,
                qty:this.qty
            })
            .run()
    }
    setUseStop( val ){
        this.useStop = val;
        return this;
    }
    setQty( val ){
        this.qty = val;
        return this;
    }
    setUseLimit( val ){
        this.useLimit = val;
        return this;
    }
    setStrategy( val ){
        this.strategy = val;
        return this;

    }
    setCurrencyPair( val ){
        this.currencyPair = val;
        return this;
    }

    setTradeFor( val ){
        this.tradeFor = val;
        return this;
    }
    setEntryPrice( val ){
        this.entryPrice = val;
        return this;
    }
    setExchangeFee( val ){
        this.exchangeFee = val;
        return this;
    }
    setBuyPct( val ){
        this.buyPct = val;
        return this;
    }
    setSellPct( val ){
        this.sellPct  = val;
        return this;
    }
    setLimitBuy( val ){
        this.limitBuy = val;
        return this;
    }
    setLimitSell( val ){
        this.limitSell = val;
        return this;
    }
    setSellStopPct( val ){
        this.sellStopPct = val;
        return this;
    }
    setBuyStopPct( val ){
        this.buyStopPct = val;
        return this;
    }
}



module.exports = {
    SimulationService:SimulationService
}
