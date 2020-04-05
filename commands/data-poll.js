let { BinanceWrapper }   = require("../service/BinanceWrapper");
let { HistoricalDataService } = require('../service/serviceImp/HistoricalDataService');
let color = require("chalk");

module.exports =  (program, conf) =>{
    program
        .command('data-poll [selector]')
        .description('Fetch and Store historic data from the exchange')
        .option('--currencyPair <name>', 'The Currency Pair to use', String, conf.defaults.currencyPair)
        .option('--interval <name>', 'The Candles interval rate default:30m.\nIntervals: 1m 3m 5m 15m 30m 1h 2h 4h 6h 8h 12h 1d 3d 1w 1M ', String, conf.defaults.interval)
        .action( (cmd,selector) => {
            let binanceWrapper =  BinanceWrapper.getInstance();
            let historicalDataService = HistoricalDataService.getInstance();
            console.clear();
            console.log(`${color.cyan("Fetching  Historical Data from Exchange ")}`)
            binanceWrapper.publicAPI().candles(historicalDataService, selector.currencyPair, selector.interval)
        });
};
