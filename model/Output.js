
const columnify = require('columnify');
const color = require("chalk");
const utils = require("../lib/Utils");
const MAX = 20;
class Output {
    static getInstance(){
        return new Output();
    }

    static createOutputBuffer( params ){
          let buffer = [];
          buffer.push(Output.formatTime(new Date(params.time)));  
         
          buffer.push( (params.price > params.lastPrice ) ? "↑ "+Number(params.price).toFixed(2) : "↓ "+Number(params.price).toFixed(2) );
          if( params.lastPrice === 0){ 
            buffer.push( "+ 0.00" );
          } 
          else{
              buffer.push( (params.price > params.lastPrice ) ? "+ "+Math.abs(params.price - params.lastPrice).toFixed(2) : "- "+Math.abs(params.price - params.lastPrice).toFixed(2) );
          }
          buffer.push(Number(params.volume).toFixed(6));
          buffer.push((Number(params.rsi)));
          buffer.push( (params.signal !== null ) ? params.signal : "");
          buffer.push( params.asset)
          buffer.push( params.currency)
          buffer.push( params.entry)

          buffer.push((params.profit.isProfit ) ? "↑ "+Number(params.profit.assetPrice).toFixed(2) : "↓ "+Number(params.profit.assetPrice).toFixed(2));
          buffer.push((params.profit.isProfit ) ? "↑ "+Number(params.profit.diff).toFixed(2) : "↓ "+Number(params.profit.diff).toFixed(2));
          
          let pricecolor = (params.price > params.lastPrice ) ? "green" : "red";
          let signalColor = (params.signal.toLowerCase() === "buy" ) ? "green" : "red";
          let profitColor = (params.profit.isProfit ) ? "green" : "red"
          let colors  ={ price:pricecolor , change:pricecolor, signal:signalColor,profit:profitColor  }
          return { buffer, colors};
    }
    static formatTime(date){
        let dateString = date.toISOString();
        dateString = dateString.replace("T"," ")
        return dateString.split(".")[0];
    }
    constructor( strategyName, asset, currency ){
         this.renderCol = true;
         this.header = ["Time               ","Price","Change","Volume",strategyName,"Signal",asset,currency,"Funds","Profit","Gain Loss"];
         this.endTime = null;
         this.setIntervalTime();
    }

    printNoKeysMessage(){
        console.log("  No Api Keys detected !!!!".red +"  please run add-keys command first and set up api keys  ".yellow)
    }
    printTradeOptios(buffer){
       Object.keys(buffer).forEach( key => console.log(` ${key.yellow}      ${buffer[key].blue}`))
    }

    printOrder( order ){

        let buffer = [];
        buffer.push(
            "\n",
            "Symbol                : ".cyan+order.symbol.blue,
            "ID                    : ".cyan+order.orderId.toString().red,
            "Price                 : ".cyan+order.price.toString().green,
            "Original QTY          : ".cyan+order.origQty.toString().yellow,
            "Executed QTY          : ".cyan+order.executedQty.toString().yellow,
            "Cummulative Quote Qty : ".cyan+order.cummulativeQuoteQty.toString().yellow,
            "Status                : ".cyan+order.status.cyan,
            "Time in Force         : ".cyan+order.timeInForce.yellow,
            "Type                  : ".cyan+order.type.green,
            "Side                  : ".cyan+order.side.grey,
            "Stop Price            : ".cyan+order.stopPrice.toString().blue,
            "Time                  : ".cyan+order.time.toString().grey,
            "Updated At            : ".cyan+order.updateTime.toString().cyan
        );
        console.log("\n"+buffer.join("\n"))

    }
    printTrades( trades ){
        let buffer = [];

        trades.forEach(trade => {
                let type = "BUY ".green;
                if(!trade.isBuyer){
                    type ="SELL".red
                }
                if(trade.commissionAsset.length < 4){
                    trade.commissionAsset = trade.commissionAsset+" ";
                }
                buffer.push(
                    [
                        "Symbol   : ".cyan+ trade.symbol.yellow,
                        "   ID    : ".cyan+ trade.orderId.toString().cyan,
                        "   Buy   : ".cyan + type ,
                        "   Price : ".cyan+ Number(trade.price).toFixed(2).yellow,
                        "   Qty   : ".cyan+ Number(trade.qty).toFixed(8).blue,
                        "   Fee   : ".cyan+ Number(trade.commission).toFixed(8).red + " " + trade.commissionAsset.yellow,
                        "   Time  : ".cyan+ new Date(trade.time).toISOString().grey
                    ]
                )
            }
        );
        buffer.forEach(entry => console.log(entry.join(" ")))
        console.log("\n")
    }
    setIntervalTime(){
         let date = new Date();
         this.endTime = new Date();
         this.endTime.setMinutes( date.getMinutes() + 1);
    }

    getHeader(){
        return this.header;
    }

    formatArray( arr ){
         return utils.stringFormatterAlign(arr);
    }

    writeToStdOut(logInstance ,printHeader = true){
        let buff = utils.stringFormatterAlignStart(logInstance.buffer);
        let date = new Date();
        //console.log(buff)
        //  let colors  ={ price:pricecolor , change:pricecolor, signal:signalColor  }
        // ["Time               ","Price","Change","Volume","RSI","Signal",asset,currency,"Profit","Gain Loss"];
        buff[0] = color.grey(buff[0]);
        buff[1] = color[logInstance.colors.price](buff[1]); 
        buff[2] = color[logInstance.colors.change](buff[2]); 
        buff[5] = color[logInstance.colors.signal](buff[5]); 
        buff[9] = color[logInstance.colors.profit](buff[9]); 
        buff[10] = color[logInstance.colors.profit](buff[10]); 
        let header = utils.stringFormatterAlignColumns(this.getHeader(), buff);
        if ( printHeader ) { console.log(color.grey(header.join(" ")));}
       
        if( date.getTime() > this.endTime.getTime()){
            console.log( buff.join(" ") );
            this.setIntervalTime();
        }else{
            process.stdout.write(buff.join(" ") + '\r'); 
        }
    }
}


module.exports = {
    Output:Output
}
