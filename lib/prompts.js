const {
    Prompt,
    Select,
    Form,
    Input,
    Password,
    BasicAuth,
    Confirm,
    List,
    MultiSelect,
    NumberPrompt,
    Scale
} = require('enquirer');
const colors = require('colors');

const prompts = {

    
    signalPrice:new NumberPrompt({
        name: 'number',
        message: 'Please enter target price'
    }),
    limitPrice:new NumberPrompt({
        name: 'number',
        message: 'Please enter your first target price'
    }),
    limit2Price:new NumberPrompt({
        name: 'number',
        message: 'Please enter your second target price'
    }),
    movingAveragePeriod:new NumberPrompt({
        name: 'number',
        message: 'Please enter a SMA length'
    }),
    qty:new NumberPrompt({
        name: 'number',
        message: 'Please enter purchase Qty'
    }),
    avgPrice:new NumberPrompt({
        name: 'number',
        message: 'Please enter price per instrument at purchase time'
    }),
    limit:new NumberPrompt({
        name: 'number',
        message: 'Please enter limit target'
    }),
    stop:new NumberPrompt({
        name: 'number',
        message: 'Please enter stop target'
    }),
    start:new Select ({
        name: 'Static Bot Menu',
        message: 'Available Options',
        choices: [
            'Place Static Order',
            'Order Book',
            'Indicator & Patterns',
            'Set Alert',
            'Entry Calculator',
            'Profit Target Calculator',
        ],
    }),
  
    initTrade:new Confirm({
        name: 'trade',
        message: 'Initialize Trade on Signal?'
    }),


    intervalSelect:new Select({
        name: 'interval',
        message: 'Pick a Time Interval',
        choices: ["1m","3m","5m","15m","30m","1h","2h","4h","6h","8h","12h","1d","3d","1w","1M"]
    }),
    strategySelect:new Select({
        name: 'interval',
        message: 'Pick a Strategy',
        choices: ['Macd', 'RSI', 'Pivot', "SimpleMa", 'Break Out', 'Golden Cross', "Death Cross",'PennyWise','Candle' ]
    }),
    patternSelect:new Select({
        name: 'interval',
        message: 'Pick a Strategy',
        choices: ['Macd', 'RSI', 'Pivot', "SimpleMa", 'Break Out', 'Golden Cross', "Death Cross",'PennyWise','Candle' ]
    }),
    signalTypeSelect:new Select({
        name: 'signalType',
        message: 'Select Signal Type',
        choices: ['Price Rise', 'Price Drop', 'Price Cross', 'Price Target', 'Break Out', 'Golden Cross', "Death Cross", "4EMA", "Chart Pattern"]
    }),
    percentageSelect:new Select({
        name: 'signalType',
        message: 'Select Signal Type',
        choices: ['1%','2%','5%', '10%', '20%', '25%', '30%', '35%', '40%', '45%', '50%', '60%', '70%', '80%', '90%', '100%']
    }),
    orderForm:new Form({
        name: 'params',
        message: 'Enter Order Parameters',
        choices: [
            { name: 'price',     message: 'Entry Price        :'},
            { name: 'entry',     message: 'Entry Funds        :', initial: "0.5" },
            { name: 'fee',       message: 'Broker  Fee        :', initial: "0.5" },
            { name: 'type',      message: '<market|limit|stop>:', initial: 'limit' },
            { name: 'side',      message: '<buy|sell>         :', initial: 'buy' },
            { name: 'target',    message: 'Target Profit %    :', initial: '2' },
        ]
    }),
    binaryOrderForm:new Form({
        name: 'params',
        message: 'Enter Order Parameters',
        choices: [
            { name: 'price',     message: 'Entry Price        :'},
            { name: 'side',      message: '<buy|sell>         :', initial: 'buy' },
            { name: 'targetOne',    message: 'Target 1    :', initial: '0' },
            { name: 'targetTwo',    message: 'Target 2    :', initial: '0' },
        ]
    }),
    profitTargetForm:new Form({
        name: 'params',
        message: 'Enter Target  Parameters',
        choices: [
            { name: 'currentPrice',    message: 'Enter Current Price        :', initial:"0"},
            { name: 'target',          message: 'Enter  your target profit  :', initial: "1" },
            { name: 'entry',           message: 'Enter your Entry funds     :', initial: "100" },
            { name: 'fee',             message: 'Enter Broker Fee           :', initial: "0.5" },
            { name: 'side',            message: 'Enter Order Type buy|sell  :', initial: "buy" },
        ]
    }),
    input:new Input({
        message: 'Enter Target pct %',
        initial: '1'
    }),
    targetInput:new Input({
        message: 'Enter available funds',
        initial: '00.00'
    }),
};


module.exports = {
    prompts:prompts
}