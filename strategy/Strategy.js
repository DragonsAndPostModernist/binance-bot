const technicalIndicators = require('technicalindicators');
technicalIndicators.setConfig('precision', 10);

const { Rsi } = require("./Rsi");
const { Macd } = require("./Macd");
const { Atr } = require("./Atr");
const { Bollinger } = require("./Bollinger");

class Strategy {
    
    static factory(strategy){
        switch( strategy ){
           case  'rsi' : return Rsi;
           case  'macd' : return Macd;
           case  'atr' : return Atr;
           case  'bollinger' : return Bollinger;
           default : return Rsi;
        }
    }    
}


module.exports = {
    Strategy:Strategy
}