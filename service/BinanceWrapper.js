const Binance = require('node-binance-api');

class BinanceWrapper {

    static getInstance(){
        return new BinanceWrapper();
    }

    publicAPI(){
        return {
            candles:( service, pair, interval )=>{
                // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
                 this.binance.candlesticks(pair, interval, (error, ticks, symbol) => {
                     service.execute( ticks, interval, pair, this.binance );
                 }, { limit: 500 });
             }
        }
    }
    websockets( ){
        return {
            orderBook:( service, pairs ) => {
                this.binance.websockets.depth(pairs, ( depth) => {
                    service.execute(depth);
                });
            },

            orderBookChache:( service, pairs ) => {
                this.binance.websockets.depthCache(pairs, (symbol, depth) => {
                    service.execute(symbol, depth, this.binance );
                });
            },
            chart:( pair, interval )=>{
                this.binance.websockets.chart(pair, interval, (symbol, interval, chart) => {
                    service.execute(	symbol, interval, chart	);
                });
            },

            candles: async ( service, pairs, interval ) => {
                return this.binance.websockets.candlesticks( pairs, interval, ( candlesticks ) => {
                    return service.execute(candlesticks, interval, pair, this.binance );
                });
            },

            ticker:( service, pairs) =>{
                this.binance.websockets.trades( pairs, ( trades ) => {
                    service.execute(	trades 	 );
                });
            },
            markets:( service ) => {
                this.binance.websockets.miniTicker(markets => {
                    service.execute( service );
                });
            },
            get24HrStats:( pair =false )=>{
                binance.websockets.prevDay(pair, ( error, response ) => {
                    service.execute( response );
                });
            },
        }
    }

    constructor(){
        this.binance = new Binance();
    }

}

module.exports = {
    BinanceWrapper:BinanceWrapper
}
