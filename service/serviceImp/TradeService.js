const chalk = require("chalk");
const align = require('align-text');
const products = require("../../model/Products.json");
const utils = require('../../lib/Utils');
const { Logger } = require('../../lib/Log');
const { ServiceInterface } = require("./ServiceInterface");
const { Candle }  =  require("../../model/Candle.js");  
const { Output }  =  require("../../model/Output");  
const { Strategy } = require("../../strategy/Strategy");
const repo = require("../../repository/Repository");    
const RESOLVED = "resolved";
const BUY = "Buy";
let STREAM_LOCKED = false;
let { Interaction } = require("../../lib/Interaction");
const readline = require('readline');

class TradeService extends ServiceInterface {

    static getInstance( params ){
        return new TradeService(params);
    }
    constructor( params ) {
        super();
        this.startTime =null;
        this.endTime = null;
        this.candle = new Candle()
        this.currencyPair = params.currencyPair;
        this.strategy = params.strategy
        this.interval = params.interval;
        this.pair = params.currencyPair;
        this.entryFunds = params.entryFunds;
        this.availableAsset = params.availableAsset;
        this.exchangeFee = params.exchangeFee;
        this.buyPct = params.buyPct;
        this.sellPct = params.sellPct;
        this.paperTrade = params.paperTrade;
        this.sellStopPct = params.sellStopPct;
        this.buyStopPct = params.buyStopPct;
        this.runFor = params.runFor;
        this.noTrade = params.noTrade;
        this.lastPrice = 0;
        this.candlesCached = [];
        this.history = null;
        this.strategyImp = null;
        this.currencyAssetSplit = this.parseCurrencyPair( params.currencyPair )
        this.printHeader = true;
        this.stdout = new Output(this.strategy.toUpperCase(), this.currencyAssetSplit[0], this.currencyAssetSplit[1]);
        
        console.log(Interaction.getWelcomeHeader());
        this.interaction = Interaction.initialize();
        this.setInteractiveListener();
    }
    
    setInteractiveListener(){
        let me = this;
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.on('keypress', (str, key) => {
            if (key.sequence === 'l') {
                me.interaction.listKeys()
              } else if (key.sequence === 'b' ) {
                //engine.executeSignal('buy')
                console.log('\nmanual' + ' limit ' + 'BUY' + ' command executed')
              } else if (key.sequence === 'B' ) {
                //engine.executeSignal('buy', null, null, false, true)
                console.log('\nmanual' + ' market ' + 'BUY' + ' command executed')
              } else if (key.sequence === 's' ) {
                //engine.executeSignal('sell')
                console.log('\nmanual' + ' limit ' + 'SELL' + ' command executed')
              } else if (key.sequence === 'S' ) {
                //engine.executeSignal('sell', null, null, false, true)
                console.log('\nmanual' + ' market ' + 'SELL' + ' command executed')
              } else if ((key.sequence === 'c' || key.sequence === 'C') ) {
                console.log('\nmanual' + ' order cancel' + ' command executed')
              } else if (key.sequence === 'm') {
                console.log('\nMANUAL trade in LIVE mode: ')
              } else if (key.sequence === 'T' ) {
                console.log('\n' + 'Taker fees activated')
              } else if (key.sequence === 'M') {
                console.log('\n' + 'Maker fees activated')
              } else if (key.sequence === 'o' ) {
                listOptions()
              } else if (key.sequence === 'O') {
              } else if (key.sequence === 'P') {
                console.log('\nWriting statistics...')
              } else if (key.sequence === 'X' ) {
                console.log('\nExiting... ' + '\nWriting statistics...')
                process.exit(0);
              } else if (key.sequence === 'd' ) {
                console.log('\nDumping statistics...')
                printTrade(false, true)
              } else if (key.sequence === 'D') {
                console.log('\nDumping statistics...')
              } else if (key.sequence === 'L') {
                console.log('\nDEBUG mode: ' )
              }
        });

    }
    parseCurrencyPair( pair ){
        let product =products.find(product => product.id === pair);
        return product.label.split("/");
    }
    async buy(){}
    async sell(){}

    async execute( ticker ){
       //this.header = ["Time               ","Price","Change","Volume","RSI","Signal","LTC","EUR","Profit","Gain Loss"];
       if( Number(ticker.p) === this.lastPrice ){
           return;
       }
       let RuntimeStrategy = Strategy.factory(this.strategy.toLowerCase());
       this.history = (this.history === null) ?  await repo.getBy("candles", {symbol:this.currencyPair }) : this.history;

       this.strategyImp = ( this.strategyImp === null ) ? new  RuntimeStrategy( this.history.candles ) : this.strategyImp;
       this.startTime = ( this.startTime === null ) ? new Date(ticker.T) : this.startTime;
       this.endTime   = ( this.endTime === null )   ? utils.setEndDate(new Date(this.startTime.getTime()),utils.getIntervaDateMap(this.interval)) : this.endTime;
       
       let buffer = [];
       if( new Date().getTime >= this.endTime){
            this.candle.close({ closingPrice:ticker.p, lastVol:ticker.q})
            this.candlesCached.push(JSON.parse(JSON.stringify(this.candle)));
            this.candle = new Candle();
            this.startTime = null;
            this.endTime = null;
       }else{
            this.candle.updateCandle({price:ticker.p, volume:ticker.q})
       }
       // time, price, lastPrice, volume, rsi, signal, pair, profit, gainLoss
       // execute the Strategy : all strategies should implement run();
       let strategyResult = this.strategyImp.run( ticker.p );
       if( strategyResult.status === RESOLVED ){
           if(strategyResult.signal === BUY){
               await this.buy();
           }
           else{
              await this.sell();
           }
       }
       let logInstance = Output.createOutputBuffer( 
           {
               time:new Date(ticker.T), 
               price:ticker.p, 
               lastPrice:this.lastPrice, 
               volume:ticker.q, 
               rsi:strategyResult.value[strategyResult.value.length -1].toString().split(".")[0], 
               signal:strategyResult.signal,
               asset:this.availableAsset+' '+this.currencyAssetSplit[0],
               currency:this.entryFunds+' '+this.currencyAssetSplit[1],
               profit:"00.00",
               gainLoss:"00.00"  
            } 
        )
        
        if( !STREAM_LOCKED ) { this.stdout.writeToStdOut(logInstance , this.printHeader )}
        this.lastPrice = Number(ticker.p)
        this.printHeader = false;
       
    }
}

module.exports = {
    TradeService:TradeService
};