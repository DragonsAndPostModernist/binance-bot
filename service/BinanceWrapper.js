const Binance = require('node-binance-api');
class BinanceWrapper {

    static getInstance(){
        return new BinanceWrapper();
    }

     privateApi( keys ){
        return {
            buyLimit:async ( pair, qty, price ) =>{
                return await privateClient.buy(pair, qty, price);
            },
            sellLimit:async (pair, qty, price) =>{
                return await privateClient.sell(pair, qty, price);
            },
            buyMarket:async ( pair, qty) =>{
                return await privateClient(pair, qty);
            },
            sellMarket:async ( pair, qty) =>{
                return await privateClient.marketBuy(pair, qty);
            },
            buyStop:async (pair, price, qty, stopParams) =>{
                // {stopPrice: stopPrice, type: type}
                return await privateClient.buy(pair, qty, price, stopParams );
            },
            sellStop:async ( pair, price, qty, stopParams ) =>{
                return await privateClient.sell(pair, qty, price, stopParams);
            },
            cancelOrderById:async (pair, orderId)=>{
                return await privateClient.cancel(pair, orderId);
            },
            cancelOrders:async( pair )=>{
                return await privateClient.cancel(pair);
            },
            orders:async( pair = null )=>{
                return await privateClient.openOrders( pair );
            },
            orderStatus:async(orderId)=>{
                return await privateClient.orderStatus( orderId );
            },
            trades:async( pair )=>{
                let privateClient = await this.privateClient( keys );
                return await privateClient.trades( pair );
            },
            allOrders:async( pair )=>{
                return await privateClient.allOrders( pair );
            },
            getDepositAddress:async(pair)=>{
                return await privateClient.depositAddress( pair );
            },
            getDepositHistory:async( pair = null )=>{
                return await privateClient.depositHistory( pair );
            },

            withdraw:async( pair, address, amount, addressTag =null ) =>{
                return await privateClient.withdraw(pair, address, amount, addressTag);
            }
        }
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

    async privateClient(keys){
        return new Binance({
            APIKEY: keys.key,
            APISECRET: keys.secret
        });
    }
    constructor(){
        this.binance = new Binance();
    }

}

module.exports = {
    BinanceWrapper:BinanceWrapper
}
