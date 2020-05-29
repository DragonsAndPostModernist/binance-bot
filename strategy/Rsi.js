
const { RsiIndicator } =  require("../indicators/Indicators");
const THRESHOLD_COUNT = 10;

const STATE_PENDING ="state.pending.signal";
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
        // let object = (require("../indicators/Indicators").PatternRecognitionIndicator);
        // console.log(Object.getOwnPropertyNames(object).filter(prop => typeof object[prop] === "function"))
        this.updateBuffer(price);
        let currentRsi = this.getRSI(this.closes);
        let actualRsi = currentRsi[currentRsi.length - 1];
        if (actualRsi <= this.lowerBound && !this.signalledBuySignal) {
            if (this.thresholdCount > THRESHOLD_COUNT) {
                this.thresholdCount = 0;
                this.signalledBuySignal = true;
                this.signalledSellSignal = false;
                return {signal: "Buy", context: "rsi", value: actualRsi, status: "resolved"}
            } else {
                this.thresholdCount++;
                return {signal: null, context: "rsi", value: actualRsi, status: "pending"}

            }
        } else if (actualRsi >= this.upperBound && !this.signalledSellSignal) {
            if (this.thresholdCount > THRESHOLD_COUNT) {
                this.thresholdCount = 0;
                this.signalledSellSignal = true;
                this.signalledBuySignal = false;
                return {signal: "Sell", context: "rsi", value: actualRsi, status: "resolved"}
            } else {
                this.thresholdCount++;
                return {signal: null, context: "rsi", value: actualRsi, status: "pending"}
            }
        } else {
            return {signal: null, context: "rsi", value: actualRsi, status: "pending"}
        }
    }

    getRSI( buffer ) {
        return RsiIndicator.getData( buffer );
    }
}

module.exports = {
    Rsi: Rsi
}
