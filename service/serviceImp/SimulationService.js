
const utils = require('../../lib/Utils');
const color = require("colors")
const { ServiceInterface } = require("./ServiceInterface")
const { Candlesticks } = require("../../model/Candlesticks");
const repository = require("../../repository/Repository"); 
let { IndicatorBuilder } = require("../IndicatorService");
let { Candle } = require("../../model/Candle");

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
    }
    async configureStrategy() {
        this.history = (this.history === null) ? await repository.getBy("candles", { symbol: this.currencyPair }) : this.history;
    }
    processCandle( candle ){

    }
    async execute(){
        this.configureStrategy();
        console.log("");
        console.log(" Simulation Service ".green + " Pair: ".grey+" "+this.currencyPair.yellow);
        let indicatorValues = IndicatorBuilder.bui
        this.history.candles.forEach( candle => this.processCandle( candle ))
        
    }
    setStrategy( val ){
        this.strategy = val;
        return this;

    }
    setCurrencyPair( val ){
        this.currencyPair = val;
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