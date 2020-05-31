let {
    RSIIndicator,
    MACDIndicator,
    BBIndicator,
    ATRIndicator,
    SMA3Indicator,
    WOODIESPointsIndicator,
    FLOORPivotIndicator,
    EMA3Indicator,
    EMA4Indicator,
    MFIIndicator,
    OBVIndicator,
    KSTIndicator,
    WILLIAMSRIndicator,
    BreakoutSignaller
} = require("../strategy/Strategy").Strategy;

const utils = require("../lib/Utils");

const getHistory = async (interval, currencyPair) =>{
    // let hist = await cbp.getHistoryByGranularity(interval, currencyPair);
    // return hist;
    return [];
}
let Service = {

    woodies  : async (interval, socket=null, currencyPair)=>{
        let hist = await getHistory(interval, currencyPair)  
        hist = utils.reverseData(hist);
        let floorPoints = BreakoutSignaller.getWoodiesPoints(hist);
        let response = {};
        response['Resistance_@_1'] = floorPoints.higherBreakout_1;
        response['Resistance_@_2'] = floorPoints.higherBreakout_2;
        response['Resistance_@_3'] = floorPoints.higherBreakout_3;
        response['Pivot_Point'] = floorPoints.pivot;
        response['Support_Line_1'] = floorPoints.lowerBreakout_1;
        response['Support_Line_2'] = floorPoints.lowerBreakout_2;
        response['Support_Line_3'] = floorPoints.lowerBreakout_3;
        if(socket !== null)
            socket.emit('indicatorUpdate', {response});
    }, 
    macd     : async (interval, socket, currencyPair)=>{
        let hist = await getHistory(interval, currencyPair);
        hist = utils.reverseData(hist);
        let macd = MACDIndicator.getMacd(utils.getCloses(hist));
        let response = macd[macd.length-1];
        if(socket !== null)
            socket.emit('indicatorUpdate', {response});
    },
    ema      : async (interval, socket, currencyPair)=>{
         let hist = await getHistory(interval, currencyPair)  
         hist = utils.reverseData(hist);
         let response = EMA4Indicator.getEmas(utils.getCloses(hist));
         if(socket !== null)
            socket.emit('indicatorUpdate', {response});
    },
    ma       : async (interval, socket, currencyPair)=>{
         let hist = await getHistory(interval, currencyPair)  
         hist = utils.reverseData(hist);
         let response = SMA3Indicator.getSMAS(utils.getCloses(hist));
         if(socket !== null)
            socket.emit('indicatorUpdate', {response});
    },
    rsi: async (interval, socket, currencyPair)=>{
         let hist = await getHistory(interval, currencyPair)  
         hist = utils.reverseData(hist);
         let response = RSIIndicator.getRSI(utils.getCloses(hist));
         response = utils.reverseData(response);
         if(socket !== null)
            socket.emit('indicatorUpdate', {response});
         
    },
    bollinger      : async (interval, socket, currencyPair)=>{
         let hist = await getHistory(interval, currencyPair) 
         hist = utils.reverseData(hist);
         let response = BBIndicator.getBollinger(utils.getCloses(hist));
         response = response[response.length -1];
         // response = utils.reverseData(response);
         if(socket !== null)
            socket.emit('indicatorUpdate', {response});
    },
    atr      : async (interval, socket, currencyPair)=>{
         let hist = await getHistory(interval, currencyPair) 
         hist = utils.reverseData(hist);
         let closes = utils.getCloses(hist)
         let lows = utils.getLows(hist);
         let highs =  utils.getHighs(hist);
         let response = ATRIndicator.getATR(highs, lows, closes);
         response = {"Average True Range":response[response.length -1]};
         // response = utils.reverseData(response);
         socket.emit('indicatorUpdate', {response});  
    }
}

module.exports = Service;
