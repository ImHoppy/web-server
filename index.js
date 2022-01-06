const http = require("http");
const Logger = require("./Logger.js");
const Server = require("./Server.js");

const logger = new Logger();
var server = new Server(8080)

server.add("/favicon.ico", () => {return; });
server.add("/gps", (req, res) => {
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify({data: 'Hello Woffrld!'}));
})
server.add("/gps/push", () => console.log("42"))