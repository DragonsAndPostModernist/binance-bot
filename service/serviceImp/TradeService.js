const chalk = require("chalk");
const colors = require('colors');
const align = require('align-text');
const products = require("../../model/Products.json");
const utils = require('../../lib/Utils');
const {Logger} = require('../../lib/Log');
const {ServiceInterface} = require("./ServiceInterface");
const {Candle} = require("../../model/Candle.js");
const {Output} = require("../../model/Output");
const models = require("../../model/models");
const {Strategy} = require("../../strategy/Strategy");
const {BinanceWrapper} = require("../../service/BinanceWrapper");
const { BuyAndSellEngine } = require("../../lib/BuyAndSellEngine")
const repo = require("../../repository/Repository");
const RESOLVED = "resolved";
const BUY = "BUY";
const SELL = "SELL";
const BOUGHT = "BOUGHT";
const SOLD = "SOLD";
const STATE_POLLING = "state.order.polling";
const STATE_FILLED = "state.order.filled";
const STATE_PENDING = "state.order.pending";
const STATE_CANCELED = "state.order.canceled"
let STREAM_LOCKED = false;
let {Interaction} = require("../../lib/Interaction");
const readline = require('readline');

class TradeService extends ServiceInterface {

    static getInstance(params, app) {
        return new TradeService(params, app);
    }

    constructor(params, app ) {
      
        super();
        app.lastFilledOrder = (app.lastFilledOrder  !== undefined ) ? app.lastFilledOrder : this.getLastOrderMock()
        console.log(app.lastFilledOrder)
        this.state = STATE_PENDING;
        this.limit = {
            buy:params.limitBuy,
            sell:params.limitSell
        }
        this.binance = BinanceWrapper.getInstance();
        this.engine = new BuyAndSellEngine( this.binance, !params.paperTrade, app );
        this.keys = app.keys;
        this.trades = ( app.lastTrades.status === 0 ) ? app.lastTrades.result : [];
        this.lastTrade = null;
        this.openOpenOrder = null;
        this.lastFilledOrder = app.lastFilledOrder || this.getLastOrderMock();
        this.lastTradeSide =  app.lastFilledOrder.price || params.lastTradeSide;
        this.startTime = null;
        this.endTime = null;
        this.candle = new Candle()
        this.currencyPair = params.currencyPair;
        this.strategy = params.strategy
        this.interval = params.interval;
        this.pair = params.currencyPair;
        this.entryPrice =  params.entryPrice || app.lastFilledOrder.price ;
        this.availableAsset = app.lastFilledOrder || params.availableAsset;
        this.exchangeFee = params.exchangeFee;
        this.buyPct = params.buyPct;
        this.sellPct = params.sellPct;
        this.isPaperTrade = params.paperTrade;
        this.sellStopPct = params.sellStopPct;
        this.buyStopPct = params.buyStopPct;
        this.runFor = params.runFor;
        this.noTrade = params.noTrade;
        this.lastPrice = 0;
        this.engineEvaluationCallback = null;
        this.candlesCached = [];
        this.history = null;
        this.strategyImp = null;
        this.lastOrder = null;
        this.currencyAssetSplit = this.parseCurrencyPair(params.currencyPair)
        this.printHeader = true;
        this.stdout = new Output(this.strategy.toUpperCase(), this.currencyAssetSplit[0], '@'+this.currencyAssetSplit[1], this.lastTradeSide);
        this.hasKeys = false;
        console.log(Interaction.getWelcomeHeader());
        console.log("\n\n"+Interaction.botLiveWarning(this.isPaperTrade))
        this.interaction = Interaction.initialize();
        this.setInteractiveListener();
        this.setTradeOptions();
    }

    async orderPoll(  ){
       if( this.openOpenOrder && this.lastPrice > 0){
           let result = await this.engine.orderPoll( this.currencyPair, this.openOpenOrder.orderId, this.lastPrice) //currencyPair, orderId, price
           if( result.filled ){
               console.log("\nOrder Filled !!!!".yellow + "  ")
               this.state = STATE_FILLED;
              
               this.lastFilledOrder = null;
               this.lastFilledOrder = result.order;
               this.setTradeOptions();
               this.stdout.printOrder(this.lastFilledOrder);
           }
       }else{ return;}
    }
    calculateManualBuyEntry( currentPrice, isLimit, isStop ){
        let pct = Number(this.buyPct);
        let stopPrice =   Number(currentPrice) + ( Number(currentPrice) / 100 ) * Number(this.buyStopPct )
        let currentAvailableFunds = this.calculateEntry( (this.lastTradeSide === BUY), this.lastFilledOrder );
        this.availableAsset = (1 / Number( currentPrice) ) * Number(currentAvailableFunds);
        this.availableAsset = ( Number( this.availableAsset) / 100) * pct;  
        let limitPrice = Number(currentPrice) - ( Number(currentPrice) / 100 ) * Number(this.limit.buy ) 
        let stopParams = {
            stopPrice:stopPrice,
            type:"STOP_LOSS_LIMIT"
        }
        if(isStop){
            limitPrice = Number(stopParams.stopPrice ) + (  (Number( stopParams.stopPrice ) / 100) * Number(this.buyStopPct) ) 
            console.log("\nBuying".green +"  "+  this.availableAsset.toString().cyan +"  "+ this.currencyAssetSplit[0].yellow + "  @Limit Price ".cyan + Number(limitPrice).toFixed(2).yellow +" Stop Entry@".cyan +" "+Number(stopParams.stopPrice).toFixed(2).yellow +"\n" )
            return { qty: this.availableAsset, price:limitPrice, stopParams:stopParams}
        }
        else if(isLimit){
            console.log("\nBuying".green +"  "+  this.availableAsset.toString().cyan +"  "+ this.currencyAssetSplit[0].yellow + "  @Limit Price ".cyan + Number(limitPrice).toFixed(2).yellow+"\n")
            return { qty: this.availableAsset, price:limitPrice, stopParams:stopParams}
        }else{
            console.log("\nXBuying".green +"  "+  this.availableAsset.toString().cyan +"  "+ this.currencyAssetSplit[0].yellow + "  @Market Price ".cyan)+"\n"
            return { qty: this.availableAsset, price:limitPrice, stopParams:stopParams}
        }
       
    }
    calculateManualSellEntry( currentPrice, isLimit, isStop ){
        let pct = Number(this.sellPct);
        let stopPrice =   Number(currentPrice) - ( Number(currentPrice) / 100 ) * Number(this.sellStopPct )
        let currentAvailableFunds =  this.calculateEntry( (this.lastTradeSide === BUY), this.lastFilledOrder );
        this.availableAsset = (1 / Number( currentPrice) ) * Number(currentAvailableFunds);
        this.availableAsset = ( Number( this.availableAsset) / 100) * pct;
        let limitPrice = Number(currentPrice) + ( Number(currentPrice) / 100 ) * Number(this.limit.sell ) 
        let stopParams = {
            stopPrice:stopPrice,
            type:"STOP_LOSS_LIMIT"
        }
        if(isStop){
            limitPrice = Number(stopParams.stopPrice ) - (  (Number( stopParams.stopPrice ) / 100) * Number(this.buyStopPct) ) 
            console.log("\nSelling".red +"  "+ this.availableAsset.toString().cyan +"  "+ this.currencyAssetSplit[0].yellow + "  @Limit Price ".cyan + Number(limitPrice).toFixed(2).yellow +" Stop Entry@".cyan +" "+Number(stopParams.stopPrice).toFixed(2).yellow +"\n")
            console.log("\n")
            return { qty:this.availableAsset, price:limitPrice, stopParams:stopParams}
        }
        else if( isLimit ){
            console.log("\nSelling".red +"  "+ this.availableAsset.toString().cyan +"  "+ this.currencyAssetSplit[0].yellow + "  @Limit Price ".cyan + Number(limitPrice).toFixed(2).yellow +"\n")
            console.log("\n")
            return { qty:this.availableAsset, price:limitPrice, stopParams:stopParams}
        }else{
            console.log("\nSelling".red +"  "+ this.availableAsset.toString().cyan +"  "+ this.currencyAssetSplit[0].yellow + "  @Market Price ".cyan +"\n")
            console.log("\n")
            return { qty:this.availableAsset, price:limitPrice, stopParams:stopParams}
        }
        
    }

    async cancelOrder(){
        if( this.openOpenOrder){}
        this.engine.cancelOrder(this.currencyPair);
        this.state = STATE_CANCELED;
    }
    setTradeOptions(){
        if(this.lastFilledOrder !== null ){
            // last order could have been a market order no price details here recalculate based on cummulativeQuoteQty executedQty
            if( Number(this.lastFilledOrder.price ) === 0){
                this.lastFilledOrder.price = ( Number( this.lastFilledOrder.cummulativeQuoteQty) / Number(this.lastFilledOrder.executedQty) )
            }
            this.setTradeValues();
        }
    }


    setTradeValues() {
    
        this.availableAsset = this.lastFilledOrder.executedQty;
        this.entryPrice =  this.lastFilledOrder.price;
        this.lastTradeSide = (this.lastFilledOrder.side === BUY) ? BUY : SELL;
    }

    getLastOrderMock(type="LIMIT",  side="BUY", status="FILLED"){
        let lastOrderMock = models.mockOrder;
        lastOrderMock.symbol= this.currencyPair,
        lastOrderMock.orderId= 503186179,
        lastOrderMock.orderListId= -1,
        lastOrderMock.clientOrderId= 'and_a599904f818d4b649bb142467cfee116',
        lastOrderMock.price= this.entryPrice,
        lastOrderMock.origQty= this.availableAsset,
        lastOrderMock.executedQty= this.availableAsset,
        lastOrderMock.cummulativeQuoteQty= ( Number( this.entryPrice ) * Number(this.availableAsset)),
        lastOrderMock.status= status,
        lastOrderMock.timeInForce= 'GTC',
        lastOrderMock.type= type,
        lastOrderMock.side= side,
        lastOrderMock.stopPrice= '0.00000000',
        lastOrderMock.icebergQty= '0.00000000',
        lastOrderMock.time= new Date(),
        lastOrderMock.updateTime= new Date(),
        lastOrderMock.isWorking= true,
        lastOrderMock.origQuoteOrderQty= '0.00000000'
        return lastOrderMock;
    }
    getTradeMock() {
        let tradeMock = models.mockTrade;
        tradeMock.id = 9572;
        tradeMock.orderId =  47884;
        tradeMock.price=  this.entryPrice;
        tradeMock.qty=  this.availableAsset;
        tradeMock.commission= (this.entryPrice * this.availableAsset) / 100;
        tradeMock.commissionAsset= this.currencyAssetSplit[0];
        tradeMock.time= new Date();
        tradeMock.isBuyer= true;
        tradeMock.isMaker= true;
        tradeMock.isBestMatch= true;
        return tradeMock;
    }

    getTradeOptions(){
        let buffer = {
            "Currency Pair  ":this.currencyPair,
            "Strategy       ":this.strategy,
            "Interval       ":this.interval, 
            "Pair           ":this.pair, 
            "Buy Percentage ":this.buyPct.toString(),
            "Sell Percentage":this.sellPct.toString(), 
            "Papertrade mode":this.isPaperTrade.toString(), 
            "Limit Buy Pct  ":this.limit.buy.toString(),
            "Limit Sell Pct ":this.limit.sell.toString(),
            "Sell Stop Loss ":this.sellStopPct.toString(),
            "Buy Stop Loss  ":this.buyStopPct.toString(),
            "Run For minutes":this.runFor === null ? "infinite" : this.runFor.toString,
            "No Trading     ":this.noTrade.toString(), 
            "Last Price     ":this.lastPrice.toString(), 
            "Available Asset":this.availableAsset.toString(), 
            "Entry Funds    ":this.entryPrice.toString(), 
            "Last Trade Side":this.lastTradeSide,
        };
        this.stdout.printTradeOptios(buffer);

    }
    setInteractiveListener() {
        let me = this;
        readline.emitKeypressEvents(process.stdin);
        try {
            process.stdin.setRawMode(true);
        } catch (err) {
            if(process.stdin.isTTY){
                    process.stdin.setRawMode(true);
            }
        }
        process.stdin.on('keypress', (str, key) => {
            if (key.sequence === 'l') {
                me.interaction.listKeys()
            } else if (key.sequence === 'b' && !this.noTrade ) {
              
                let orderParams = this.calculateManualBuyEntry(this.lastPrice, true)
                this.engine.executeLimitBuyOrder(this.currencyPair, orderParams.qty, orderParams.price )
                this.state  = STATE_POLLING;
                this.openOpenOrder = this.engine.getOrder();
                console.log('\nmanual'.grey + ' limit '.yellow + 'BUY'.green + ' command executed'.grey)

            } else if (key.sequence === 'B' && !this.noTrade ) {

                let orderParams = this.calculateManualBuyEntry(this.lastPrice, false);
                this.engine.executeBuySignal( orderParams.qty, this.currencyPair, orderParams.price );
                this.lastFilledOrder = this.engine.getOrder();
                this.setTradeOptions();
                console.log('\nmanual'.grey + ' market '.yellow + 'BUY'.green + ' command executed'.grey)

            } else if (key.sequence === 's' && !this.noTrade ) {

                let orderParams = this.calculateManualSellEntry(this.lastPrice, true)
                this.engine.executeLimitSellOrder(this.currencyPair, orderParams.qty, orderParams.price )
                this.state  = STATE_POLLING;
                this.openOpenOrder = this.engine.getOrder();
                console.log('\nmanual'.grey + ' limit '.yellow + 'BUY'.green + ' command executed'.grey)

            } else if (key.sequence === 'S' && !this.noTrade ) {

                let orderParams = this.calculateManualSellEntry(this.lastPrice, false)
                this.engine.executeSellSignal( orderParams.qty, this.currencyPair, orderParams.price )
                this.lastFilledOrder = this.engine.getOrder();
                this.setTradeOptions();
                console.log('\nmanual'.grey + ' market '.yellow + 'SELL'.red + ' command executed'.grey)

            } else if (key.sequence === 'Y' && !this.noTrade ) {

                let orderParams = this.calculateManualBuyEntry(this.lastPrice, false, true)
                this.engine.executeStopLimitBuyOrder( this.currencyPair,orderParams.qty, orderParams.price, orderParams.stopParams )
                this.state  = STATE_POLLING;
                this.openOpenOrder = this.engine.getOrder();
                console.log('\nmanual'.grey + ' stop loss buy order '.yellow + 'BUY'.green + ' command executed'.grey)

            } else if (key.sequence === 'Z' && !this.noTrade ) {
                let orderParams = this.calculateManualSellEntry(this.lastPrice, false, true)
                this.engine.executeStopLimitSellOrder( this.currencyPair,orderParams.qty, orderParams.price, orderParams.stopParams )
                this.state  = STATE_POLLING;
                this.openOpenOrder = this.engine.getOrder();
                console.log('\nmanual'.grey + ' stop loss sell order '.yellow + 'SELL'.red + ' command executed'.grey)
            } 
            else if ((key.sequence === 'c' || key.sequence === 'C')) {
                console.log('\nmanual'.grey + ' !!!!order cancel!!!!'.red + ' command executed'.red)
                this.cancelOrder();
            } else if ((key.sequence === 'm')) {
                if( this.noTrade ){
                    console.log("\n Enabling Trading\n".grey)
                    this.noTrade = false;
                }else{
                    console.log('\nDisabling Trading\n'.grey)
                    this.noTrade = true;
                }
            } else if (key.sequence === 'X') {
                console.log('\nExiting... ' + '\n')
                process.exit(0);S
            } else if (key.sequence === 'P') {
                console.log('\nDumping  trades ...'.grey +"\n");
                this.getTrades()
            } else if (key.sequence === 'T') {
                this.getTradeOptions();
            } else if (key.sequence === 'M') {
                STREAM_LOCKED = true;
                this.interaction.interaction( this ).then(()=>{
                    this.setInteractiveListener();
                    STREAM_LOCKED = false;
                });
               
            } 
        });

    }

    parseCurrencyPair(pair) {
        let product = products.find(product => product.id === pair);
        return product.label.split("/");
    }


    async getTrades( ) {
        if( this.hasKeys){
            try {
                let tradeHist = await this.binance.privateApi(this.keys).trades(this.currencyPair);
                this.trades = tradeHist.result
                this.stdout.printTrades(this.trades);
                this.setTradeOptions();
            }catch(error){
                return null;
            }
        }else{
            this.stdout.printNoKeysMessage();
        }
    }

    async execute(ticker) {
        //this.header = ["Time               ","Price","Change","Volume","RSI","Signal","LTC","EUR","Profit","Gain Loss"];
        if (Number(ticker.p) === this.lastPrice) {return;}
        
        if( this.state == STATE_POLLING){
            let orderStatus = await this.orderPoll()
        }
        await this.createKeys();
        await this.configureStrategy(ticker);
        this.updateCandle(ticker);
        // time, price, lastPrice, volume, rsi, signal, pair, profit, gainLoss
        // execute the Strategy : all strategies should implement run();
        let strategyResult = await this.runStrategy(ticker);
        let logInstance = this.getLogInstance(ticker, strategyResult)
        if (!STREAM_LOCKED) {
            this.stdout.writeToStdOut(logInstance, this.printHeader)
        }

        this.lastPrice = Number(ticker.p)
        this.printHeader = false;
    }

    calculateProfit(  ticker, lastPrice ){
       let assetPrice = this.calculateEntry( false, ticker);
       if( this.lastTradeSide === BUY ){
           // The last Entry was a buy we want to calculate sell profit 
           return { isProfit:(assetPrice > lastPrice), assetPrice:assetPrice, diff:Math.abs(assetPrice - lastPrice) } 
       }else{
            // The last Entry was a sell we want to calculate buy in profit 
          return { isProfit:(assetPrice < lastPrice), assetPrice:assetPrice, diff:Math.abs(assetPrice - lastPrice)  } 
       } 
    }
    calculateEntry( isBuyEntry, lastTrade ){
        if( isBuyEntry ){
            let adjustedQuantity = Number( lastTrade.executedQty ) ;
            return ( Number(lastTrade.price) * adjustedQuantity ) ;
        }else{
           return  Number(lastTrade.executedQty)  *  (Number(lastTrade.price)); 
        }
    }
    getLogInstance(ticker, strategyResult) {
        let profit = this.calculateProfit( { price:ticker.p, executedQty:this.lastFilledOrder.executedQty },this.calculateEntry( (this.lastTradeSide === BUY), this.lastFilledOrder ) );
        return Output.createOutputBuffer({
            isBuy:(this.lastTradeSide === BUY),
            time: new Date(ticker.T),
            price: ticker.p,
            lastPrice: this.lastPrice,
            volume: ticker.q,
            rsi: strategyResult.value.toString().split(".")[0],
            signal: strategyResult.signal,
            asset: Number(this.availableAsset).toFixed(4) + ' ' + this.currencyAssetSplit[0],
            currency: Number(this.entryPrice).toFixed(2) + ' ' + this.currencyAssetSplit[1],
            entry: this.calculateEntry( (this.lastTradeSide === BUY), this.lastFilledOrder ).toFixed(2),
            profit: profit,
            gainLoss: null
        });
    }

    async runStrategy(ticker) {
        let strategyResult = this.strategyImp.run(ticker.p);
        if (strategyResult.status === RESOLVED ) {
            if (strategyResult.signal === BUY) {
                console.log("\n**************".grey + "  " + strategyResult.signal.toUpperCase().green + "  " + strategyResult.signal.toUpperCase().green + "  " + strategyResult.signal.toUpperCase().green + "  **************".grey);
               
            }
            else {
                console.log("\n**************".grey + "  " + strategyResult.signal.toUpperCase().red + "  " + strategyResult.signal.toUpperCase().red + "  " + strategyResult.signal.toUpperCase().red + "  **************".grey);
                
            }
        }else{
            strategyResult.signal = ( this.lastTradeSide === BUY) ? BUY : SELL; 
        }
        return strategyResult;
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

    async configureStrategy(ticker) {
        let RuntimeStrategy = Strategy.factory(this.strategy.toLowerCase());
        this.history = (this.history === null) ? await repo.getBy("candles", { symbol: this.currencyPair }) : this.history;
        this.strategyImp = (this.strategyImp === null) ? new RuntimeStrategy(this.history.candles) : this.strategyImp;
        this.startTime = (this.startTime === null) ? new Date(ticker.T) : this.startTime;
        this.endTime = (this.endTime === null) ? utils.setEndDate(new Date(this.startTime.getTime()), utils.getIntervaDateMap(this.interval)) : this.endTime;
    }

    async createKeys() {
        this.keys = (this.keys === null) ? await repo.getBy("api-keys", {hook: models.keys.hook}) : this.keys;
        if (this.keys && (this.keys.key.length > 1 && this.keys.secret.length > 1)) {
            this.hasKeys = true;
        }
    }
}

module.exports = {
    TradeService: TradeService
};
