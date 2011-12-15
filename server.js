var http = require('http');
var users = {};
var games = {};

var functions = {
	newUser: function (data) {
		var id = new Date().getTime().toString();
		users[id] = {};
		console.log('new user: ' + id);
		return id;
	}
}

http.createServer(function (req, res) {

	data = JSON.parse(unescape(req.url.split('data=')[1].split('&')[0]));
	data = functions[data.command](data);

	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end("_cb('" + JSON.stringify(data) + "')");

//TODO Remove the '127.0.0.1' parameter for production
}).listen(8000, '127.0.0.1');

