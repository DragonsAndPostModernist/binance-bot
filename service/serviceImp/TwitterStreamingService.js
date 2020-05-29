const TwitterStream = require("twitter-stream-api");
const colors = require("colors");
const chalk = require("chalk");
let keys = {
    consumer_key : process.env.CONSUMER_KEY,
    consumer_secret : process.env.CONSUMER_SECRET,
    token : process.env.TOKEN,
    token_secret : process.env.TOKEN_SECRET
};

let filters = '@realDonaldTrump';

const buildDisplayText = (data) =>{
      console.log("\n")
      console.log("*******      ".grey+ "WHALE ALERT !!!".red+"       *******".grey)
      console.log(" Created At  : ".yellow+" " + data.created_at.toString().blue) || new Date();
      console.log(" Location    : ".yellow+" " + data.user.cyan);
      console.log(" News Flash  : ".yellow+" " + data.text.cyan);
      if(data.extended_tweet && data.extended_tweet.full_text){
                  console.log( " Full News   : ".yellow +data.extended_tweet.full_text.grey);
      }
}
class Streamer {

    constructor(){}
    static getWhaleAlertInstance(){
        return new Streamer( )
    }
    filter( filter ){
        filters = filter;
        return this;
    }

    stream(){

        const Twitter = new TwitterStream(keys);
        
        Twitter.stream('statuses/filter', {
            follow: ['1039833297751302144'],
            track:["transferred from"]
        });
        
        Twitter.on('connection rate limit', function (httpStatusCode) {
            console.log('connection rate limit', httpStatusCode);
        });

        Twitter.on('data', function (obj) {
            buildDisplayText(obj)
        });
    }
}

module.exports ={
    Streamer:Streamer
}