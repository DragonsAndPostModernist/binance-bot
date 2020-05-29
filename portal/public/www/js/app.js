
let socket = {};
let currencyPair = "BTCEUR"
let isStreaming = false;
let app ={};
let globals = {};
let startTime = null; 
let tableIndex = 0;
let prevPrice = 0;
let currencyAssetSplit =null;
let currentBot = null;


const populateBots =() =>{
    console.log("========>Globals", globals)
    if ( globals.bots && globals.bots.length > 0){
       let buffer = [];
       globals.bots.forEach( bot => buffer.push(buildBotSegment(bot)));
       $('#bots').html(buffer.join(""))     
       $('.ui.accordion').accordion('refresh'); 
    }else{
    }
}

const setBotConfigValue = ( key, value ) =>{
    currentBot[key] = value;
}
const postBot = async () =>{
    console.log("BEFORE::", currentBot )
     let tradeSide = $('#botConfigLastTradeSide').dropdown('get value') || "buy";
     currentBot.lastTradeSide = tradeSide;
     currentBot.isPaperTrade  = $('#botConfigPaperTrade').prop("checked");
     currentBot.withStop  = $('#botConfigWithStop').prop("checked");
     currentBot.noTrade  = $('#botConfigExecTrades').prop("checked");
     BotConfigTargetMap.forEach( map => currentBot[map.to] = $(`#${map.name}`).val());
     console.log("AFTER::", currentBot )
     let response = await _fetch( settings.paths.apiBasePath.dev+settings.paths.api.bot.post, settings.request.method.POST, currentBot);
     closeModal("botConfigurationModal");
     if ( response && response.status === 200 || response.status === 201 ){
         toast( settings.alerts.toast.success.botCreated, 'success')
     }else{
         toast( settings.alerts.toast.error.botCreated, 'error')
     }
}
const setStrategies = () => {
    templateEngine(globals, [$('#strategies')], (globals) => {
        let buffer = [];
        globals.strategies.forEach(element => {
            buffer.push(`<div class="item" onclick="setBotConfigValue('strategy', '${element}');">${element}</div>`);
        });
        return buffer;
    });
}

const setPatterns = () => {
    templateEngine(globals, [$('#patterns')], (globals) => {
        let buffer = [];
        globals.patterns.forEach(element => {
            buffer.push(`<div class="item" onclick="setBotConfigValue('pattern', '${element}');">${element}</div>`);
        });
        return buffer;
    });
}

const setPair = ( pair, label, stream = true ) =>{
    console.log( pair )
    currencyPair = pair;
    currencyAssetSplit = label.split("/");
    socket.emit('symbolChange', {cp:currencyPair , stream:stream} );
    if ( stream ) { $('#index_0').html( getLoader() ) } 
        
}

const renderTradeData = ( data ) =>{
    // ticker, rsiData, lastOrder, lastPrice, currencyAssetSplit
    let obj = tradeDataBuilder( data.ticker , data.rsiData, app.lastFilledOrder, prevPrice, currencyAssetSplit ) ;
    if( prevPrice === 0 ){
        prevPrice  = data.ticker.p;
    }
    startTime =  (startTime === null) ? setStartTime() : startTime;
    let currentTime = new Date();
    if( currentTime.getMinutes() > new Date( startTime ).getMinutes()  ){
        tableIndex++
        // append
        $('#trades').append( `<tr id="index_${tableIndex}">${getTradeTable(obj)}</tr>` )
        startTime = setStartTime();
    }else{
       // overwrite existing index
       let target = $(`#index_${tableIndex}`);
       target.html( getTradeTable(obj) )
    }
    prevPrice  = data.ticker.p;
}

const setStartTime = () =>{
    let time = new Date();
    time.setMinutes( time.getMinutes() + 1 )
    return time;
}
const stream = () =>{
   if( isStreaming ){ return } 
   socket.emit("stream", {cp:currencyPair});
   isStreaming = true;
}
const stopStream = () =>{
    socket.emit("stopStream", {cp:currencyPair});
    isStreaming = false;
 }
const initSocketListeners = () =>{
    socket = io(settings.paths.client.url+':'+settings.paths.client.port);
    socket.emit("client",navigator.userAgent );
    socket.on('ticker', function( data ){ console.log( data ), renderTradeData( data ) });
    socket.on('accountInfo', function( data ){ app = data; console.log(data)})
    socket.on('uiGlobals', function( data ){
        globals = data;
        console.log( globals );
        setStrategies();
        setPatterns();
        populateBots()  
       
     })
    socket.emit('boot');
    socket.emit('globals');
};

$( document ).ready(function() {
    currentBot =  Models.botConfig;
    enbaleSemanticUI();
    // load the sideMenu;
    // load currencyPairs
    initSocketListeners();
    fetch("./js/Products.json").then(async (resp) => {
        const obj = await resp.json();
        console.log(obj);
        templateEngine( obj, [$('#pairs') ], (obj)=>{
            let buffer = [];
            obj.forEach(element => {
                buffer.push( `<div class="item" onclick="setPair('${ element.id }', '${ element.label}', true);">${ element.label }</div>` )
            });
            return buffer;
        })
        templateEngine( obj, [$('#botPairs') ], (obj)=>{
            let buffer = [];
            obj.forEach(element => {
                buffer.push( `<div class="item" onclick="setPair('${ element.id }', '${ element.label}', false);">${ element.label }</div>` )
            });
            return buffer;
        })
    })
});




