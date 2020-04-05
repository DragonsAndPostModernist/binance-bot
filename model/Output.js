
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
          buffer.push(Number(params.profit).toFixed(4));
          buffer.push(Number(params.gainLoss).toFixed(4));
          let pricecolor = (params.price > params.lastPrice ) ? "green" : "red";
          let signalColor = (params.signal === "buy" ) ? "green" : "red";
          let colors  ={ price:pricecolor , change:pricecolor, signal:signalColor  }
          return { buffer, colors};
    }
    static formatTime(date){
        let dateString = date.toISOString();
        dateString = dateString.replace("T"," ")
        return dateString.split(".")[0];
    }
    constructor( strategyName, asset, currency ){
         this.renderCol = true;
         this.header = ["Time               ","Price","Change","Volume",strategyName,"Signal",asset,currency,"Profit","Gain Loss"];
         this.endTime = null;
         this.setIntervalTime();
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