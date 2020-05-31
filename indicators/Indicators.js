let tw = require("trendyways");
const technicalIndicators = require('technicalindicators');
technicalIndicators.setConfig('precision', 10);

let utils = require("../lib/Utils");

let MACD =  technicalIndicators.MACD;
let RSI =  technicalIndicators.RSI;
let ATR =  technicalIndicators.ATR;
let BB =  technicalIndicators.BollingerBands;
let EMA =  technicalIndicators.EMA;
let SMA = technicalIndicators.SMA;
let OBV =  technicalIndicators.OBV;
let MFI =  technicalIndicators.MFI;
let KST     =  technicalIndicators.KST;
let Bullish =  technicalIndicators.bullish;
let WilliamsR = technicalIndicators.WilliamsR;
let ADL = technicalIndicators.ADL;
let ADX = technicalIndicators.ADX;
let AwesomeOscillator = technicalIndicators.AwesomeOscillator;    
let CCI = technicalIndicators.CCI;
let ForceIndex = technicalIndicators.ForceIndex;
let PSAR = technicalIndicators.PSAR;
let ROC = technicalIndicators.ROC;
let Stochastic = technicalIndicators.Stochastic;
let TRIX = technicalIndicators.TRIX;
let VWAP = technicalIndicators.VWAP;
let VP = technicalIndicators.VolumeProfile
let WP = technicalIndicators.WMA;
let WEMA = technicalIndicators.WEMA;
let IchimokuCloud  = technicalIndicators.Ichimokucloud;
class WoodiesPointsIndicator{
    static getData( buffer ){
        return tw.woodiesPoints (points) ;
    }
}
class RsiIndicator {
    static getData( buffer ){
        let inputRSI = {
            values: buffer,
            period: 14
        };
        let rsi = new RSI(inputRSI);
        return rsi.getResult();
    }
}
class AtrIndicator {
    static getData( bufferH, bufferL, bufferC ){
        let inputATR = {
            high : bufferH,
            low  : bufferL,
            close: bufferC,
            period : 14
        };
        let atr = new ATR(inputATR);
        return atr.getResult();
    }
}
class BollingerIndicator{
    static getData( closes ){
        let input = {
            period : 20,
            values : closes,
            stdDev : 2

        };
        let bb = new BB(input);
        return bb.getResult();
    }
}
class MacdIndicator{
    static getData( closes ){
        let macdInput = {
            values            : closes,
            fastPeriod        : 5,
            slowPeriod        : 8,
            signalPeriod      :  3,
            SimpleMAOscillator: true,
            SimpleMASignal    : true
        };
        let macd= new MACD(macdInput);
        return macd.getResult();
    }
}
class PatternRecognitionIndicator{
    static AbandonedBaby(o,h,l,c){
        let pattern = technicalIndicators.abandonedbaby;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static BearishEngulfingPattern(o,h,l,c){
        let pattern = technicalIndicators.bearishEngulfingPattern;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static BullishEngulfingPattern(o,h,l,c){
        let pattern = technicalIndicators.bullishEngulfingPattern;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static DarkCloudCover(o,h,l,c){
        let pattern = technicalIndicators.darkcloudcover;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static DownsideTasukiGap(o,h,l,c){
        let pattern = technicalIndicators.downsidetasukigap;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static Doji(o,h,l,c){
        let pattern = technicalIndicators.doji;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static DragonFlyDoji(o,h,l,c){
        let pattern = technicalIndicators.dragonflydoji;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static GraveStoneDoji(o,h,l,c){
        let pattern = technicalIndicators.gravestonedoji;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static BullishHarami(o,h,l,c){
        let pattern = technicalIndicators.gravestonedoji;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static BearishHaramiCross(o,h,l,c){
        let pattern = technicalIndicators.gravestonedoji;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static BullishHaramiCross(o,h,l,c){
        let pattern = technicalIndicators.gravestonedoji;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static BullishMarubozu(o,h,l,c){
        let pattern = technicalIndicators.bullishmarubozu;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static BearishMarubozu(o,h,l,c){
        let pattern = technicalIndicators.bearishmarubozu;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static EveningDojiStar(o,h,l,c){
        let pattern = technicalIndicators.eveningdojistar;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static EveningStar(o,h,l,c){
        let pattern = technicalIndicators.eveningstar;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static BearishHarami(o,h,l,c){
        let pattern = technicalIndicators.bearishharami;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static PiercingLine(o,h,l,c){
        let pattern = technicalIndicators.piercingline;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static BullishSpinningTop(o,h,l,c){
        let pattern = technicalIndicators.bullishspinningtop;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static BearishSpinningTop(o,h,l,c){
        let pattern = technicalIndicators.bearishspinningtop;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static MorningDojiStar(o,h,l,c){
        let pattern = technicalIndicators.MorningDojiStar;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static MorningStar(o,h,l,c){
        let pattern = technicalIndicators.morningstar;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static ThreeBlackCrows(o,h,l,c){
        let pattern = technicalIndicators.threeblackcrows;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static ThreeWhiteSoldiers(o,h,l,c){
        let pattern = technicalIndicators.threewhitesoldiers;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static BullishHammer(o,h,l,c){
        let pattern = technicalIndicators.bullishhammerstick;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static BearishHammer(o,h,l,c){
        let pattern = technicalIndicators.bearishhammerstick;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static BullishInvertedHammer(o,h,l,c){
        let pattern = technicalIndicators.bullishinvertedhammerstick;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static BearishInvertedHammer(o,h,l,c){
        let pattern = technicalIndicators.bearishinvertedhammerstick;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static HammerPattern(o,h,l,c){
        let pattern = technicalIndicators.hammerpattern;
        let set = [
            {name:'Bearish', data:{open:o,high:h,low:l,close:c}},
            {name:'Bearish Inverted', data:{open:o,high:h,low:l,close:c}},
            {name:'Bullish', data:{open:o,high:h,low:l,close:c}},
            {name:'Bullish Inverted', data:{open:o,high:h,low:l,close:c}},
        ]
        return pattern(set)
    }
    static HammerPatternUnconfirmed(o,h,l,c){
        let pattern = technicalIndicators.hammerpatternunconfirmed;
        let set = [
            {name:'Bearish', data:{open:o,high:h,low:l,close:c}},
            {name:'Bearish Inverted', data:{open:o,high:h,low:l,close:c}},
            {name:'Bullish', data:{open:o,high:h,low:l,close:c}},
            {name:'Bullish Inverted', data:{open:o,high:h,low:l,close:c}},
        ]
        return pattern(set)
    }
    static HangingMan(o,h,l,c){
        let pattern = technicalIndicators.hangingman;
        let set = [
            {name:'Bearish', data:{open:o,high:h,low:l,close:c}},
            {name:'Bullish', data:{open:o,high:h,low:l,close:c}},
        ]
        return pattern(set)
    }
    static HangingManUnconfirmed(o,h,l,c){
        let pattern = technicalIndicators.hangingman;
        let set = [
            {name:'Bearish', data:{open:o,high:h,low:l,close:c}},
            {name:'Bullish', data:{open:o,high:h,low:l,close:c}},
        ]
        return pattern(set)
    }
    static ShootingStar(o,h,l,c){
        let pattern = technicalIndicators.shootingstar;
        let set = [
            {name:'Bearish', data:{open:o,high:h,low:l,close:c}},
            {name:'Bullish', data:{open:o,high:h,low:l,close:c}},
        ]
        return pattern(set)
    }
    static ShootingStarUnconfirmed(o,h,l,c){
        let pattern = technicalIndicators.shootingstarunconfirmed;
        let set = [
            {name:'Bearish', data:{open:o,high:h,low:l,close:c}},
            {name:'Bullish', data:{open:o,high:h,low:l,close:c}},
        ]
        return pattern(set)
    }
    static TweezerTop(o,h,l,c){
        let pattern = technicalIndicators.tweezertop;
        return pattern({open:o,high:h,low:l,close:c})
    }
    static TweezerBottom(o,h,l,c){
        let pattern = technicalIndicators.tweezerbottom;
        return pattern({open:o,high:h,low:l,close:c})
    }
}
class FloorPivotInidcator{
    static getData( buffer ){
        return tw.floorPivots (points) ;
    }
}
class WilliamsRIndicator{
    static getData ( bufferH, bufferl, bufferC){
        let input = {
            high  : bufferH ,
            low   : bufferL ,
            period : 14,
            close : bufferC,
        };

        let WWR = new WilliamsR(input);
        return WWR.getResult();
    }
}
class KsiIndicator{
    static getData( closes ){
        let input = {
            values      : closes,
            ROCPer1     : 10,
            ROCPer2     : 15,
            ROCPer3     : 20,
            ROCPer4     : 30,
            SMAROCPer1  : 10,
            SMAROCPer2  : 10,
            SMAROCPer3  : 10,
            SMAROCPer4  : 15,
            signalPeriod: 9

        };
        KST = new KST(input);
        return KST.getResult();
    }
}
class MfiIndicator{
    static getData( closes, volumes){
        let close_buffer = closes;
        let volume_buffer = volumes;
        let input = {
            high  : utils.getHighs(utils.reverseData(this.rawBuffer)) ,
            low   : utils.getLows(utils.reverseData(this.rawBuffer)) ,
            period : 14,
            close : close_buffer,
            volume : volume_buffer
        };

        MFI = new MFI(input);
        return MFI.getResult();
    }
}
class ObvIndicator{
    static getData( highs, low, closes, volume ){
      
        let input = {
            high  : highs ,
            low   : low ,
            period : 14,
            close : closes,
            volume : volume
        };

        OBV = new OBV(input);
        return OBV.getResult();
    }
}
class Ema4Indicator{
    static getData( close_buffer ){
        let EMA1 = new  EMA({period : 8, values  : close_buffer});
        let EMA2 = new  EMA({period : 13, values : close_buffer});
        let EMA3 = new  EMA({period : 21, values : close_buffer});
        let EMA4 = new  EMA({period : 55, values : close_buffer});
        let EMA5 = new  EMA({period : 100, values : close_buffer});
        let EMA6 = new  EMA({period : 200, values : close_buffer});
        let object = {};
        let tmpBuffer = EMA1.getResult();

        object.ema8 = tmpBuffer;
        tmpBuffer = EMA2.getResult();
        object.ema13 = tmpBuffer;
        tmpBuffer = EMA3.getResult();
        object.ema21 = tmpBuffer;
        tmpBuffer = EMA4.getResult();
        object.ema55 = tmpBuffer;
        tmpBuffer = EMA5.getResult();
        object.ema100 = tmpBuffer;
        tmpBuffer = EMA6.getResult();
        object.ema200 = tmpBuffer;

        return object
    }
}
class Ema3Indicator{
    static getData(close_buffer){
        let EMA1 = new  EMA({period : 9, values  : close_buffer});
        let EMA2 = new  EMA({period : 21, values : close_buffer});
        let EMA3 = new  EMA({period : 55, values : close_buffer});
        let object = {};
        let tmpBuffer = EMA1.getResult();
        object.ema1 = tmpBuffer;
        tmpBuffer = EMA2.getResult();
        object.ema2 = tmpBuffer;
        tmpBuffer = EMA3.getResult();
        object.ema3 = tmpBuffe;
        return object;
    }
}
class Sma3Indicator{
    static getData( close_buffer ){
        let SMA50 =  new  SMA({period : 50, values : close_buffer});
        let SMA100 = new  SMA({period : 100, values  : close_buffer});
        let SMA200 = new  SMA({period : 200, values : close_buffer});
        let object = {};
        let tmpBuffer = SMA50.getResult();
        object.sma50 = tmpBuffer;
        tmpBuffer = SMA100.getResult();
        object.sma100 = tmpBuffer;
        tmpBuffer = SMA200.getResult();
        object.sma200 = tmpBuffer;
        return object
    }
}
class AdlIndicator{
    static getData( highs, lows, closes, volume ){
          let input= {
              high:highs,
              low:lows,
              close:closes,
              volume:volume
          }

          return ADL.calculate(input);
    }
}
class AdxIndicator{
    static  getData( highs, lows, closes ){
          let input= {
              high:highs,
              low:lows,
              close:closes,
              period:14
          }
          return ADX.calculate(input);
    }
}
class AwesomeOscillatorIndicator{
    static getData( high, low, fastPeriod =5, slowPeriod=34 ){
        let input = {
            high : high,   
            low  :  low,
            fastPeriod : 5,
            slowPeriod : 34,
            format : (a)=>parseFloat(a.toFixed(2))
          }
          return AwesomeOscillator.calculate(input)
    }
}
class CciIndicator{
    static getData( open, close, high, low, period=20 ){
        let inputCCI = {
            open : open,
            high : high,
            low : low,
            close : close,
            period : period
        };
        return CCI.calculate(input);
    }
}
class ForceIndexIndiactor{
    static getData(c,v,p=1){
       let input ={
        close : c,
        volume :v,
        period : p
       };
       return ForceIndex.calculate(input);
    }
}
class PsarIndicator{
    static getData(high, low, step =0.02, max=0.2){
        let input = { high, low, step, max };
        return PSAR.calculate(input);
    }
}
class RocIndicator{
    static getData( closes, period=12){
        return ROC.calculate({period:period, values:closes})
    }
}
class StochasticIndicator{
    static getData( high, low, close, period =14,signalPeriod=3){
        let input = {
            high: high,
            low: low,
            close: close,
            period: period,
            signalPeriod: signalPeriod
          };
          
          return Stochastic.calculate(input)
    }
}
class TrixIndicator{
    static getData( closes, period=18){
        let input = {
            values      : closes,
            period      : period
          };
          
          return TRIX.calculate(input);
    }
}
class VolumeWeightedAvgPrice{
    static getData(h,l,c,v){
        let input = {
            high :h,
            low :l,
            close : c,
            volume :v,
        };
        return VWAP.calculate(input)
    }
}
class VolumeProfile{
    static getData(o,h,l,c,v, bars=14){
        let input = {
            open:o,
            high :h,
            low :l,
            close : c,
            volume :v,
            noOfBars:bars
        };
        return VP.calculate(input)
    }
}
class WeighteMovingAvg{
    static getData( values, period=12 ){
        return WMA.calculate({period : period, values : values})
    }
}
class WildersSmoothingWeighteMovingAvg{
    static getData( values, period=5 ){
        return WMA.calculate({period : period, values : values})
    }
}
class IchimokuCloudIndicator{
    static getData(h,l,cP=9,bP=26,sP=52,displacement=26){
        let input ={
            high  :h,
            low   : l,
            conversionPeriod: cP,
            basePeriod: bP,
            spanPeriod: sP,
            displacement: displacement
        }
        return IchimokuCloud.calculate(input)
    }
}
class IndicatorUtils{
    static averageGain( values, period =14 ){
        let avgGain = technicalIndicators.AverageGain;
        return avgGain.calculate({values:values, period:period})
    }
    static averageLoss( values, period =14){
        let avgLoss = technicalIndicators.AverageLoss;
        return avgLoss.calculate({values:values, period:period})
    }
    static crossUp(current, previus){
        let crossUp = technicalIndicators.CrossUp;
        return crossUp.calculate({lineA:current, lineB:previus})
    }
    static crossDown(current, previus){
        let crossDown = technicalIndicators.CrossDown;
        return crossDown.calculate({lineA:current, lineB:previus})
    }
    static crossOver(current, previus){
        let crossOver = technicalIndicators.crossOver;
        return crossOver.calculate({lineA:current, lineB:previus})
    }
    static highest( values, period=3){
        let highest = technicalIndicators.Highest;
        return highest.calculate({values:values, period:period})
    }
    static lowest(values, period=3){
        let lowest = technicalIndicators.Lowest;
        return lowest.calculate({values:values, period:period})
    }
    static stdDev(values, period=5){
        let stdev = technicalIndicators.SD;
        return stdev.calculate({values:values, period:period})
    }
    static sum(values, period=3){
        let sum = technicalIndicators.Sum;
        return sum.calculate({values:values, period:period})
    }
}

class IndicatorBuilder{
    static build( indicator, candles ){
        switch( indicator ){
            case "rsi" : { return RsiIndicator.getData( utils.closes( candles ))}  break;
            case "atr" : { return AtrIndicator.getData( utils.highs( candles ), utils.lows( candles), utils.closes( candles )) } break;
            case "woodies" : { return WoodiesPointsIndicator.getData( candles )} break;
            case "bollinger" :{ return BollingerIndicator.getData( utils.closes( candles ))} break;
            case "macd" : { return MacdIndicator.getData( utils.closes( candles )) } break;
            case "floorPivots": { return FloorPivotInidcator.getData( candles ) } break;
            case "williamsR" :{ return WilliamsRIndicator.getData( utils.highs( candles ), utils.lows( candles), utils.closes( candles ))} break;
            case "ksi": { return KsiIndicator.getData( utils.closes( candles ))} break;
            case "mfi": { return KsiIndicator.getData( utils.closes( candles ), utils.volume( candles )) } break;
            case "obv": { return AtrIndicator.getData( utils.highs( candles ), utils.lows( candles), utils.closes( candles ),utils.volume( candles ) ) } break;
            case "ema4": { return Ema4Indicator.getData( utils.closes( candles )) } break;
            case "ema3": { return Ema3Indicator.getData( utils.closes( candles )) } break;
            case "sma3": { return Sma3Indicator.getData( utils.closes( candles )) } break;
            case "adl": {  return AdlIndicator.getData( utils.highs( candles ), utils.lows( candles), utils.closes( candles ),utils.volume( candles ) ) } break;
            case "adx": { return AdxIndicator.getData( utils.highs( candles ), utils.lows( candles), utils.closes( candles ) )} break;
            case "awesomOsc": { return AwesomeOscillatorIndicator.getData( utils.highs( candles ), utils.lows( candles) ) } break;
            case "cci": { return CciIndicator.getData( utils.open(candles),  utils.closes( candles ) , utils.highs( candles ), utils.lows( candles)) }  break;
            case "stochastic":{  return Stochastic.getData( utils.highs( candles ), utils.lows( candles), utils.closes( candles ) ) } break;
            case "ichimoko": { return IchimokuCloud.getData( utils.highs( candles ), utils.lows( candles) ) } break;
            case "wildersmoothingMA": { return WildersSmoothingWeighteMovingAvg.getData( utils.closes( candles )) } break;
            case "weightedMA":{ return WeighteMovingAvg.getData( utils.closes( candles ))} break;
            case "vp":{ return VolumeProfile.getData( utils.highs( candles ), utils.lows( candles), utils.closes( candles ),utils.volume( candles ) ) } break;
            case "volumeProfileAvg":{ return VolumeWeightedAvgPrice.getData( utils.highs( candles ), utils.lows( candles), utils.closes( candles ),utils.volume( candles ) ) } break;
            case "trix":{  return TrixIndicator.getData( utils.closes( candles )) } break;
            case "forceIndex":{ return ForceIndexIndiactor.getData( utils.closes( candles ), utils.volume( candles ))} break;
            case "roc":{ return RocIndicator.getData( utils.closes( candles )) } break;
            case "psar":{ return PsarIndicator.getData( utils.highs( candles ), utils.lows( candles)  )  } break;
            default: { return RsiIndicator.getData( utils.closes( candles )) } break;
        }
    }
}
module.exports = {
    RsiIndicator:RsiIndicator,
    AtrIndicator:AtrIndicator,
    WoodiesPointsIndicator:WoodiesPointsIndicator,
    BollingerIndicator:BollingerIndicator,
    MacdIndicator:MacdIndicator,
    PatternRecognitionIndicator:PatternRecognitionIndicator,
    FloorPivotInidcator:FloorPivotInidcator,
    WilliamsRIndicator:WilliamsRIndicator,
    KsiIndicator:KsiIndicator,
    MfiIndicator:MfiIndicator,
    ObvIndicator:ObvIndicator,
    Ema4Indicator:Ema4Indicator,
    Ema3Indicator:Ema3Indicator,
    Sma3Indicator:Sma3Indicator,
    AdlIndicator:AdlIndicator,
    AdxIndicator:AdxIndicator,
    AwesomeOscillatorIndicator:AwesomeOscillatorIndicator,
    CciIndicator:CciIndicator,
    StochasticIndicator:StochasticIndicator,
    IchimokuCloudIndicator:IchimokuCloudIndicator,
    WildersSmoothingWeighteMovingAvg:WildersSmoothingWeighteMovingAvg,
    WeighteMovingAvg:WeighteMovingAvg,
    VolumeProfile:VolumeProfile,
    VolumeWeightedAvgPrice:VolumeWeightedAvgPrice,
    TrixIndicator:TrixIndicator,
    ForceIndexIndiactor:ForceIndexIndiactor,
    RocIndicator:RocIndicator,
    PsarIndicator:PsarIndicator,
    IndicatorUtils:IndicatorUtils,
    IndicatorBuilder:IndicatorBuilder


};
