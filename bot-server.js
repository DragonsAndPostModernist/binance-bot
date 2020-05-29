require('dotenv').config();
let express = require('express');
let app = express();
let HttpLogger = require("./lib/HttpLogger");
let Repository = require("./repository/Repository");
let { SocketService } = require("./service/socket/SocketService");
let log = require("./lib/logger");
let controllers  = [];
let socketPool = [];
let io = null;
let options = {
    explorer: true
};
const port = process.env.PORT || 3000;
global.home_dir = __dirname;
global.connectionPool = [];
// Use Api routes in the App
const glob = require('glob')
    , path = require('path');

glob.sync( './controller/**/*.js' ).forEach( function( file ) {
  controllers = require( path.resolve( file ) );
});

process.on('SIGINT' || 'SIGTERM' || 'SIGKILL', function () {
    console.info('Termination signal received.');
    console.log('Closing Service');
    server.close(function () {
        console.log('Terminating active database connections');
        connectionPool.forEach((poolInstance)=>{
            poolInstance.close(poolInstance.connection);
        });
        process.exit(0);
    });
});



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname+'/portal/public/www'));
app.use(HttpLogger);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/portal/public/www/index.html');
});

app.use('/api/v1',controllers);

// Launch app to listen to specified port
const server = require('http').createServer(app);
io  = require('socket.io')(server);
let socketService = SocketService.builder().setFrontendSocket(io);
server.listen( port , () => {
    log.info('Server  listening on port '+port + " ")
   
    log.info('visit http://localhost:'+port + "/")
});
