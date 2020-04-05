let { BinanceWrapper }   = require("../service/BinanceWrapper");
let { TradeService}     = require("../service/serviceImp/TradeService")
module.exports =  (program, conf) =>{
    program
        .command('trade-bot [selector]')
        .description('Non automated trading, with interactive trade options.\nOptional: configure a Strategy default:RSI ')
        .option('--strategy <name>', 'Buy|Sell Signals on the console ', String, conf.defaults.strategy)
        .option('--strategy_interval <interval>', 'Candle interval to calculate possible indiators in the strategies', Number, conf.interval)
        .option('--currencyPair <name>', 'The Currency Pair to use', String, conf.defaults.currencyPair)
        .option('--entryFunds <name>', 'The initial entry funds available for trading on the exchange', Number, conf.defaults.initialCurrencyCapital)
        .option('--availableAsset <name>', 'The Initial Asset Quantity on the exchange', Number, conf.defaults.initialAssetCapital)
        .option('--exchangeFee <pct>', 'Aproxmitate fee for trades on the exchange ', Number, conf.defaults.fee)
        .option('--buy-pct <pct>', 'Set an initial buy  percentage based on you initial entry funds\nCan be adjusted/changed in the interactice console', Number, conf.defaults.buySellPct)
        .option('--sell-pct <pct>','Set an initial sell percentage based on you initial entry funds\nCan be adjusted/changed in the interactice console', Number, conf.defaults.buySellPct)
        .option('--paper-trade <name>', 'this flag dissables real trades from being executed on the exchange.\nuse this if you want to observe and test trading strategies', Boolean, conf.defaults.paperTrade)
        .option('--sell_stop_pct <pct>', 'sell if price drops below this % of bought price', Number, conf.sellStopPct)
        .option('--buy_stop_pct <pct>', 'buy if price surges above this % of sold price', Number, conf.buyStopPct)
        .option('--run_for <minutes>', 'Execute for a period of minutes then exit with status 0', String, null)
        .option('--manual', 'watch price and account balance, but do not perform trades automatically', Boolean, false)
        .action( (cmd,selector) => {
            console.log(` Not Implemented `)
        });
};