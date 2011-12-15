var http = require('http');
var users = {};
var games = {};

var functions = {

	newUser: function (data) {
		var id = new Date().getTime().toString();
		users[id] = {
			paired: false,
			partner: ''
		};
		console.log('new user: ' + id);
		return id;
	},

	pairUser: function (data) {
		if (users[data.ID] && users[data.ID].paired)
			return users[data.ID].partner;
		for (var id in users) {
			if (!users[id].paired && id != data.ID) {
				users[id].paired = true;
				users[id].partner = data.ID;
				users[data.ID].paired = true;
				users[data.ID].partner = id;
				//TODO: create game entry for this pair
				return id;
			}
		}
		return null;
	}
}

http.createServer(function (req, res) {

	data = JSON.parse(unescape(req.url.split('data=')[1].split('&')[0]));
	data = functions[data.command](data);

	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end("_cb('" + JSON.stringify(data) + "')");

//TODO: remove the '127.0.0.1' parameter for production
}).listen(8000, '127.0.0.1');

