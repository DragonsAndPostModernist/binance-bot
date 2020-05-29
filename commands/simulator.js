const {
    HistoricalDataService
} = require("../service/serviceImp/HistoricalDataService");
let {
    SimulationService
} = require("../service/serviceImp/SimulationService");
let {
    BinanceWrapper
} = require("../service/BinanceWrapper");
const chalk = require("chalk");


module.exports = (program, app) => {
    program
        .command('simulator [selector]')
        .description('Run a strategy on a data set ')
        .option('--strategy <name>', 'Buy|Sell Signals on the console ', String, app.config.defaults.strategy)
        .option('--interval <interval>', 'Candle interval to calculate possible indiators in the strategies', String, app.config.defaults.interval)
        .option('--currencyPair <name>', 'The Currency Pair to use', String, app.config.defaults.currencyPair)
        .option('--entryPrice <name>', 'The initial entry funds available for trading on the exchange (Only used during paperTrade mode)', Number, app.config.defaults.initialEntryPrice)
        .option('--exchangeFee <pct>', 'Aproxmitate fee for trades on the exchange ', Number, app.config.defaults.fee)
        .option('--buyPct <pct>', 'Set an initial buy sell percentage based on you initial entry funds\nCan be adjusted/changed in the interactice console', Number, app.config.defaults.buyPct)
        .option('--sellPct <pct>', 'Set an initial buy sell percentage based on you initial entry funds', Number, app.config.defaults.sellPct)
        .option('--limitBuy <pct>', 'Set buy limit percentage (default is 0) ', Number, 2)
        .option('--limitSell <pct>', 'Set buy limit percentage (default is 0)', Number, 2)
        .option('--sellStopPct <pct>', 'sell if price drops below this % of bought price', Number, app.config.defaults.sellStopPct)
        .option('--buyStopPct <pct>', 'buy if price surges above this % of sold price', Number, app.config.defaults.buyStopPct)
        .option('--numSets <sets>', 'The number of data sets you want to retrieve each data set contains about 500 candles', Number, app.config.defaults.pollTime)
        .action(async (cmd, selector) => {
            let historicalDataService = HistoricalDataService.getInstance();
            historicalDataService.setPollTime(selector.numSets)
            console.log(`${chalk.cyan("Fetching  Historical Data from Exchange @ ")} ${selector.interval} interval`)
            let binanceWrapper = BinanceWrapper.getInstance()
            await binanceWrapper.publicAPI().candles(historicalDataService, selector.currencyPair, selector.interval);
            let service = SimulationService.getInstance();
            service.setStrategy(selector.strategy)
                .setCurrencyPair(selector.currencyPair)
                .setEntryPrice(selector.entryPrice)
                .setExchangeFee(selector.exchangeFee)
                .setBuyPct(selector.buyPct)
                .setSellPct(selector.sellPct)
                .setLimitBuy(selector.limitBuy)
                .setLimitSell(selector.setLimitSell)
                .setSellStopPct(selector.sellStopPct)
                .setBuyStopPct(selector.buyStopPct)

            await service.execute();

        });
};