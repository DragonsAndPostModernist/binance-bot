class Candle {

    static getCandle(){
        return new Candle();
    }
    constructor() {
        this.high = null;
        this.low = null;
        this.open =null;
        this.volume = null;
    }

    updateCandle(data){
        if(this.open === null ){
            this.open = Number(data.price);
            this.low =this.open;
            this.close = this.open;
            this.volume = Number(data.volume);
            return this;
        }
        else{
            this.volume = this.volume + Number(data.volume)
            if(Number(data.price) < this.low){
                this.low = Number(data.price);
            }else if(Number(data.price) > this.high ){
                this.high = Number(data.price);
            }
        }
    }

    close(closingPrice, lastVol){
        return { low:this.low, high:this.high, close: closingPrice, open:this.open, volume:(this.volume + lastVol)}
    }
}

module.exports = {
    Candle:Candle
}