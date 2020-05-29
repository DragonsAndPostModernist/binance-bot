let { BinanceWrapper } = require("../BinanceWrapper");
let { TradeService } = require("../socket/TradeService");
let { HistoricalDataService} = require("../serviceImp/HistoricalDataService");
let historicalDataService = HistoricalDataService.getInstance();

let repo = require("../../repository/Repository");
let client = BinanceWrapper.getInstance();
let log = require("../../lib/logger");
const FILLED = "FILLED";
class SocketService {

    static builder() {
        return new SocketService();
    }
    constructor() {
        this.socketQueue = [];
        this.ws;
        this.currencyPair = "BTCEUR";
        this.frontendSocket = null;
        this.activeSocket = null;
    }
    stopSockets(log = true) {
        //stopSocketsRunning = true;
        if (this.ws && this.ws.subscriptions()) {
            let endpoints = this.ws.subscriptions();
            for (let endpoint in endpoints) {
                if (log) console.log('Terminated ws endpoint: ' + endpoint);
                this.ws.terminate(endpoint);
            }
        }
    }
    async loadAccountInfo(data = null) {
        // load keys
        let keys = await repo.getBy("api-keys", {
            hook: "binance-bot"
        });
        // load last trades 
        let lastTrades = await client.privateApi(keys).trades((data) ? data.cp : this.currencyPair);
        // load last Filled order
        let numTrades = lastTrades.result.length;
        let isFilled = false;
        let lastFilledOrder = null;
        // since there might be open trades we must get the last filled trade
        while (numTrades > 0 && !isFilled) {
            // load last trades 
            lastFilledOrder = await client.privateApi(keys).orderStatus((data) ? data.cp : this.currencyPair, lastTrades.result[numTrades - 1].orderId);
            if (lastFilledOrder.result.status === FILLED) {
                lastFilledOrder = lastFilledOrder.result;
                isFilled = true;
            }
            numTrades--;
        }
        // load open orders
        let openOrders = await client.privateApi(keys).orders((data) ? data.cp : this.currencyPair);
        // load all orders
        let allOrders = await client.privateApi(keys).allOrders((data) ? data.cp : this.currencyPair);
        // load depositHistory
        let depositHistory = await client.privateApi(keys).getDepositHistory();
        return {
            lastTrades:lastTrades.result,
            openOrders:openOrders.result,
            allOrders:allOrders.result,
            depositHistory:depositHistory.result,
            lastFilledOrder:lastFilledOrder
        }

    }
    initializeSocketListeners() {
        let me = this;
        this.frontendSocket.on('connection', (socket) => {
            //socketPool.push(socket);
            socket.on('disconnect', async function () {
                log.info('socket disconnected');
                try {
                    me.stopSockets();
                } catch (e) {
                    console.log("On disconnect error ignore.")
                }
            });
            socket.on('stopStream', async function () {
                log.info('socket disconnected');
                me.stopSockets();
                me.setcurrencyPair(data.cp);

            });
            socket.on('client', async  function () {
               
            });
            socket.on('test', function (data) {
                log.info('test ' + data);

            });
            socket.on("globals", async function(){
                log.info('socket connection');
                let { PatternRecognitionIndicator, IndicatorUtils } = require("../../indicators/Indicators")
                let strategies = Object.getOwnPropertyNames(require("../../indicators/Indicators")); 
                let patterns =   Object.getOwnPropertyNames(PatternRecognitionIndicator);
                let utils =      Object.getOwnPropertyNames(IndicatorUtils);
                let ignoreStrings = ["name", "length", "prototype"];
                ignoreStrings.forEach( index => {
                    let targetIndex  = patterns.indexOf(index) ;
                    if (targetIndex !== -1) patterns.splice(targetIndex, 1);

                    targetIndex  = utils.indexOf(index) ;
                    if (targetIndex !== -1) utils.splice(targetIndex, 1);
                })
                let bots = await repo.getAll("bots");
                socket.emit("uiGlobals", { strategies, patterns, utils, bots });
            })
            socket.on('alert', async function (data) {

            });
            socket.on('symbolChange', async function (data) {
                me.stopSockets();
                let info = await me.loadAccountInfo(data);
                socket.emit("accountInfo", info)
                if( data.stream ){
                    me.runStream({
                        cp: data.cp
                    }, socket)
                }
            });
            socket.on('boot', async function (data) {
                let info = await me.loadAccountInfo();
                socket.emit("accountInfo", info)
            });
            socket.on('openOrders', async function (data) {

            });
            socket.on('orderHistory', async function (data) {

            });
            socket.on('tradeHistory', async function (data) {

            });
            socket.on('tradeHistory', async function (data) {

            });
            socket.on('funding', async function (data) {

            });
            socket.on('binaryTrade', async function (data) {

            });
            socket.on('profitTargetCalculator', async function (data) {

            });
            socket.on('entryExitCalculator', async function (data) {

            });
            socket.on('paperTrade', async function (data) {

            });
            socket.on('simulator', async function (data) {

            });
            socket.on('paperTrade', async function (data) {

            });
            socket.on('apiKeys', async function (data) {

            });
            socket.on('stream', async function (data) {
                this.runStream(data, socket);
            })
        });
    }
    async runStream(data, socket) {
        this.addWebSocket();
        log.info('Loading Historical data @ 30m interval')
        let binanceWrapper = BinanceWrapper.getInstance();
        await binanceWrapper.publicAPI().candles(historicalDataService, data.cp , "30m");
        log.info('socket connection:: streamTicker');
        log.info(JSON.stringify(data));
        let service = TradeService.getInstance(data.cp);
        this.setcurrencyPair(data.cp);
        this.ws.trades(this.currencyPair, (trades) => {
            log.info(trades);
            service.execute(trades, socket);
        });
    }

    addWebSocket() {
        this.ws = BinanceWrapper.getInstance().websockets().getSocket();
        return this;
    }

    setcurrencyPair(cp) {
        this.currencyPair = cp;

        return this;
    }

    setFrontendSocket(socket) {
        this.frontendSocket = socket;
        this.initializeSocketListeners();
        return this;
    }

    stream(service) {

    }

}

module.exports = {
    SocketService: SocketService
}