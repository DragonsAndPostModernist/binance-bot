/*jshint esversion: 6 */
log = require("../lib/logger");

/**   HTTP ERRORS START     */
module.exports.BadRequest = (res, msg)=> {
    res.status(400).json({ message: msg || "Bad Requests" });
};
  
module.exports.Unauthenticated =(res) =>{
    res.status(401).json({message: 'Unauthorized' });
};
module.exports.Forbidden =(res, msg) => {
    res.status(403).json({ message: msg || "Forbidded" });
};
  
module.exports.NotFound= (res, msg)  =>{
    res.status(404).json({ message:msg || "Not Found" });
};
  
module.exports.TooManyRequests = (res, msg) => {
    res.status(429).json({ message:msg || "To Many Requests" });
};
  
module.exports.ServerError = (res, msg) => {
    res.status(500).json({ message:msg || "Server Error" });
};
  
module.exports.BadGateway = (res, msg) => {
    res.status(502).json({ message: msg ||"Bad Gateway" });
};
  
module.exports.ServiceUnavailable = (res, msg) =>{
    res.status(503).json({ message:msg || "Service unavailable" });
};
module.exports.EntityNotFound = (res)=> {
    res.status(400).json({ message: msg ||"Entity Not found Exception" });
};

module.exports.NoAPIKeys = (res)=> {
    res.status(400).json({ message: "No Api Keys found" });
};

module.exports.Generic = (res,code, msg) =>{
    res.status(code).json({ message: msg || "Unexpected Error" });
}; 

/*** *************** HTTP ERRORS END   */


/**
 * RUNTIME ERRORS START
 */
 
module.exports.RuntimeError = (_type,_code, _msg, _stack, _log=false) =>{
    if(!_log){
        throw new Error(JSON.stringify({type:_type, code:_code, message:_msg,stacktrace:_stack}),null,2);
    }else{
         log.error({type:_type, code:_code, message:_msg,stacktrace:_stack});
    }
}; 