require('dotenv').config();
let { Streamer } = require("../service/serviceImp/TwitterStreamingService");
let { BinanceWrapper }   = require("../service/BinanceWrapper");
module.exports =  (program, app) =>{
    program
        .command('alert-bot [selector]')
        .description('Configure a signal alert Notification [ twitter, email, telegram ]')
        .option('--strategy <name>', 'Send alert based on strategy ', String, app.config.defaults.currencyPair)
        .option('--currencyPair <name>', 'The Currency Pair to use', String, app.config.defaults.currencyPair)
        .option('--price-below <number>', 'alert when price is below ?', Number, app.config.defaults.initialCurrencyCapital)
        .option('--price-above <number>', 'alert when price is above ?', Number, app.config.defaults.initialCurrencyCapital)
        .option('--price-equal <number>', 'alert when price is equal ?', Number, app.config.defaults.initialCurrencyCapital)
        .option('--alert-by <name>', 'the alerting method to use [ twitter, email, telegram ] ?', String, app.config.defaults.alertMethod)
        .option('--whale-alert <name>', 'the alerting method to use [ twitter, email, telegram ] ?', Boolean, false)
        .action( (cmd,selector) => {
              
            if( selector.whaleAlert){
               Streamer.getWhaleAlertInstance().filter("@whale_alert").stream();
            }else{
                //console.log(selector);
            }
        });
};
