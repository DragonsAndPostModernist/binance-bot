let { BinanceWrapper }   = require("../service/BinanceWrapper");
module.exports =  (program, app) =>{
    program
        .command('trades [selector]')
        .description('View your portfolio and trade performances')
        .action( (cmd,selector) => {
            console.log(` Not Implemented `)
        });
};
