let { BinanceWrapper }   = require("../service/BinanceWrapper");
const { HistoricalDataService } =  require("../service/serviceImp/HistoricalDataService");
let { TradeService}     = require("../service/serviceImp/TradeService");
const chalk = require("chalk");



module.exports =  (program, app) =>{
    program
        .command('trade-bot [selector]')
        .description('Non automated trading, with interactive trade options.\nOptional: configure a Strategy default:RSI ')
        .option('--strategy <name>', 'Buy|Sell Signals on the console ', String, app.config.defaults.strategy)
        .option('--interval <interval>', 'Candle interval to calculate possible indiators in the strategies', String, app.config.defaults.interval)
        .option('--currencyPair <name>', 'The Currency Pair to use', String, app.config.defaults.currencyPair)
        .option('--entryPrice <name>', 'The initial entry funds available for trading on the exchange (Only used during paperTrade mode)', Number, app.config.defaults.initialEntryPrice)
        .option('--availableAsset <name>', 'The Initial Asset Quantity on the exchange (Only used during paperTrade mode)', Number, app.config.defaults.initialAssetCapital)
        .option('--exchangeFee <pct>', 'Aproxmitate fee for trades on the exchange ', Number, app.config.defaults.fee)
        .option('--buyPct <pct>', 'Set an initial buy sell percentage based on you initial entry funds\nCan be adjusted/changed in the interactice console', Number, app.config.defaults.buyPct)
        .option('--sellPct <pct>', 'Set an initial buy sell percentage based on you initial entry funds', Number, app.config.defaults.sellPct)
        .option('--limitBuy <pct>', 'Set buy limit percentage (default is 0) ', Number, 2)
        .option('--limitSell <pct>', 'Set buy limit percentage (default is 0)', Number,2)
        .option('--paperTrade <name>', 'this flag dissables real trades from being executed on the exchange.\nuse this if you want to observe and test trading strategies', Boolean, app.config.defaults.paperTrade)
        .option('--sellStopPct <pct>', 'sell if price drops below this % of bought price', Number, app.config.defaults.sellStopPct)
        .option('--buyStopPct <pct>', 'buy if price surges above this % of sold price', Number, app.config.defaults.buyStopPct)
        .option('--runFor <minutes>', 'Execute for a period of minutes then exit with status 0', String, null)
        .option('--sellPct <pct>', 'sell with this % of asset balance', Number, app.config.defaults.sell_pct)
        .option('--noTrade', 'watch price and account balance, but do not perform trades', Boolean, false)
        .option('--lastTradeSide', 'Indicate what type of trade was last executed ( buy/sell)',String, app.config.defaults.lastTradeSide)
        .action( async (cmd,selector) => {
             let binanceWrapper = BinanceWrapper.getInstance()
             let tradeService = TradeService.getInstance( selector, app )
             let historicalDataService = HistoricalDataService.getInstance();
             console.log(`${chalk.cyan("Fetching  Historical Data from Exchange @ ")} ${selector.interval} interval`)
             await binanceWrapper.publicAPI().candles(historicalDataService, selector.currencyPair, selector.interval);
             binanceWrapper.websockets().ticker( tradeService, selector.currencyPair )
             
        });
};
