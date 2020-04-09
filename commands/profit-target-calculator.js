let { BinanceWrapper }   = require("../service/BinanceWrapper");
module.exports =  (program, conf) =>{
    program
        .command('profit-target-calculator [selector]')
        .description('Calculates and creates a table for possible profitable entries/exits')
        .option('--currencyPair <name>', 'The Currency Pair to use', String, conf.defaults.currencyPair)
        .option('--entryPrice <number>', 'alert when price is below ?', Number, conf.defaults.initialCurrencyCapital)
        .option('--fee <number>', 'alert when price is below ?', Number, conf.defaults.initialCurrencyCapital)
        .action( (cmd,selector) => {
            console.log(` Not Implemented `)
        });
};
