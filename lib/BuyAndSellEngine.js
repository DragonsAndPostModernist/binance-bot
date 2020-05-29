
const chalk = require("chalk");
const utils = require('./Utils');
const { Logger } = require('./Log');
const models = require("../model/models.json");
const FILLED = "FILLED";
const BUY = "BUY"
const SELL = "SELL"
const STOP_LOSS_LIMIT = "STOP_LOSS_LIMIT";
class BuyAndSellEngine  {
    constructor( binance, isLive = true, app  ) {
        this.binance = binance;
        this.app = app;
        this.isLive = isLive;
        this.order = null;

    }

    async executeBuySignal( qty, pair, price ){
         if(!this.isLive){ this.executeMockOrder("executeBuySignal", qty, pair, price) }
         // make sure to assing order returned in a live call
    }
    async executeSellSignal(qty, pair, price){
        if(!this.isLive){ this.executeMockOrder("executeSellSignal", qty, pair, price) }
    }
    
    async executeLimitBuyOrder(pair, qty, price){
        if(!this.isLive){ this.executeMockOrder("executeLimitBuyOrder", qty, pair, price) }
    }
    async executeLimitSellOrder(pair, qty, price){
        if(!this.isLive){ this.executeMockOrder("executeLimitSellOrder", qty, pair, price) }
    }

    async executeStopLimitBuyOrder(pair, qty, price, stopParams){
        if(!this.isLive){ this.executeMockOrder("executeStopLimitBuyOrder", qty, pair, price, stopParams) }
    }
    async executeStopLimitSellOrder(pair, qty, price, stopParams){
        if(!this.isLive){ this.executeMockOrder("executeStopLimitSellOrder", qty, pair, price, stopParams) }
    }

    getOrder(){
        return this.order;
    }
    evaluateStopBuyEntry(price ) {
        return price >= this.order.stopPrice;
    }
    evaluateStopSellEntry(price) {
        return price <= this.order.stopPrice;
    }
    evaluateLimitBuyEntry(price) {
        return price <= this.order.price;
    }
    evaluateLimitSellEntry(price){
        return price >= this.order.price;
    }

    async orderPoll( currencyPair, orderId, price ){
        if(!this.isLive){
            if( this.order.side === BUY ) {
                let status =  ( this.order.type === 'STOP_LOSS_LIMIT' ) ? this.evaluateStopBuyEntry( price ) : this.evaluateLimitBuyEntry( price );
                return { order:this.order , filled: status };
            }
            else{
                let status = ( this.order.type === 'STOP_LOSS_LIMIT' ) ? this.evaluateStopSellEntry( price ) : this.evaluateLimitSellEntry( price );
                return { order:this.order , filled:status };
            }     
        }else{
            let order = this.binance.privateApi(this.app.keys).orderStatus( currencyPair, orderId )
            return { order:order , filled: ( order.result.status === FILLED)};
        }
        
    }

    async cancelOrder( pair ){
        if(!this.isLive){
            delete this.order;
        }else{
            // await this.binance.privateApi(this.app.keys).cancelOrder(pair, this.order.orderId );

        }
    }
    executeMockOrder(event, qty, pair, price, stopParams){
          switch( event ){
              case "executeBuySignal"          : { 
                    this.order = models.mockOrder;
                    this.order.symbol= pair,
                    this.order.orderId= 503186179,
                    this.order.orderListId= -1,
                    this.order.clientOrderId= 'and_a599904f818d4b649bb142467cfee116',
                    this.order.price= price,
                    this.order.origQty= qty,
                    this.order.executedQty= qty,
                    this.order.cummulativeQuoteQty= ( Number( price ) * Number( qty )),
                    this.order.status= "FILLED",
                    this.order.timeInForce= 'GTC',
                    this.order.type= "MARKET",
                    this.order.side= BUY,
                    this.order.stopPrice= '0.00000000',
                    this.order.icebergQty= '0.00000000',
                    this.order.time= new Date(),
                    this.order.updateTime= new Date(),
                    this.order.isWorking= true,
                    this.order.origQuoteOrderQty= '0.00000000'
                }; break;
              case "executeSellSignal"         : { 
                    this.order = models.mockOrder;
                    this.order.symbol= pair,
                    this.order.orderId= 503186179,
                    this.order.orderListId= -1,
                    this.order.clientOrderId= 'and_a599904f818d4b649bb142467cfee116',
                    this.order.price= price,
                    this.order.origQty= qty,
                    this.order.executedQty= qty,
                    this.order.cummulativeQuoteQty= ( Number( price ) * Number( qty )),
                    this.order.status= "FILLED",
                    this.order.timeInForce= 'GTC',
                    this.order.type= "MARKET",
                    this.order.side= SELL,
                    this.order.stopPrice= '0.00000000',
                    this.order.icebergQty= '0.00000000',
                    this.order.time= new Date(),
                    this.order.updateTime= new Date(),
                    this.order.isWorking= true,
                    this.order.origQuoteOrderQty= '0.00000000'
                }; break;
              case "executeLimitBuyOrder"      : { 
                    this.order = models.mockOrder;
                    this.order.symbol= pair,
                    this.order.orderId= 503186179,
                    this.order.orderListId= -1,
                    this.order.clientOrderId= 'and_a599904f818d4b649bb142467cfee116',
                    this.order.price= price,
                    this.order.origQty= qty,
                    this.order.executedQty= qty,
                    this.order.cummulativeQuoteQty= ( Number( price ) * Number( qty )),
                    this.order.status= "FILLED",
                    this.order.timeInForce= 'GTC',
                    this.order.type= "LIMIT",
                    this.order.side= BUY,
                    this.order.stopPrice= '0.00000000',
                    this.order.icebergQty= '0.00000000',
                    this.order.time= new Date(),
                    this.order.updateTime= new Date(),
                    this.order.isWorking= true,
                    this.order.origQuoteOrderQty= '0.00000000'
                }; break;
              case "executeLimitSellOrder"     : { 
                    this.order = models.mockOrder;
                    this.order.symbol= pair,
                    this.order.orderId= 503186179,
                    this.order.orderListId= -1,
                    this.order.clientOrderId= 'and_a599904f818d4b649bb142467cfee116',
                    this.order.price= price,
                    this.order.origQty= qty,
                    this.order.executedQty= qty,
                    this.order.cummulativeQuoteQty= ( Number( price ) * Number( qty )),
                    this.order.status= "FILLED",
                    this.order.timeInForce= 'GTC',
                    this.order.type= "LIMIT",
                    this.order.side= SELL,
                    this.order.stopPrice= '0.00000000',
                    this.order.icebergQty= '0.00000000',
                    this.order.time= new Date(),
                    this.order.updateTime= new Date(),
                    this.order.isWorking= true,
                    this.order.origQuoteOrderQty= '0.00000000'
                }; break;
              case "executeStopLimitBuyOrder"  : { 
                    this.order = models.mockOrder;
                    this.order.symbol= pair,
                    this.order.orderId= 503186179,
                    this.order.orderListId= -1,
                    this.order.clientOrderId= 'and_a599904f818d4b649bb142467cfee116',
                    this.order.price= price,
                    this.order.origQty= qty,
                    this.order.executedQty= qty,
                    this.order.cummulativeQuoteQty= ( Number( price ) * Number( qty )),
                    this.order.status= FILLED,
                    this.order.timeInForce= 'GTC',
                    this.order.type= STOP_LOSS_LIMIT,
                    this.order.side= BUY,
                    this.order.stopPrice= stopParams.stopPrice,
                    this.order.icebergQty= '0.00000000',
                    this.order.time= new Date(),
                    this.order.updateTime= new Date(),
                    this.order.isWorking= true,
                    this.order.origQuoteOrderQty= '0.00000000' 
                }; break;
              case "executeStopLimitSellOrder" : { 
                    this.order = models.mockOrder;
                    this.order.symbol= pair,
                    this.order.orderId= 503186179,
                    this.order.orderListId= -1,
                    this.order.clientOrderId= 'and_a599904f818d4b649bb142467cfee116',
                    this.order.price= price,
                    this.order.origQty= qty,
                    this.order.executedQty= qty,
                    this.order.cummulativeQuoteQty= ( Number( price ) * Number( qty )),
                    this.order.status= FILLED,
                    this.order.timeInForce= 'GTC',
                    this.order.type= STOP_LOSS_LIMIT,
                    this.order.side= SELL,
                    this.order.stopPrice= stopParams.stopPrice,
                    this.order.icebergQty= '0.00000000',
                    this.order.time= new Date(),
                    this.order.updateTime= new Date(),
                    this.order.isWorking= true,
                    this.order.origQuoteOrderQty= '0.00000000' 
                }; break;
          }


    }

}

module.exports = {
    BuyAndSellEngine:BuyAndSellEngine
};
