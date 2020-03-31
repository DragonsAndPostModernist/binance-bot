/*

      order book [ curency pair]

*/

const { Command } = require('commander');
const program = new Command();
const loader = require("./boot/boot.js") 
program._name = require('./package.json').version;
program.version(require('./package.json').name);

let app = {};
const args = require('minimist')(process.argv.slice(2));

loader(app,args, (_app)=>{
    app = _app
});

console.log(args);
if(args._.includes('orderBook')){
    require('./commands/orderbook')(program, app.config);
    program.parse(process.argv)
}

program
    .command('*', 'Display help', { noHelp: true })
    .action((cmd)=>{
        console.log('Invalid command: ' + cmd)
        program.help()
    });













