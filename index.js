const http = require("http");
const fs = require('fs');
const Logger = require("./Logger.js");
const Server = require("./Server.js");

const logger = new Logger();
var server = new Server(8080)

server.add("/favicon.ico", () => {return; });
server.add("/gps", (req, res) => {
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify({data: 'Hello GPS!'}));
})

class Pos {
	constructor(longitude, latitude, date) {
		this.date = date;
		this.longitude = longitude;
		this.latitude = latitude;
	}
	
	get getCity() {
		return ("Paris");
	}
	
}

server.add("/", (req, res, url) => {
	console.log(url.href)
	let rawdata = fs.readFileSync('gps/pos.json');
	let pos = JSON.parse(rawdata);
	pos.push(new Pos(10, 10, Date.now()));
	fs.writeFileSync("gps/pos.json", JSON.stringify(pos, undefined, 2));
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify({data: 'Hello Android!'}));
});