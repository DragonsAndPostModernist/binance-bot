
const columnify = require('columnify');
const color = require("chalk");
const utils = require("../lib/Utils");
const MAX = 20;
class Output {
    static getInstance(){
        return new Output();
    }

    static formatTime(date){
        let dateString = date.toISOString();
        dateString = dateString.replace("T"," ")
        return dateString.split(".")[0];
    }
    constructor(){
         this.renderCol = true;
         this.header = ["Time               ","Price","Change","Volume","RSI","Signal","LTC","EUR","Profit","Gain Loss"];
    }

    getHeader(){
        return this.header;
    }

    formatArray( arr ){
         return utils.stringFormatterAlign(arr);
    }

    writeToStdOut(instance){
       return columnify( instance , {
           minWidth: 15,
           config: {
               description: {maxWidth: 20}
           }
       })
    }

    /*

    *
    * */
}

let test = () =>{
     let outPut = Output.getInstance();
     let testArray = [Output.formatTime(new Date()), "39.97","↑ 00.37","2.567",49.00, "Buy","2.9000","100.00","+ 2.00", "+ 2.00" ];
     // let obj =[ {
     //     Time: color.grey(Output.formatTime(new Date())),
     //     "Current Price": color.yellow(Number("39.97").toFixed(2)),
     //     Change:color.green("↑ 00.37"),
     //     Volume:color.magenta("2.567"),
     //     RSI:color.yellow("49.00"),
     //     Signal:color.green("Buy"),
     //     "Balance(Asset)":color.bgBlackBright("2.9000 LTC"),
     //     "Balance(Currency)":color.bgBlackBright("100.00 EUR"),
     //     Profit:color.green("+ 2.00"),
     //     "Gain Loss":color.green("+ 200")
     // }];

     testArray = utils.stringFormatterAlignStart(testArray);
     let header = utils.stringFormatterAlignColumns(outPut.getHeader(), testArray);
     console.log(color.grey(header.join(" ")));
     setInterval(()=>{
         console.log(testArray.join(""))
     }, 500);
};

test();
