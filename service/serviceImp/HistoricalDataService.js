const chalk = require("chalk");
const align = require('align-text');
const utils = require('../../lib/Utils');
const { Logger } = require('../../lib/Log');
const { ServiceInterface } = require("./ServiceInterface");
const { Candlesticks } = require("../../model/Candlesticks");
const repository = require("../../repository/Repository"); 
const POLL_INTERVAL = 0;



class HistoricalDataService extends ServiceInterface{
    static getInstance(){
        return new HistoricalDataService();
    }
    constructor(){
        super();
        this.buffer = [];
        this.pollTime = 0;
        this.pollCount =0;
       
    }
    
    setPollTime( pollTime){
       this.pollTime = pollTime;
    }
    calculateNextCandle( lastFirstCandle, interval ){
        return utils.intervalMapper(interval, lastFirstCandle)
    }
    async execute( candles, interval, pair, binance ){
        if( !candles.length ){
            console.log("[ Error ]".red, "  Unable to pull Candles!".yellow)
            process.exit(0)
        }
        let endDate = this.calculateNextCandle(candles[0][0], interval)
       
        if( this.pollTime > POLL_INTERVAL ){
            if ( this.pollCount === 0 ) {
                console.log( "pushing candles" )
                this.buffer.push(...candles)
            }else{
                this.buffer.unshift(...candles)
            } 
            this.pollCount++;
            this.pollTime--;
            let ticks = await  binance.candlesticks(pair, interval, null,  { limit: 500, endTime:endDate })
            await this.execute( ticks, interval, pair, binance );
        }else{
            console.log( "=====>",this.pollTime, " POLL TIME ", POLL_INTERVAL  )
            let candleSticks = new Candlesticks( pair, this.buffer);
            let len = candleSticks.getCandles().candles.length;
            for (let index = 0; index < len; index++) {
                process.stdout.write(`${chalk.cyan("Data Fetched from exchange ....")}  ${chalk.yellow(`Processed ${chalk.green(index + 1 )} records.  ${chalk.red(candleSticks.getCandles().candles.length - (index +1) )} left to process`)}`+ '\r')
               
            }
            let possibleCandleSticks = await repository.getBy("candles", {symbol:pair })
            if( possibleCandleSticks  === null ){
              await repository.add("candles", candleSticks );
            }else{
                console.log( "updating")
                await repository.update("candles", { _id:possibleCandleSticks._id }, candleSticks);
                console.log( "updated")
                return true;
            }
        }
    }
}
module.exports = {
    HistoricalDataService:HistoricalDataService
}
