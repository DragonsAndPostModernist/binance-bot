let WebController = require("../lib/routing/routes");
let Service = require("../service/api/BotService");

WebController.get("/bots", async function( req, res ){ Service.get( req, res ) });
WebController.get("/bots/:name", async function( req, res ){  Service.getByNAme( req, res ) });
WebController.get("/history/:interval/:start/:end", async function( req, res ){});

WebController.post("/bot",   async function( req, res ){  Service.post( req, res ) });
WebController.patch("/bot",  async function( req, res ){  Service.patch( req, res ) });
WebController.delete("/bot", async function( req, res ){   Service.delete( req, res ) });

module.exports = WebController;