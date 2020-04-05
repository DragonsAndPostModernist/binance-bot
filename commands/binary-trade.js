let { BinanceWrapper }   = require("../service/BinanceWrapper");
module.exports =  (program, conf) =>{
    program
        .command('binary-trade [selector]')
        .description('Sell and Buy at given Amount(s) Effectively a Lmit and Stop Loss order,\nwithout placing anything in the exchanges Order Book')
        .option('--strategy <name>', 'Send alert based on strategy ', String, conf.defaults.currencyPair)
        .option('--currencyPair <name>', 'The Currency Pair to use', String, conf.defaults.currencyPair)
        .option('--price_below <number>', 'alert when price is below ?', Number, conf.defaults.initialCurrencyCapital)
        .option('--price_above <number>', 'alert when price is above ?', Number, conf.defaults.initialCurrencyCapital)
        .option('--price_equal <number>', 'alert when price is equal ?', Number, conf.defaults.initialCurrencyCapital)
        .option('--price_above_and_below <number>', 'alert when price is equal ?', Number, conf.defaults.initialCurrencyCapital)
        .action( (cmd,selector) => {
            console.log(` Not Implemented `)
        });
};
