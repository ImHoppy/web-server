class Logger {
	constructor()
	{
		this.color = {
			"Reset": "\x1b[0m",
			"Bright": "\x1b[1m",
			"Dim": "\x1b[2m",
			"Underscore": "\x1b[4m",
			"Blink": "\x1b[5m",
			"Reverse": "\x1b[7m",
			"Hidden": "\x1b[8m",
			"FgBlack": "\x1b[30m",
			"FgRed": "\x1b[31m",
			"FgGreen": "\x1b[32m",
			"FgYellow": "\x1b[33m",
			"FgBlue": "\x1b[34m",
			"FgMagenta": "\x1b[35m",
			"FgCyan": "\x1b[36m",
			"FgWhite": "\x1b[37m"
		}
	}

	padding(time) {
		if (time < 10)
			return ("0" + time)
		else
			return (time);
	}

	getLogTime() {
		var time = new Date(Date.now());
		return (`${this.color.FgCyan}[${this.padding(time.getHours())}:${this.padding(time.getMinutes())}:${this.padding(time.getSeconds())}]${this.color.Reset}`);
	}

	log(s) {
		console.log(`\n${this.getLogTime()}${this.color.FgGreen} ${s}${this.color.Reset}`)
	}

	error(s) {
		console.log(`${this.getLogTime()}${this.color.FgRed} ${s}${this.color.Reset}`)
	}
}
module.exports = Logger;