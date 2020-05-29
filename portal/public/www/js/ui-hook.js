const BUY = "BUY";
const SELL = "SELL";
const PENDING = "PENDING"
let lastFilledOrder = null;

const BotConfigTargetMap = [
    /**
     * 
     *  "name":"Demo Bot"
     *  "strategy":"rsi",
        "pattern":null,
        "candleInterval":"30m", 
        "pair":"BTCEUR",
        "entryPrice":null,
        "funds":15000,
        "availableAsset":null,
        "exchangeFee":0.1,
        "buyPct":25,
        "sellPct":25,
        "limitBuy":3,
        "limitSell":3,
        "isPaperTrade":true,
        "sellStopPct":3,
        "buyStopPct":3,
        "lastTradeSide":"BUY",
        "lastTrade":{},
        "openOrders":{},
        "runFor":"infinite",
        "noTrade":true,
        "withStop":false,
     */
    { name:"botConfigName", to:"name"},
    { name:"botConfigStrategy",to:"strategy"},
    { name:"botConfigPattern",to:"pattern"},
    { name:"botConfigBuyLimit",to:"limitBuy"},
    { name:"botConfigSellLimit",to:"limitSell"},
    { name:"botConfigStopLimit",to:"sellStopPct"},
    { name:"botConfigStopEntry",to:"buyStopPct"},
    { name:"botConfigBuyPct",to:"buyPct"},
    { name:"botConfigSellPct",to:"sellPct"},//
    { name:"botConfigAvailableFunds",to:"funds"},
    { name:"botConfigAvailableAsset",to:"availableAsset"},
    { name:"botConfigfee",to:"exchangeFee"},

]

const enbaleSemanticUI =() =>{
    $('.ui.radio.checkbox').checkbox();
    $('.ui.checkbox').checkbox();
    $('.ui.dropdown').dropdown();
    $('.menu.item').tab();
    $('.tabular.menu.item').tab( {history:false} );
    $('.ui.modal').modal();
    $('.ui.menu.popup').popup();
    $('.ui.accordion').accordion()
;
}

const calculateProfit = (  ticker, lastPrice ) =>{
    let assetPrice = calculateEntry( false, ticker);
    if( lastFilledOrder.side === BUY ){
        // The last Entry was a buy we want to calculate sell profit 
        return { isProfit:(assetPrice > lastPrice) ? true : false, assetPrice:assetPrice, diff:Math.abs(assetPrice - lastPrice) } 
    }else{
         // The last Entry was a sell we want to calculate buy in profit 
       return { isProfit:(assetPrice < lastPrice) ? true : false, assetPrice:assetPrice, diff:Math.abs(assetPrice - lastPrice)  } 
    } 
 }
 const calculateEntry = ( isBuyEntry, lastTrade ) =>{
     if( isBuyEntry ){
         let adjustedQuantity = Number( lastTrade.executedQty ) ;
         return ( Number(lastTrade.price) * adjustedQuantity ) ;
     }else{
        return  Number(lastTrade.executedQty)  *  (Number(lastTrade.price)); 
     }
 }
 const formatTime = (date) =>{
    let dateString = date.toISOString();
    dateString = dateString.replace("T"," ")
    return dateString.split(".")[0];
}
const tradeDataBuilder = ( ticker, rsiData, lastOrder, lastPrice, currencyAssetSplit ) =>{
    lastFilledOrder = lastOrder;
    let instance = {};
    instance.isGreater = ( Number( ticker.p ) > Number( lastPrice )) 
    instance.isBuy = (lastFilledOrder.side === BUY);
    let profit = calculateProfit( { price:ticker.p, executedQty:lastFilledOrder.executedQty }, calculateEntry( (instance.isBuy), lastFilledOrder ) );
    instance.time = formatTime (new Date(ticker.T));
    instance.price = ticker.p;
    instance.lastPrice=  lastPrice;
    instance.volume = ticker.q;
    instance.rsi = rsiData.value.toString().split(".")[0];
    instance.strategy = "rsi";
    instance.signal=  rsiData.signal;
    instance.asset=  Number(lastFilledOrder.executedQty).toFixed(4) + ' ' + currencyAssetSplit[0];
    instance.currency=  Number(lastFilledOrder.price).toFixed(2) + ' ' + currencyAssetSplit[1];
    instance.entry=  calculateEntry( (instance.isBuy), lastFilledOrder ).toFixed(2);
    instance.profit=    Number(profit.assetPrice).toFixed(2);
    instance.isProfit = Number(profit.isProfit);   
    instance.diff = Math.abs( Number(ticker.p ) - Number( lastPrice) ).toFixed(2);

     return instance;
}
const templateEngine = ( data, targets, processor, appendOnly = false ) =>{
    
    targets.forEach(target =>{
        if( appendOnly){
            target.append( processor(data) )
        }else{
            target.html( processor(data) )
        }
    })
}

const toast = (message, type, position = 'top-right', delay) =>{
    alertify.set('notifier','position', position);
    alertify.set('notifier','delay', delay);
    alertify[type](message);
}
const render =( action ) =>{
    console.log(" [ Debug ] ", action )
    components[action]();
}
