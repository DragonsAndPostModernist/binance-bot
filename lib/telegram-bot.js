process.env["NTBA_FIX_319"] = 1;
const TelegramBot = require('node-telegram-bot-api');
let subscribers =  [];


const token = process.env.TELEGRAM_TOKEN;
let visitor = null;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

subscribers.push(924819408);

process.on('uncaughtException', function (error) {
    console.log("\x1b[31m", "Exception: ", error, "\x1b[0m");
});

process.on('unhandledRejection', function (error, p) {
    console.log("\x1b[31m","Error: ", error, "\x1b[0m");
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
});

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if(!subscribers.includes(chatId)){
        subscribers.push(chatId)
    }
});

const sendSignal = async  (signal) =>{
    let length = subscribers.length;
    for (let i =0 ;i < length; i++){
        await bot.sendMessage(subscribers[i], signal)
    }
    return null;
};


module.exports.visitor = (_visitor = null) =>{
    if(_visitor != null){
        visitor = _visitor;
    }
};
module.exports.send = async (data) =>{
    //console.log(data)
    await sendSignal(data)
};