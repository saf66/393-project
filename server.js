var http = require('http');
var users = {};
var games = {};

function shuffle(v) {
	for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
	return v;
}

var functions = {

	newUser: function (data) {
		var id = new Date().getTime().toString();
		users[id] = {
			paired: false,
			partner: '',
			color: -1,
			game: ''
		};
		console.log('new user: ' + id);
		return id;
	},

	pairUser: function (data) {
		if (users[data.ID] && users[data.ID].paired)
			return users[data.ID];
		var ids = [];
		for (var id in users)
			if (!users[id].paired && id != data.ID)
				ids.push(id);
		if (ids.length == 0)
			return null;
		var id = shuffle(ids)[0]
		users[id].paired = true;
		users[id].partner = data.ID;
		users[data.ID].paired = true;
		users[data.ID].partner = id;
		if (Math.random() > 0.5) {
			users[id].color = 0;
			users[data.ID].color = 1;
		} else {
			users[id].color = 1;
			users[data.ID].color = 0;
		}
		// create game entry for this pair
		var game = data.ID + '' + id;
		console.log('new game: ' + game);
		games[game] = {
			players: [data.ID, id],
			turn: 1,
			state: []
		};
		users[id].game = game;
		users[data.ID].game = game;
		return users[data.id];
	},

	getGame: function (data) {
		return games[data.game];
	},

	setGame: function (data) {
		console.log('setting game state for: ' + data.game);
		games[data.game].state = data.state;
		games[data.game].turn = data.turn;
		return null;
	}
}

http.createServer(function (req, res) {

	var data = JSON.parse(unescape(req.url.split('data=')[1].split('&')[0]));
	data = functions[data.command](data);

	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end("_cb('" + JSON.stringify(data) + "')");

//TODO: remove the '127.0.0.1' parameter for production
}).listen(8000, '127.0.0.1');

