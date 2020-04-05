let { BinanceWrapper }   = require("../service/BinanceWrapper");
module.exports =  (program, conf) =>{
    program
        .command('profit-target-calculator [selector]')
        .description('Calculates and creates a table for possible profitable entries/exits')
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
