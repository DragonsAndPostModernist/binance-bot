const Repository = require("../../repository/Repository");
const E = require("../../rest-exception/Errors")
let utils = require("../../lib/Utils");
const getResponseContext = (status, data, reasonPhrase = "ok", links) =>{
    return {
        status:status,
        links: links,
        reasonPhrase:reasonPhrase,
        response:{ data:data,code:status}
    }
};

const getProtocolInfo = (req) =>{
    return req.protocol + '://' + req.get('host') + req.originalUrl;
};

let Service = {
    get:      async function( req, res ){
        try{
            let result = await Repository.getAll("bots"); // NoSql based database
            let data =  getResponseContext(200, result, 'success' ,  getProtocolInfo(req));
            res.json( data );
        }catch(err){
            log.error(err);
            return  E.ServerError(res)
        }
    },
    getByNAme:async function( req, res ){
        try{
            if( !( utils.objectCheck(req,'params') && utils.objectCheck(req.params,'name'))){
                return E.BadRequest(res, 'Bad request');
            }else{
                let model = await Repository.getBy("bots",{symbol:req.params.name}); // NoSql based database
                if( model == null ){ return E.EntityNotFound(res); }
                let data =  getResponseContext(200, model, 'success' ,  getProtocolInfo(req));
                res.json( data );
            }
        }catch( err ){
            log.error(err);
            return E.ServerError(res)
        }
    },
    post:     async function( req, res ){
        try{
            let models = require("../../model/models.json").botConfig
            let botDetails = req.body;
            console.log(Object.keys(botDetails))
            console.log(Object.keys(require("../../model/models.json").botConfig));
            if (utils.objectCheck(botDetails, Object.keys(require("../../model/models.json").botConfig))) {
                let check = await Repository.getBy("bots", {name: botDetails.name});
                if (check != null) {
                    return E.Generic(res, 400, "A Bot with that name already exists");
                }
                botDetails = utils.sanitize( botDetails );
                const result = await Repository.add("bots", botDetails);
                let data =  getResponseContext(200, result, 'success' ,  getProtocolInfo(req));
                res.json( data );
            }else{
                return E.BadRequest(res);
            }
        }catch( err ){
            log.error(err);
            return E.ServerError(res)
        }
    },
    patch:    async function( req, res ){
        try {
            if( !( utils.objectCheck(req,'params') && utils.objectCheck(req.params,'name'))){
                return E.BadRequest(res );
            }
            let model = await Repository.getBy("bots",{name:req.params.name}); // NoSql based database
            if(model == null ){ return E.EntityNotFound(res); }
            let keys= Object.keys(req.body);
            if( !utils.objectCheck(model,keys )){
                return E.Generic(res,400,"Domain Context Constraint Violation: Bad Request");
            }
            keys.forEach((key) =>{
                model[key] = utils.sanitize(req.body[key]);
            });
            let result = await Repository.update("bots",{ _id:model._id }, model ); // NoSql based database
            let data = getResponseContext(201, result, 'updated', getProtocolInfo(req));
            res.json( data );
        }catch( err ){
            log.error(err);
            return E.ServerError(res)
        }
        
    },
    delete:   async function( req, res ){
        try{
            if(!(utils.objectCheck(req,'params') && utils.objectCheck(req.params,'name'))){
                return E.BadRequest(res);
            }
            let model = await Repository.getBy("bots",{name:req.params.name}); // NoSql based database
            if(model == null ){
                return E.EntityNotFound(res);
            }
            let result = await Repository._delete("bots",{ _id:model._id }); // NoSql based database
            let data = getResponseContext(200, result, 'deleted', getProtocolInfo(req));
            res.json( data )
        }catch( err ){
            log.error(err);
            return E.ServerError(res)
        }
        
    }
}

module.exports = Service;
