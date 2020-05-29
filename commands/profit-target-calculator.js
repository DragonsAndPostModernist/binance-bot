let { BinanceWrapper }   = require("../service/BinanceWrapper");
module.exports =  (program, app) =>{
    program
        .command('profit-target-calculator [selector]')
        .description('Calculates and creates a table for possible profitable entries/exits')
        .option('--currencyPair <name>', 'The Currency Pair to use', String, app.config.defaults.currencyPair)
        .option('--entryPrice <number>', 'alert when price is below ?', Number, app.config.defaults.initialCurrencyCapital)
        .option('--fee <number>', 'alert when price is below ?', Number, app.config.defaults.initialCurrencyCapital)
        .action( (cmd,selector) => {
            console.log(` Not Implemented `)
        });
};
