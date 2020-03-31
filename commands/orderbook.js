let { BinanceWrapper }   = require("../service/BinanceWrapper");
let { DepthCacheService} = require("../service/serviceImp/DepthCacheService");
module.exports =  (program, conf) =>{
     program
        .command('orderBook [selector]')
        .description('Stream a Maintained Order Book')
        .option('--currencyPair <name>', 'The Currency Pair to use', String, conf.defaults.currencyPair)
        .action( (cmd,selector) => {
            let binanceWrapper =  BinanceWrapper.getInstance();
            let depthCacheService = new DepthCacheService();
            binanceWrapper.websockets().orderBookChache(depthCacheService, selector.currencyPair)
        });

};
