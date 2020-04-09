const technicalIndicators = require('technicalindicators');
technicalIndicators.setConfig('precision', 10);
let RSI = technicalIndicators.RSI;
const THRESHOLD_COUNT = 10;
const STATE_PENDING ="state.determine";
const STATE_SIGNALED_BUY ="state.signal.buy";
const STATE_SIGNALED_SELL ="state.signal.sell";
const utils = require("../lib/Utils");

class Rsi {

    static getInstance(closes, price) {
        return new Rsi(closes, price);
    }

    constructor(candles, price) {

        this.closes = utils.closes(candles);
        this.price = Number(price);
        this.thresholdCount = 0;
        this.upperBound = 70;
        this.lowerBound = 30;
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
        this.updateBuffer(price);
        let currentRsi = this.getRSI(this.closes);
        let actualRsi = currentRsi[currentRsi.length - 1];
        if (actualRsi <= this.lowerBound && ( this.state === STATE_PENDING || this.state === STATE_SIGNALED_BUY )) {
            if (this.thresholdCount > THRESHOLD_COUNT) {
                this.thresholdCount = 0;
                this.state = STATE_SIGNALED_BUY;
                return {signal: "Buy", context: "rsi", value: actualRsi, status: "resolved"}

            } else {
                this.thresholdCount++;
                return {signal: null, context: "rsi", value: actualRsi, status: "pending"}

            }
        } else if (actualRsi >= this.upperBound && ( this.state === STATE_PENDING || this.state === STATE_SIGNALED_SELL )) {
            if (this.thresholdCount > THRESHOLD_COUNT) {
                this.thresholdCount = 0;
                this.state = STATE_SIGNALED_SELL;
                return {signal: "Sell", context: "rsi", value: actualRsi, status: "resolved"}
            } else {
                this.thresholdCount++;
                return {signal: null, context: "rsi", value: actualRsi, status: "pending"}
            }
        } else {
            return {signal: null, context: "rsi", value: actualRsi, status: "pending"}
        }
    }

    getRSI(buffer) {
        let inputRSI = {
            values: buffer,
            period: 14
        };
        let rsi = new RSI(inputRSI);
        return rsi.getResult();
    }
}

module.exports = {
    Rsi: Rsi
}
