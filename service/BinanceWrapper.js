const Binance = require('node-binance-api');
class BinanceWrapper {

    static getInstance(){
        return new BinanceWrapper();
    }

     privateApi( keys ){
        return {
            buyLimit:async ( pair, qty, price ) =>{
                return new Promise((resolve, reject)=>{
                    const binance = new Binance({
                        APIKEY: keys.key,
                        APISECRET: keys.secret
                    });
                    binance.useServerTime(function() {
                        binance.buy( pair, qty,price, (error, response) => {
                            if ( error ) {
                                console.error(error);
                                process.exit(1);
                            }
                            resolve({ status:0, result:response, error:null })
                        });
                    });
                });
            },
            sellLimit:async (pair, qty, price) =>{
                return new Promise((resolve, reject)=>{
                    const binance = new Binance({
                        APIKEY: keys.key,
                        APISECRET: keys.secret
                    });
                    binance.useServerTime(function() {
                        binance.sell( pair, qty,price, (error, response) => {
                            if ( error ) {
                                console.error(error);
                                process.exit(1);
                            }
                            resolve({ status:0, result:response, error:null })
                        });
                    });
                });
            },
            buyMarket:async ( pair, qty) =>{
                return new Promise((resolve, reject)=>{
                    const binance = new Binance({
                        APIKEY: keys.key,
                        APISECRET: keys.secret
                    });
                    binance.useServerTime(function() {
                        binance.marketBuy( pair, qty, (error, response) => {
                            if ( error ) {
                                console.error(error);
                                process.exit(1);
                            }
                            resolve({ status:0, result:response, error:null })
                        });
                    });
                });
            },
            sellMarket:async ( pair, qty) =>{
                return new Promise((resolve, reject)=>{
                    const binance = new Binance({
                        APIKEY: keys.key,
                        APISECRET: keys.secret
                    });
                    binance.useServerTime(function() {
                        binance.marketSell( pair, qty, (error, response) => {
                            if ( error ) {
                                console.error(error);
                                process.exit(1);
                            }
                            resolve({ status:0, result:response, error:null })
                        });
                    });
                });
            },
            buyStop:async (pair, price, qty, stopParams) =>{
                return new Promise((resolve, reject)=>{
                    const binance = new Binance({
                        APIKEY: keys.key,
                        APISECRET: keys.secret
                    });
                    binance.useServerTime(function() {
                        binance.buy( pair, qty,price,{stopPrice: stopParams.stopPrice, type: stopParams.type}, (error, response) => {
                            if ( error ) {
                                console.error(error);
                                process.exit(1);
                            }
                            resolve({ status:0, result:response, error:null })
                        });
                    });
                });
            },
            sellStop:async ( pair, price, qty, stopParams ) =>{
                return new Promise((resolve, reject)=>{
                    const binance = new Binance({
                        APIKEY: keys.key,
                        APISECRET: keys.secret
                    });
                    binance.useServerTime(function() {
                        binance.sell( pair, qty,price,{stopPrice: stopParams.stopPrice, type: stopParams.type}, (error, response) => {
                            if ( error ) {
                                console.error(error);
                                process.exit(1);
                            }
                            resolve({ status:0, result:response, error:null })
                        });
                    });
                });
            },
            cancelOrderById:async (pair, orderId)=>{
                return await privateClient.cancel(pair, orderId);
            },
            cancelOrders:async( pair )=>{
                return await privateClient.cancel(pair);
            },
            orders:async( pair = null )=>{
                return new Promise((resolve, reject)=>{
                    const binance = new Binance({
                        APIKEY: keys.key,
                        APISECRET: keys.secret
                    });
                    binance.useServerTime(function() {
                        binance.openOrders( pair, (error, trades, pair) => {
                            if ( error ) {
                                console.error(error);
                                process.exit(1);
                            }
                            resolve({ status:0, result:trades, error:null })
                        });
                    });
                });
            },
            orderStatus:async(pair, orderId)=>{
                return new Promise((resolve, reject)=>{
                    const binance = new Binance({
                        APIKEY: keys.key,
                        APISECRET: keys.secret
                    });
                    binance.useServerTime(function() {
                        binance.orderStatus(pair, orderId, (error, response) => {
                            if ( error ) {
                                console.error(error);
                                process.exit(1);
                            }
                            resolve({ status:0, result:response, error:null })
                        });
                    });
                });
            },
            trades:( pair )=>{

                return new Promise((resolve, reject)=>{
                    const binance = new Binance({
                        APIKEY: keys.key,
                        APISECRET: keys.secret
                    });
                    binance.useServerTime(function() {
                        binance.trades( pair, (error, trades) => {
                            if ( error ) {
                                console.error(error);
                                process.exit(1);
                            }
                            resolve({ status:0, result:trades, error:null })
                        });
                    });
                });
            },
            allOrders:async( pair )=>{
                return new Promise((resolve, reject)=>{
                    const binance = new Binance({
                        APIKEY: keys.key,
                        APISECRET: keys.secret
                    });
                    binance.useServerTime(function() {
                        binance.allOrders( pair, (error, orders) => {
                            if ( error ) {
                                console.error(error);
                                process.exit(1);
                            }
                            resolve({ status:0, result:orders, error:null })
                        });
                    });
                });
            },
            getDepositAddress:async(pair)=>{
                return await privateClient.depositAddress( pair );
            },
            getDepositHistory:async( pair = null )=>{
                return new Promise((resolve, reject)=>{
                    const binance = new Binance({
                        APIKEY: keys.key,
                        APISECRET: keys.secret
                    });
                    binance.useServerTime(function() {
                        binance.depositHistory( (error, history ) => {
                            if ( error ) {
                                console.error(error);
                                process.exit(1);
                            }
                            resolve({ status:0, result:history, error:null })
                        });
                    });
                });
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
                return new Promise((resolve, reject)=>{
                    this.binance.candlesticks(pair, interval, async (error, ticks, symbol) => {
                        if( error ){
                            console.log("[ Error ]".red, error)
                            process.exit(0)
                        }
                        let response = await service.execute( ticks, interval, pair, this.binance );
                        resolve( response )
                    }, { limit: 500 });
                })
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
                this.binance.websockets.prevDay(pair, ( error, response ) => {
                    service.execute( response );
                });
            },
            getSocket:()=>{
                return this.binance.websockets;
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
