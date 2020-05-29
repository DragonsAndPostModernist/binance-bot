const components = {
    home:()=>{},
    setting:()=>{},
    strategies:()=>{},
    currencyPairs:()=>{},
    stats:()=>{},
    trades:()=>{},
    simulator:()=>{},
    charting:()=>{},
    priceAlerts:()=>{},
    candleStickAlerts:()=>{},
    strategicAlerts:()=>{},
    entryAndExit:()=>{},
    profitTargetCalculator:()=>{},
    paperTrader:()=>{},
    manualTrading:()=>{},
    binaryTradeSetup:()=>{},
    strategyDesigner:()=>{},
    portfolio:()=>{},
    keys:()=>{},
    botConfig:()=>{},
    help:()=>{},
}

const openModal = (element) =>{
    $(`#${element}`).modal('show');
}
const closeModal = (element) =>{
    $(`#${element}`).modal('hide');
}

const setTradingView = () =>{
    $("#dashboard").hide();
    $('#tv').show();
}

const getLoader = () =>{
    return `<div class="ui active centered inline loader cyan-text"></div>`;
}

const buildBotSegment = ( obj ) =>{
    return `<div class="ui segment">
    <code>Name:</code>&nbsp;&nbsp;<span class="blue-grey-text">${obj.name}</span><br />
    <code>ID&nbsp;&nbsp;:</code>&nbsp;&nbsp;<span class="red-text">${obj._id}</span><br />
    <code>Pair:</code>&nbsp;&nbsp;<span class="grey-text">${obj.pair}</span><br />
    <br />
    <button class="ui labeled tiny icon button" onclick=starBot('${obj._id}')>
        <i class="play circle outline icon"></i>
        Start
    </button>
    <button class="ui labeled tiny icon button" onclick=stopBot('${obj._id}')>
        <i class="pause circle outline icon"></i>
        Stop
    </button>
    <button class="ui right labeled icon tiny button" onclick=editBot('${obj}'>
        <i class="pencil icon"></i>
        Edit
    </button>
    <button class="ui right labeled icon tiny button" onclick=deleteBot('${obj._id}'>
        <i class="trash alternate outline icon"></i>
        Delete
    </button>
    <br />
    <br />
    <div class="ui styled accordion">
        <div class="active title">
            <i class="dropdown icon"></i>
        View Bot Details
        </div>
        <div class=" content">
            <code class="red-text"><pre>${JSON.stringify(obj, null,2)}</pre></code>
        </div>
    </div>
  </div>`;
}
const getTradeTable = ( data ) =>{

    return `<th class="grey-text lighten-3 "><small><code>${data.time}</code></small></th>
    <th class="${ (data.isGreater) ? "green-text darken-3" : "red-text darken-3" }"><small><code>${(data.isGreater) ? "↑" : "↓"}  ${Number(data.price).toFixed(2)}</code></small></th>
    <th class="${ (data.isGreater) ? "green-text darken-3" : "red-text darken-3" }"><small><code>${(data.isGreater) ? "+" : "-"} ${data.diff}</code></small></th>
    <th class="yellow-text darken-3"><small><code>${Number(data.volume).toFixed(6)}</code></small></th>
    <th class="white-text"><small><code>${ data.strategy }</code></small></th>
    <th class="grey-text lighten-3"><small><code>${ data.rsi }</code></small></th>
    <th class="${(data.signal === "SELL" ? "red-text darken-3" : "green-text darken-3" ) }"><small><code>${ data.signal}</code></small></th>
    <th class="white-text"><small><code>${ data.asset}</code></small></th>
    <th class="white-text"><small><code>${data.currency}</code></small></th>
    <th class="white-text"><small><code>${data.entry}</code></small></th>
    <th class="${ (data.isProfit) ? "green-text darken-3" : "red-text darken-3" }"><small><code>${(data.isProfit) ? "↑" : "↓"}  ${ data.profit}</code></small></th>
    <th class="${ (data.isProfit) ? "green-text darken-3" : "red-text darken-3" }"><small><code>${(data.isProfit) ? "↑" : "↓"}  ${ data.diff}</code></small></th>`
}
const getTradingViewWidget = () =>{
    return ``;
}
const events = () =>{
    
}