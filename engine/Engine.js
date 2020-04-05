let chalk = require("chalk");
let { Candle }  = require("../model/Candle");
let { StrategyWrapper } = require("./StrategyWrapper");
let utils = require("../lib/Utils");
let  IndicatorService  = require("../../service/IndicatorService");
class Engine {


   constructor(socket =null, params, cbp ) {
       this.state = 'order.pending';
       this.target = null;
       this.cbp = cbp;
       this.socket = socket;
       this.params = params;
       this.strategyQueue = [];
       this.candles = [];
       this.candle = Candle.getCandle();
       this.repositioningInterval= null;
       this.exchangeServiceStream = null;
       this.orderPollInterval = null;
       this.isStopOrder = false;
       this.ticker = null;
       this.startTime = new Date();
       this.endTime   = new Date();
   }


   static debug(msg, type="**"){
   		console.log(`[ ${chalk.green(` AI ENGINE`)} :: ${chalk.yellow(type)} ]`);
   		console.log(msg);
   }

   static info(msg, type="**"){
		console.log(`[ ${chalk.cyan(` AI ENGINE`)} :: ${chalk.yellow(type)} ]`);
		console.log(msg);
   }
   
   static warning(msg, type="**"){
		console.log(`[ ${chalk.orange(` AI ENGINE`)} :: ${chalk.yellow(type)} ]`);
		console.log(msg);
   }
   
   static error(msg, type="**"){
		console.log(`[ ${chalk.red(` AI ENGINE`)} :: ${chalk.yellow(type)} ]`);
		console.log(error)
   }

   async calculateApproxProfitTarget ( ticker ){

        while (true) {
        	let paidPrice =Number(this.params.entry);
	        let qty = Number(this.params.order.size);
	        let fee= (paidPrice / 100)  *  Number(this.params.fee);
	        paidPrice = (paidPrice - fee);
	        let profit = (qty * (Number(ticker)));
	        let totalFee = ( profit / 100)  * Number(this.params.fee) ;
	        let profitMargin = Math.abs( (paidPrice ) - (profit) );
	       
	        if(profitMargin > (Number(this.params.target) + fee )){
	        	AIEngine.info(`estimated target Price: ${chalk.green(ticker)}` ,'calculating profit target');
	            this.target = ticker;
	            return false;
	        }else{
	        	AIEngine.info(`estimated target Price: ${chalk.green(ticker)}` ,'calculating profit target')
	            if (this.params.order.side === 'buy') {
	                if(ticker < 100 ){
	                	ticker = ticker + 1
	                }else{
	                	ticker = ticker + 10
	                }
	            }
	            else {
	            	 if(ticker < 100 ){
	                	ticker = ticker - 1
	                }else{
	                	ticker = ticker - 10
	                }
	                ticker = ticker - 10
	            }
	            await utils.sleepy(100);
	         
	        }
        }
    }

    async getStrategyMapping( key ){
       await this.calculateApproxProfitTarget(Number(this.params.order.price));
       let map = {
           macd: () =>{},
           obv: () =>{},
           kst:() =>{},
           mfi:() =>{},
           trend:() =>{},
           rsi:() =>{},
           atr:() =>{},
           williamsR:() =>{},
           bollinger:() =>{},
           ema4:() =>{},
           ema3:() =>{},
           simpleMa:() =>{},
           pivotRetracement:() =>{},
           floorPivots:() =>{},
           woodies:() =>{},
           gambleRSI:() =>{},
           threeBarPlay:() =>{},
           bruteForce: new StrategyWrapper(null, (data, candles)=>{
                   AIEngine.info(`target Price: ${ chalk.red(this.target)}  ticker price: ${chalk.green(data.price)}` , 'evaluating trade position')
                   return Number(this.target) < Number(data.price );
           })
       };
       return map[key];
   }
   onError(error){
       AIEngine.error(error, 'Fartal Engine Error .. shutting down ')
       process.exit(1)
   }
   addStrategies(strategies){
      strategies.forEach( strategy =>  this.strategyQueue.push(strategy));
   }

   setRepositioningInterval(interval){
          this.repositioningInterval = interval;
          this.endTime.setMinutes(this.endTime.getMinutes() + (interval / 60));
          return this;
   }

   setExchangeServiceStream(service){
       this.exchangeServiceStream = service;
       return this;
   }

   addStrategy(strategy){
        this.strategyQueue.push(strategy);
   }

    pollerMock(){
       AIEngine.info(`side::${this.params.order.side},  ticker@::${ chalk.green(Number(this.ticker.price))}, entry@::${chalk.red( Number(this.params.order.price))}` , 'Data polling')
       if(this.params.order.side.toLowerCase() === 'buy'){
           if( Number(this.params.order.price) >= Number(this.ticker.price)){
               this.state = 'order.filled';
                AIEngine.info(`${ chalk.magenta('liveMode')}::${this.params.live}` , 'Order Filled')
           }
       }else{
         
           if( Number(this.params.order.price) <= Number(this.ticker.price)){
               this.state = 'order.filled';
                AIEngine.info(`${ chalk.magenta('liveMode')}::${this.params.live}` , 'Order Filled')
           }
       }
   }
   async poller(){
       let openOrders = await this.cbp.listOrders(this.params.pair);
       if(!openOrders.length > 0){
           clearInterval(this.orderPollInterval);
           this.state = 'order.filled';
       }
   }

   async run(data){
       this.ticker = data;
       if( this.state === 'order.pending' ) {
           // post the order here
           let order = (this.params.live) ? await this.cbp.placeOrder(this.params.order) : this.params.order;
           AIEngine.info(`${ chalk.magenta('liveMode')}::${this.params.live}` , 'Order Placed')
           AIEngine.info(order, 'Order Details');
           this.state = 'order.polling';
           // pullOrder api until its filled ?
           if (this.params.live) {
               this.orderPollInterval = setInterval(this.poller.bind(this), 1000);
           } else {
             this.pollerMock();
           }
       }
       if( this.startTime.getTime() < this.endTime.getTime()){
           this.candle.updateCandle(data);
       }else{
           this.candles.push(JSON.parse(JSON.stringify(this.candle.close(Number(data.price), Number(data.last_size)))));
           this.candle = Candle.getCandle();
           this.candle.updateCandle(data);
           if(this.candles.length > 2000){
                this.candles.shift();
           }
           this.setRepositioningInterval(this.repositioningInterval)
       }
       if(this.state === 'order.polling'){
           if (this.params.live) {
               this.orderPollInterval = setInterval(this.poller.bind(this), 1000);
           } else {
               this.pollerMock();
           }
       }
       if(this.state === 'order.filled' ){
           let length = this.strategyQueue.length;
           let exitTrade = false;
           for (let i = 0; i < length ; i++) {
           	   AIEngine.debug(this.strategyQueue[i].onExecute(data, this.candles), 'STRATEGY QUEU£')
               if( this.strategyQueue[i].onExecute(data, this.candles)){
               	   exitTrade = true;
                   let reEntrySide = (this.params.order.side === 'buy' ) ? 'sell' : 'buy';
                   AIEngine.info(`Recalculating ${reEntrySide} re entry parameters` , 'Trade conditions satisfactory')
                   AIEngine.info(`current ticker : ${this.ticker}` , 'Analyzing best Limit Order Rentry entrance')
               }else{
               	exitTrade = false
               }
           }
           if(exitTrade){
           	this.state =  this.state = 'order.reEntry';
           }
       }
       if(this.state === 'order.reEntry' ){
       	   let reEntrySide = (this.params.order.side === 'buy' ) ? 'sell' : 'buy';
           AIEngine.info(`Re Entry  : ${reEntrySide}` , 'Analyzing Floor Pivots');
           let woodies =   IndicatorService['woodies'](this.params.interval, socket, this.params.pair);
       }

   }


}


module.exports = {
	Engine:Engine,
}