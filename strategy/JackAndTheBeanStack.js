const technicalIndicators = require('technicalindicators');
technicalIndicators.setConfig('precision', 10);
const THRESHOLD_COUNT = 10;

const STATE_PENDING ="state.pending.signal";
const STATE_TYPE = 0; // 0 STACK coins 1 STACK Fiat

const utils = require("../lib/Utils");

class JackAndTheBeanStack {

    static getInstance(closes, price) {
        return new Rsi(closes, price);
    }

    constructor(candles, price) {

        this.price = Number(price);
        this.thresholdCount = 0;
        this.upperBound = 70;
        this.lowerBound = 30;
        this.signalledSellSignal = false;
        this.signalledBuySignal = false;
        this.state = "state.determine";
    }

    updateBuffer(price) {
        this.closes.pop();
        this.closes.push(Number(price))
    }

    setBounds(lower = 30, upper = 70) {
        this.lowerBound = lower;
        this.upperBound = upper;
    }

    run(price) {
        {
            return {signal: null, context: "jackAndTheBeanStack", value: null, status: "pending"}
        }
    }
}

module.exports = {
    JackAndTheBeanStack: JackAndTheBeanStack
}
