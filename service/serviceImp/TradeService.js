const chalk = require("chalk");
const colors = require('colors');
const align = require('align-text');
const products = require("../../model/Products.json");
const utils = require('../../lib/Utils');
const {Logger} = require('../../lib/Log');
const {ServiceInterface} = require("./ServiceInterface");
const {Candle} = require("../../model/Candle.js");
const {Output} = require("../../model/Output");
const {Strategy} = require("../../strategy/Strategy");
const {BinanceWrapper} = require("../../service/BinanceWrapper");
const repo = require("../../repository/Repository");
const RESOLVED = "resolved";
const BUY = "Buy";
const SELL = "SELL";
let STREAM_LOCKED = false;
let {Interaction} = require("../../lib/Interaction");
const readline = require('readline');

class TradeService extends ServiceInterface {

    static getInstance(params) {
        return new TradeService(params);
    }

    constructor(params) {

        super();
        this.binance = BinanceWrapper.getInstance();
        this.keys = null;
        this.startTime = null;
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
        this.currencyAssetSplit = this.parseCurrencyPair(params.currencyPair)
        this.printHeader = true;
        this.stdout = new Output(this.strategy.toUpperCase(), this.currencyAssetSplit[0], this.currencyAssetSplit[1]);
        this.hasKeys = false;
        console.log(Interaction.getWelcomeHeader());
        this.interaction = Interaction.initialize();
        this.setInteractiveListener();
    }

    setInteractiveListener() {
        let me = this;
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.on('keypress', (str, key) => {
            if (key.sequence === 'l') {
                me.interaction.listKeys()
            } else if (key.sequence === 'b') {
                //engine.executeSignal('buy')
                this.buy()
                console.log('\nmanual'.grey + ' limit '.yellow + 'BUY'.green + ' command executed'.grey)
            } else if (key.sequence === 'B') {
                //engine.executeSignal('buy', null, null, false, true)
                this.buy("market");
                console.log('\nmanual'.grey + ' market '.yellow + 'BUY'.green + ' command executed'.grey)
            } else if (key.sequence === 's') {
                //engine.executeSignal('sell')
                this.sell();
                console.log('\nmanual'.grey + ' limit '.yellow + 'SELL'.red + ' command executed'.grey)
            } else if (key.sequence === 'S') {
                this.sell("market");
                //engine.executeSignal('sell', null, null, false, true)
                console.log('\nmanual'.grey + ' market '.yellow + 'SELL'.red + ' command executed'.grey)
            } else if ((key.sequence === 'c' || key.sequence === 'C')) {
                console.log('\nmanual'.grey + ' !!!!order cancel!!!!'.red + ' command executed'.red)
            } else if ((key.sequence === 'm')) {
                console.log('\nEnabling Manual Trading'.grey)
            } else if (key.sequence === 'X') {
                console.log('\nExiting... ' + '\n')
                process.exit(0);
            } else if (key.sequence === 'P') {
                console.log('\nDumping  trades ...'.grey +"\n");
                this.getTrades()
            } else if (key.sequence === 'T') {
                console.log('\nDumping all trades ...');
                this.getTrades( true )
            }
        });

    }

    parseCurrencyPair(pair) {
        let product = products.find(product => product.id === pair);
        return product.label.split("/");
    }

    async buy( type = "limit") {
        if( this.hasKeys ){
            try {

            }catch(error){
                return null;
            }
        }else{
            console.log("  No Api Keys detected !!!!".red +"  please run add-keys command first and set up api keys  ".yellow)
        }
    }

    async sell( type ="limit") {
        if( this.hasKeys ){
            try {

            }catch(error){
                return null;
            }
        }else{
            console.log("  No Api Keys detected !!!!".red +"  please run add-keys command first and set up api keys  ".yellow)
        }
    }

    async getTrades( all = false ) {
        if( this.hasKeys){
            let trades = null;
            try {
                if( all ){
                     trades = await this.binance.privateApi(this.keys).trades();
                }else{
                     trades = await this.binance.privateApi(this.keys).trades(this.currencyPair);
                }
                this.stdout.printTrades(trades);
            }catch(error){
                return null;
            }
        }else{
            console.log("  No Api Keys detected !!!!".red +"  please run add-keys command first and set up api keys  ".yellow)
        }
    }

    async execute(ticker) {
        //this.header = ["Time               ","Price","Change","Volume","RSI","Signal","LTC","EUR","Profit","Gain Loss"];
        if (Number(ticker.p) === this.lastPrice) {
            return;
        }
        await this.createKeys();
        let RuntimeStrategy = Strategy.factory(this.strategy.toLowerCase());

        this.history = (this.history === null) ? await repo.getBy("candles", {symbol: this.currencyPair}) : this.history;
        this.strategyImp = (this.strategyImp === null) ? new RuntimeStrategy(this.history.candles) : this.strategyImp;
        this.startTime = (this.startTime === null) ? new Date(ticker.T) : this.startTime;
        this.endTime = (this.endTime === null) ? utils.setEndDate(new Date(this.startTime.getTime()), utils.getIntervaDateMap(this.interval)) : this.endTime;

        if (new Date().getTime >= this.endTime) {
            this.candle.close({closingPrice: ticker.p, lastVol: ticker.q})
            this.candlesCached.push(JSON.parse(JSON.stringify(this.candle)));
            this.candle = new Candle();
            this.startTime = null;
            this.endTime = null;
        } else {
            this.candle.updateCandle({price: ticker.p, volume: ticker.q})
        }
        // time, price, lastPrice, volume, rsi, signal, pair, profit, gainLoss
        // execute the Strategy : all strategies should implement run();
        let strategyResult = this.strategyImp.run(ticker.p);
        if (strategyResult.status === RESOLVED) {
            if (strategyResult.signal === BUY) {

                console.log("\n**************".grey + "  " + strategyResult.signal.toUpperCase().green + "  " + strategyResult.signal.toUpperCase().green + "  " + strategyResult.signal.toUpperCase().green + "  **************".grey);
                await this.buy();

            } else {
                console.log("\n**************".grey + "  " + strategyResult.signal.toUpperCase().red + "  " + strategyResult.signal.toUpperCase().red + "  " + strategyResult.signal.toUpperCase().red + "  **************".grey);
                await this.sell();
            }
        }
        let logInstance = Output.createOutputBuffer(
            {
                time: new Date(ticker.T),
                price: ticker.p,
                lastPrice: this.lastPrice,
                volume: ticker.q,
                rsi: strategyResult.value.toString().split(".")[0],
                signal: strategyResult.signal,
                asset: this.availableAsset + ' ' + this.currencyAssetSplit[0],
                currency: this.entryFunds + ' ' + this.currencyAssetSplit[1],
                profit: "00.00",
                gainLoss: "00.00"
            }
        )

        if (!STREAM_LOCKED) {
            this.stdout.writeToStdOut(logInstance, this.printHeader)
        }

        this.lastPrice = Number(ticker.p)
        this.printHeader = false;

    }

    async createKeys() {
        this.keys = (this.keys === null) ? await repo.getBy("api-keys", {hook: require("../../model/models").keys.hook}) : this.keys;
        if (this.keys && (this.keys.key.length > 1 && this.keys.secret.length > 1)) {
            this.hasKeys = true;
        }
    }
}

module.exports = {
    TradeService: TradeService
};
