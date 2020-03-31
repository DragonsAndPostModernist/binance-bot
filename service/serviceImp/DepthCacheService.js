
const chalk = require("chalk");
const align = require('align-text');
const utils = require('../../lib/Utils');
const { Logger } = require('../../lib/Log');
const { ServiceInterface }  = require("./ServiceInterface")

class DepthCacheService extends ServiceInterface {
    constructor() {
        super();
    }
    execute( symbol, depth, binance){
        let bids = binance.sortBids(depth.bids);
        let asks = binance.sortAsks(depth.asks);

        asks = utils.objectToKeyValueArrays(asks);
        bids = utils.objectToKeyValueArrays(bids);
        let bidsVolume = align(bids.values);
        let asksVolume = align(asks.values);

        let buffer = [];
        for ( let i =0 ;i < 50 ;i++){
            buffer.push(`| ${chalk.yellow(asksVolume[i])}  ${chalk.red(Number(asks.keys[i]).toFixed(2))} - ${chalk.green(Number(bids.keys[i]).toFixed(2))}  ${chalk.yellow(bidsVolume[i])} |`)
        }
        console.clear();
        //          85.52433  38.88 - 38.87     5.42228
        Logger.orderBookHeader();
        console.log(buffer.join("\n"));
    }
}

module.exports = {
    DepthCacheService:DepthCacheService
};
