const path = require('path');
const models = require("../model/models.json");
const repo = require("../repository/Repository");
const { BinanceWrapper } = require("../service/BinanceWrapper");
let client = BinanceWrapper.getInstance();
const FILLED = "FILLED";
module.exports = async (app,args, cb) =>{
	
	app.config = require('../config/conf');
	if(args.config){
		try{
			app.config = require(path.resolve(process.cwd(), args.config));
		}
		catch(error){
			console.error(err + ', failed to load conf overrides file using default conf!');
            app.config = require('../config/conf');
		}
	}

	try{
		console.log(args)
			// load keys X
		if( args.help || !args._.includes("trade-bot") ){
			return cb(app);
		}	
		app.keys = await repo.getBy("api-keys", { hook:models.keys.hook});
			// load last trades 
		app.lastTrades = await client.privateApi(app.keys).trades( args.currencyPair || app.config.currencyPair);
		let numTrades = app.lastTrades.result.length;
		let isFilled  = false;
		// since there might be open trades we must get the last filled trade
		while( numTrades > 0 && !isFilled){
			// load last trades 
			
			app.lastFilledOrder = await client.privateApi(app.keys).orderStatus( args.currencyPair || app.config.currencyPair, app.lastTrades.result[numTrades-1].orderId);
			if(app.lastFilledOrder.result.status === FILLED ){
				app.lastFilledOrder = app.lastFilledOrder.result;
				isFilled = true;
			}
			numTrades--;
		}

		cb(app);
	}catch(error){
		  console.log(error);
		  process.exit(1);
	}
	
}
