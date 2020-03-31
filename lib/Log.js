const color = require("chalk");


class Logger{


     static header( currency, asset ){
     	console.log(color.grey(`Date		Price		Change		Volume		RSI		Action		Ballance ${currency.toUpperCase()}		Ballance ${asset.toUpperCase}		Profit		Loss`))

     }
     static orderBookHeader(){
     	console.log(color.grey(` Volume     Price   Price   Volume`));
     }

}

module.exports = {
	Logger:Logger
}