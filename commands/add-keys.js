
const repo = require("../repository/Repository");
const model = require("../model/models").keys;
const colors = require("colors")
module.exports =  (program, app) =>{
    program
        .command('add-keys [selector]')
        .description('Store Api Keys')
        .option('--key <name>', 'The API Key to add', String, "")
        .option('--secret <name>', 'The API secret to add', String, "")
        .action( async (cmd,selector) => {
            model.createdAt = new Date();
            model.updatedAt = new Date();
            model.key    = selector.key;
            model.secret = selector.secret;
            await repo.add("api-keys", model);
            console.log("*************".grey + "API KEYS UPDATED!!!!".red + "*************".cyan);
        });

};
