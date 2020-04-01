const Binance = require('node-binance-api');

class BinanceWrapper {

    static getInstance(){
        return new BinanceWrapper();
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

            candles:( service, pairs, interval ) => {
                this.binance.websockets.candlesticks( pairs, interval, ( candlesticks ) => {
                    service.execute(	symbol, interval, chart	);
                });
            },

            ticker:( service, pairs) =>{q
                this.binance.websockets.trades( pairs, ( trades ) => {
                    service.execute(	trades	);
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
            }
        }
    }

    constructor(){
        this.binance = new Binance();
    }

}

module.exports = {
    BinanceWrapper:BinanceWrapper
}
