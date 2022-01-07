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

server.add("/gps/map", (req, res) => {

	
	fs.readFile('./gps/index.html', function (err, html) {
		if (err)
			throw err;
		res.writeHeader(200, {"Content-Type": "text/html",'Content-Length': html.length});
		res.write(html);
		res.end();
	});

})

class Pos {
	constructor(latitude, longitude) {
		this.date = Date.now();
		this.latitude = latitude;
		this.longitude = longitude;
	}
	
	get getCity() {
		return ("Paris");
	}
	
}

function getDistanceFromLatLonInKm(pos1, pos2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(pos2.latitude-pos1.latitude);
	var dLon = deg2rad(pos2.longitude-pos1.longitude); 
	var a = 
	Math.sin(dLat/2) * Math.sin(dLat/2) +
	Math.cos(deg2rad(pos1.latitude)) * Math.cos(deg2rad(pos2.latitude)) * 
	Math.sin(dLon/2) * Math.sin(dLon/2)
	; 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // km
	return d + 0.0;
}

function deg2rad(deg) {
	return deg * (Math.PI/180)
}

server.add("/gps/post", async (req, res, url) => {
	if (!req.method.includes("POST")) {
		res.writeHead(405, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({status: 405, data: 'Hello User!'}));
		return;
	}

	// GET BODY
	const buffers = [];
	for await (const chunk of req)
		buffers.push(chunk);
	const body = JSON.parse(Buffer.concat(buffers).toString());

	let newpos = new Pos(body.latitude, body.longitude);
	let rawdata = fs.readFileSync('gps/pos.json');
	let data = JSON.parse(rawdata);
	console.log(newpos);
	let lastpos = new Pos(data[Object.keys(data).length - 1].latitude, data[Object.keys(data).length - 1].longitude)
	console.log(getDistanceFromLatLonInKm(lastpos, newpos));
	if (getDistanceFromLatLonInKm(lastpos, newpos) > 0.01)
		data.push(newpos);
	fs.writeFileSync("gps/pos.json", JSON.stringify(data, undefined, 2));
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify({status: 200, data: 'Hello Android!'}));
})