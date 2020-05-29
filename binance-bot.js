require('dotenv').config();
const { Command } = require('commander');
const program = new Command();
const loader = require("./boot/boot.js") 
program._name = require('./package.json').name;
program.version(require('./package.json').version);
const path = require('path');
const fs = require('fs');

let app = {};
const args = require('minimist')(process.argv.slice(2));

loader(app,args, (_app)=> {
    console.clear();
    app = _app;
    const command_directory = './commands'
    fs.readdir(command_directory, function (err, files) {
        if (err) {
            throw err
        }

        const commands = files.map((file) => {
            return path.join(command_directory, file)
        }).filter((file) => {
            return fs.statSync(file).isFile()
        });

        commands.forEach((file) => {
            require(path.resolve(__dirname, file.replace('.js', '')))(program, app)
        });

        program
            .command('*', 'Display help', {noHelp: true})
            .action((cmd) => {
                console.log('Invalid command: ' + cmd);
                program.help()
            });

        program.parse(process.argv)
    });
});

// if(app.config.commands.includes( args._[0])){
//     require('./commands/'+args._[0])(program, app.config);
//     program.parse(process.argv)
// }else{
//     program
//         .command('*', 'Display help', { noHelp: true })
//         .action((cmd)=>{
//             console.log('Invalid command: ' + cmd)
//             program.help()
//         });
//     program.parse(process.argv)
// }














