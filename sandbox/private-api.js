let { BinanceWrapper } = require("../service/BinanceWrapper");

const getTradesTest = async () =>{
    let pair  = "LTCUSDT";
    let binance = BinanceWrapper.getInstance()
    let trades = await binance.privateApi().trades(pair);
    console.log( trades )
};


getTradesTest();
