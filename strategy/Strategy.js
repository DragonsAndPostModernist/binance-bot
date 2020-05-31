const technicalIndicators = require('technicalindicators');
technicalIndicators.setConfig('precision', 10);

const { Rsi } = require("./Rsi");
const { Macd } = require("./Macd");
const { Atr } = require("./Atr");
const { Bollinger } = require("./Bollinger");



const PENDING = 'state.result.pending';
const CROSS_DOWN = 'state.result.cross.down';
const CROSS_UP = 'state.result.cross.up';
const SIGNAL_BOUGHT = 'state.result.signal.bought';
const SIGNAL_SOLD = 'state.result.signal.sold';
const ASSET_ACCUMULATION = 'asset.accumulate';
const FIAT_ACCUMULATION = 'fiat.accumulate';

class Strategy {
    
    static factory(strategy){
        switch( strategy ){
           case  'rsi' : return Rsi;
           case  'macd' : return Macd;
           case  'atr' : return Atr;
           case  'bollinger' : return Bollinger;
           default : return Rsi;
        }
    }

    static simulationFactory(strategy, tradeFor ){
        switch( strategy ){
            case "rsi" : { return new RsiService( tradeFor ) }  break;
            case "atr" : { return  } break;
            case "woodies" : { } break;
            case "bollinger" :{ } break;
            case "macd" : {  } break;
            case "floorPivots": {  } break;
            case "williamsR" :{ } break;
            case "ksi": { } break;
            case "mfi": {  } break;
            case "obv": {  } break;
            case "ema4": {  } break;
            case "ema3": {  } break;
            case "sma3": { } break;
            case "adl": {  } break;
            case "adx": { } break;
            case "awesomOsc": {  } break;
            case "cci": {  }  break;
            case "stochastic":{  } break;
            case "ichimoko": {  } break;
            case "wildersmoothingMA": {  } break;
            case "weightedMA":{ } break;
            case "vp":{  } break;
            case "volumeProfileAvg":{  } break;
            case "trix":{   } break;
            case "forceIndex":{ } break;
            case "roc":{  } break;
            case "psar":{   } break;
            default: {  } break;
        }
    }
}

class Service{

    constructor( tradeFor ){
        this.candles = [];
        this.indicators = [];
        this.state = PENDING;
        this.tradeFor = ( tradeFor === 'fiat' ) ? FIAT_ACCUMULATION : ASSET_ACCUMULATION;
        this.entryPrice    = null;
        this.exchangeFee   = null;
        this.buyPct        = null;
        this.sellPct       = null;
        this.limitBuy      = null;
        this.limitSell     = null;
        this.sellStopPct   = null;
        this.buyStopPct    = null;
        this.useLimit      = null;
        this.useStop       = null;
        this.nextBuyFunds = null;
        this.nextSellFunds =null;
        this.assetQty   = 0;

    }

    calculateBuyPercentage(value ){
        return ( value / 100 ) * this.entryPrice;
    }

    calculateSellPercentage( value ){
        return ( value / 100 ) * this.assetQty;
    }
    setExchangeData( obj ){
        this.firstTradeSide = null;
        this.tradeHistory = {
            buys: [],
            sells: []
        };
        this.lastTrade = {};
        this.entryPrice    = obj.entryPrice;
        this.exchangeFee   = obj.exchangeFee;
        this.buyPct        = obj.buyPct;
        this.sellPct       = obj.sellPct;
        this.limitBuy      = obj.limitBuy;
        this.limitSell     = obj.limitSell;
        this.sellStopPct   = obj.sellStopPct;
        this.buyStopPct    = obj.buyStopPct;
        this.useLimit      = obj.useLimit;
        this.useStop       = obj.useStop;
        this.assetQty      = obj.qty;
        this.nextBuyFunds  = this.calculateBuyPercentage(obj.buyPct);
        this.nextSellFunds = this.calculateSellPercentage(obj.sellPct);
        this.initialFunds = this.entryPrice;
        this.initialAsset = this.assetQty;
        return this;
    }
    setCandles( candles ){
        this.candles = candles;
        return this;
    }

    setIndicators( indicators ){
        this.indicators = indicators;
        return this;
    }

    evaluateEntry( candle ){
        if( this.state === PENDING || this.state === SIGNAL_SOLD  ){
            this.buySignal( candle )
        }
    }
    evaluateExit( candle ){
        if( this.state === PENDING || this.state === SIGNAL_BOUGHT){
            this.sellSignal( candle );
        }
    }
    buySignal( candle ){
        if( this.entryPrice >= this.nextBuyFunds ){
            if( this.firstTradeSide === null ){ this.firstTradeSide = 'buy'}
            this.entryPrice = ( this.entryPrice - this.nextBuyFunds )
            let lastTrade ={
                time:new Date(candle.time),
                side:'buy',
                assetPrice: candle.c,
                entryFunds:this.nextBuyFunds,
                entryAsset:null,
                newQuantity: Number( (100 / Number(candle.c)).toFixed(6 ) ),
                newAvailableFunds:null,
                candle:candle,

            };
            this.lastTrade = lastTrade;
            this.assetQty = this.assetQty + this.lastTrade.newQuantity;
            this.nextSellFunds = this.calculateSellPercentage( this.sellPct )
            this.tradeHistory.buys.push(lastTrade)
            this.printResult(` Buying ${ lastTrade.newQuantity.toFixed(6)}  @ ${ candle.c}. For : ${this.nextBuyFunds} Available Funds: ${ this.entryPrice} `);
        }else{
            // no more funds to spend need to sell
            this.state = SIGNAL_BOUGHT;
        }

    }
    sellSignal( candle ){
        if( this.assetQty >= this.nextSellFunds  ){
            if( this.firstTradeSide === null ){ this.firstTradeSide = 'sell'}
            this.assetQty = ( this.assetQty - this.nextSellFunds )
            let lastTrade ={
                time:new Date(candle.time),
                side:'sell',
                assetPrice: candle.c,
                entryFunds:null,
                entryAsset:this.nextSellFunds,
                newQuantity: null,
                newAvailableFunds: ( this.nextSellFunds * Number(candle.c)),
                candle:candle,
            };
            this.lastTrade = lastTrade;
            this.entryPrice = lastTrade.newAvailableFunds;
            this.tradeHistory.sells.push(lastTrade);
            this.entryPrice = this.entryPrice + Math.abs(this.entryPrice + lastTrade.newAvailableFunds);
            this.nextBuyFunds = this.calculateBuyPercentage( this.buyPct )
            this.printResult(` Selling ${ this.nextSellFunds.toFixed(6)}  @ ${ candle.c}. Total return: ${lastTrade.newAvailableFunds} Available Funds: ${ this.entryPrice} `);
        }else{
            // no more assets to sell need to buy
            this.state = SIGNAL_SOLD;
        }
    }

    printResult( result ){
       console.log( result )
    }

}

class RsiService extends Service{

    static factory(){
        return new RsiService();
    }
    constructor( tradeFor ){
        super( tradeFor );
        this.upperBound = 70;
        this.lowerBound = 30;
    }
    processCandle( candle, index ){
        let delayDifference = Math.abs( this.candles.length - this.indicators.length) ;
        if( index >= delayDifference){
            if(  this.indicators[ (index-delayDifference)] > this.upperBound){
                this.evaluateExit( candle );
            }
            else if ( this.indicators[ (index-delayDifference)] <= this.lowerBound){
                this.evaluateEntry( candle )
            }
        }
    }
    run(){
        this.candles.forEach( (indicator, index) =>{ this.processCandle( this.candles[index], index ) });
         this.printResult();
    }
}

module.exports = {
    Strategy:Strategy
};
