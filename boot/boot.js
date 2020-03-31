const path = require('path');


module.exports = (app,args, cb) =>{
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
	cb(app);
}
