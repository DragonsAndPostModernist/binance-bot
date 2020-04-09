
let chalk = require("chalk")
let colors = require("colors")
class Interaction{
    static initialize(){
        return new Interaction();
    }
    constructor(){
    this.keyMap = new Map()
    this.keyMap.set('b)'.yellow, 'limit'.grey + ' BUY'.green)
    this.keyMap.set('B)'.yellow, 'market'.grey + ' BUY'.green)
    this.keyMap.set('s)'.yellow, 'limit'.grey + ' SELL'.red)
    this.keyMap.set('S)'.yellow, 'market'.grey + ' SELL'.red)
    this.keyMap.set('c)'.yellow, 'cancel order'.grey)
    this.keyMap.set('m)'.yellow, 'toggle MANUAL trade in LIVE mode ON / OFF'.grey)
    this.keyMap.set('P)'.yellow, 'print previous Trades for this currencyPair'.grey)
    this.keyMap.set('X)'.yellow, 'exit program'.grey)
    this.keyMap.set('L)'.yellow, 'place a stop order ( Determines buy/sell via last executed trade )'.grey)
    this.keyMap.set('X)'.yellow, 'exit program'.grey)

    this.keyMap.set('T)'.yellow, 'Show all Trades'.grey)
   }
   
  
   static getWelcomeHeader(){
       return `${chalk.grey("*************")}  ${chalk.yellow("Thanks for using Binance Bot  ")}  ${chalk.grey("press l")}  ${chalk.yellow("to see available commands")}  ${chalk.grey("*************")}`
   }

   listKeys() {
     console.log('\nAvailable command keys:')
     this.keyMap.forEach((value, key) => {
       console.log(' ' + key + ' - ' + value)
     })
   }
}

module.exports  ={
    Interaction:Interaction
}
