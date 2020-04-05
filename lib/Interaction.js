
let chalk = require("chalk")

class Interaction{
    static initialize(){
        return new Interaction();
    }
    constructor(){
    this.keyMap = new Map()
    this.keyMap.set('b', 'limit' + ' BUY')
    this.keyMap.set('B', 'market' + ' BUY')
    this.keyMap.set('s', 'limit' + ' SELL')
    this.keyMap.set('S', 'market' + ' SELL')
    this.keyMap.set('c', 'cancel order')
    this.keyMap.set('m', 'toggle MANUAL trade in LIVE mode ON / OFF')
    this.keyMap.set('T', 'switch to \'Taker\' order type')
    this.keyMap.set('M', 'switch to \'Maker\' order type')
    this.keyMap.set('o', 'show current trade options')
    this.keyMap.set('O', 'show current trade options in a dirty view (full list)'.grey)
    this.keyMap.set('L', 'toggle DEBUG')
    this.keyMap.set('P', 'print statistical output')
    this.keyMap.set('X', 'exit program')
    this.keyMap.set('d', 'dump statistical output to HTML file')
    this.keyMap.set('D', 'toggle automatic HTML dump to file')
   }
   
  
   static getWelcomeHeader(){
       return `${chalk.grey("*************")}  ${chalk.yellow("Thanks for using Binace bot  ")}  ${chalk.grey("press l")}  ${chalk.yellow("to see available commands")}  ${chalk.grey("*************")}`
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