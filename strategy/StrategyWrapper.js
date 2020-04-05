class StrategyWrapper{
    constructor( indicator, execute, engine, type ) {
        this.indicator = indicator;
        this.execute = execute;
        this.engine = engine;
    }
    onExecute(data, candles){
        return this.execute(data, candles);
    }
}

module.exports = {
    StrategyWrapper:StrategyWrapper
};