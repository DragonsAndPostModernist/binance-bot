const chalk = require("chalk");
const align = require('align-text');
const utils = require('../../lib/Utils');
const { Logger } = require('../../lib/Log');
const { ServiceInterface } = require("./ServiceInterface")

class DepthService extends ServiceInterface {
    constructor() {
        super();
    }
    execute( depth ){
        let {e:eventType, E:eventTime, s:symbol, u:updateId, b:bidDepth, a:askDepth} = depth;
        let minRows = (bidDepth.length <= askDepth.length ) ? bidDepth.length : askDepth.length;
        let buffer1 = [];
        let buffer2 = [];
        for ( let i =0 ;i < minRows;i++){
            buffer1.push(` ${chalk.red(Number(askDepth[i][0]).toFixed(2))} : ${chalk.white(Number(askDepth[i][1]).toFixed(4))} `)
            buffer2.push(` ${chalk.green(Number(bidDepth[i][0]).toFixed(2))} : ${chalk.white(Number(bidDepth[i][1]).toFixed(4))}`)
        }
        console.clear();
        console.log(buffer1.join("\n"));
        console.log(buffer2.join("\n"));
    }
}

module.exports = {
    DepthService:DepthService
};
