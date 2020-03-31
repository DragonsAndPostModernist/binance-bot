 
const blessed = require('blessed')
let   contrib = require('blessed-contrib')
const CoinbasePro = require('coinbase-pro');
let statistics = require("simple-statistics");
const publicClient = new CoinbasePro.PublicClient();
let screen = blessed.screen()
let grid = new contrib.grid({rows: 100, cols: 6, screen: screen})
const volumes = ['Sell', 'Buy']
const months = ["jan", "feb","mar","apr","mai","jun","jul","aug","sep","oct","nov","dec"],
stopCount =  0;
lastClose  = 0;
lastHigh   = 0;
lastLow    = 0;
let priceData = {
   title: 'High',
  style:{ 
      line: "cyan"
    , text: "green"
    , baseline: "black"
  },
   x: [],
   y: []
}

let priceData2 = {
   title: 'Low',
  style:{ 
      line: "red"
    , text: "green"
    , baseline: "black"
  },
   title: 'Low',
   x: [],
   y: []
}

let priceData3 = {
  title: 'Market Trend',
  style:{ 
      line: "yellow"
    , text: "yellow"
    , baseline: "black"
  },
   x: [],
   y: []
}
/**
                         
    grid.set(row, col, rowSpan, colSpan, obj, opts)

*/
const getAskLog = () => {
  return  { 
    fg: "red",
    label: 'Asks Sells',
    height: "20%", 
    tags: true, 
    border: {
      type: "line", 
      fg: "cyan"
    } 
  }
}

const getBidLogs =() =>{
  return   { 
    fg: "green",
    label: 'Current Bids',
    height: "20%", 
    tags: true, 
    border: {
      type: "line", 
      fg: "cyan"
    } 
  }
}

const getlineChart =(_maxY, _minY) =>{
  return { 
           xLabelPadding: 3
         , xPadding: 5
         , showLegend: true
         , wholeNumbersOnly: false //true=do not show fraction in y axis
         , label: 'MA Chart'}
    
}

const getVolumeChart = () =>{
  return { 
        label: 'Volumes:'
       , barWidth: 2
       , barSpacing: 6
       , xOffset: 0
       , maxHeight: 9
     }
};


let asks = grid.set(0, 0, 15, 3, contrib.log, getAskLog()
    
);
let bids = grid.set(0, 1, 15, 3, contrib.log, getBidLogs()
    
);
let bar = grid.set(0, 2, 15, 3, contrib.bar, getVolumeChart());
let line = grid.set(15, 0, 30, 5, contrib.line, getlineChart());





const getAverage = (arr) =>{
  arrSum = function(arr){
    return arr.reduce(function(a,b){
      return a + b
    }, 0);
  }
}

const log10precission = (value) =>{
  let base =  Math.round(100*Math.log(value)/Math.log(10))/100;
  switch (base) {
    case 3 : return 100; break;
    case 4 : return 1000; break;
    case 5 : return 10000; break; // I whish
  }
  return 100;
}
const setTradingTrends = async () =>{
  
  let orders =  await publicClient.getProductOrderBook('BTC-EUR', {level:1} );
  let stats  = await  publicClient.getProduct24HrStats( 'BTC-EUR');
  let high = 0;
  let low =  0;
  let last=  0;
  if(lastLow != 0 && lastHigh != 0 && lastClose != 0){
      high = Math.abs(Number(stats.high) - lastHigh);
      low =  Math.abs(Number(stats.low)  - lastLow);
      last=  Math.abs(Number(stats.last) - lastClose);
      if(last != 0){
        priceData3.x.push( stats.last > lastClose ?  ""+parseFloat(stats.last).toFixed(2)+"  +"+last.toFixed(2)+"" : ""+parseFloat(stats.last).toFixed(2)+"  -"+last.toFixed(2)+""  );
        priceData3.y.push(last);
      }
  } 
  lastHigh  = Number(stats.high);
  lastLow   = Number(stats.low);
  lastClose = Number(stats.last); 

  if (priceData.x.length > 20){
    priceData3.y.shift();
  }
  if (priceData.x.length > 6){
    priceData3.x.shift();
  }

  let ask = parseFloat(orders.asks[0][0]).toFixed(2);
  let bid =  parseFloat(orders.bids[0][0]).toFixed(2);
  let bidVolume = parseFloat(orders.asks[0][1]).toFixed(6); 
  let askVolume = parseFloat(orders.bids[0][1]).toFixed(6);
  let totalVolumeInSession = Number(bidVolume) + Number(askVolume);
  let askVolumePct = (Number(askVolume) / totalVolumeInSession) * 100;
  let bidVolumePct = (Number(bidVolume) / totalVolumeInSession) * 100;
  

  asks.log("{yellow-fg}"+askVolume+"{/yellow-fg} : {red-fg}"+ask+"{/red-fg}");
  bids.log("{yellow-fg}"+bidVolume+"{/yellow-fg} : {green-fg}"+bid+"{/green-fg}");
  bar.setData({titles: volumes, data: [Math.round(askVolumePct), Math.round(bidVolumePct)]})
  line.setData([priceData3])
};

const startListeners =()  =>{

  
  setInterval(function() { 
      setTradingTrends();    
      
    }, 1000)
};






const Main = () =>{

  startListeners();
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
     return process.exit(0);
  });
  screen.render()  
}


Main();