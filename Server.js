const Logger = require("./Logger.js")
const http = require("http");
const { URL } = require("url");
const logger = new Logger();

class Server {
	
	constructor(port) {
		this.port = port;
		this.handle = http.createServer(this.requestListener);
		this.handle.back = this;
		this.handle.listen(port, () => {
			logger.log(`Server running at http://localhost:${port}/`)
		   });
		this.pathFunc = {}
	}

	requestListener(req, res) {
		var url = new URL(req.url, `http://${req.headers.host}`);
		logger.log(`Get request from ${url.pathname} and ${this.back.pathFunc[url.pathname] ? "is defined" : `is${logger.color.FgYellow} undefined`}`)
		if (this.back.pathFunc[url.pathname])
			this.back.pathFunc[url.pathname](req, res, url);
		else {
			res.writeHead(404, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({result: 404}));
		}
	}

	add(path, callback) {
		logger.log("add " + path)
		if (!this.pathFunc[path])
			this.pathFunc[path] = callback;
	}
}
module.exports = Server;