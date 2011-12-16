var Network = {

	//TODO Change as necessary
	server: 'http://127.0.0.1:8000',
	ID: null,
	gameID: null,
	offline: true,
	interval: null,

	send: function (data, cb_success, cb_error) {
		$.ajax({
			url: Network.server + '/?data=' + escape(JSON.stringify(data)),
			dataType: 'jsonp',
			jsonpCallback: '_cb',
			cache: false,
			timeout: 5000,
			success: cb_success,
			error: cb_error
		});
	},

	initialize: function () {
		$('#online').html('connecting...');
		Network.send({
				command: 'newUser'
			},
			function (data) {
				Network.ID = JSON.parse(data);
				console.log('user ID: ' + Network.ID);
				Network.offline = false;
				$('#online').html('waiting for another user...');
				Network.interval = setInterval(Network.pairUser, 1000);
			},
			function (jqXHR, textStatus, errorThrown) {
				console.log(textStatus + ' ' + errorThrown);
				Network.offline = true;
				$('#online').html('failed to contact server');
			}
		);
	},

	// wait for the server to pair us up with another user
	pairUser: function () {
		clearInterval(Network.interval);
		Network.send({
				command: 'pairUser',
				ID: Network.ID
			},
			function (data) {
				if (data == 'undefined') {
					Network.interval = setInterval(Network.pairUser, 1000);
					return;
				}
				var me = JSON.parse(data);
				if (me != null) {
					console.log('user object: ' + data);
					clearInterval(Network.interval);
					$('#online').html('paired!');
					// reset game
					Network.gameID = me.game;
					Game.state = [];
					Game.turn = 1;
					Game.color = me.color;
					Game.initialize();
				} else {
					Network.interval = setInterval(Network.pairUser, 1000);
				}
			},
			function (jqXHR, textStatus, errorThrown) {
				console.log(textStatus + ' ' + errorThrown);
				clearInterval(Network.interval);
				Network.offline = true;
				$('#online').html('connection lost');
			}
		);
	},

	// wait for the other player to make a move
	waitMove: function () {
		clearInterval(Network.interval);
		Network.send({
				command: 'getGame',
				game: Network.gameID
			},
			function (data) {
				var game = JSON.parse(data);
				// check if it's our turn yet
				if (game.turn == Game.color) {
					clearInterval(Network.interval);
					Game.turn = game.turn;
					Game.state = game.state;
					Game.draw();
					$('#turn').html('Current turn: ' + Game.colorString(Game.turn));
				} else {
					Network.interval = setInterval(Network.waitMove, 1000);
				}
			},
			function (jqXHR, textStatus, errorThrown) {
				console.log(textStatus + ' ' + errorThrown);
				clearInterval(Network.interval);
				Network.offline = true;
				$('#online').html('connection lost');
			}
		);
	},

	// send the current game state to the server
	sendState: function () {
		$('#turn').html('Current turn: ' + Game.colorString(Game.turn));
		Network.send({
				command: 'setGame',
				game: Network.gameID,
				state: Game.state,
				turn: Game.turn
			},
			function (data) {
				// wait for opponent to move
				Network.interval = setInterval(Network.waitMove, 1000);
			},
			function (jqXHR, textStatus, errorThrown) {
				console.log(textStatus + ' ' + errorThrown);
				clearInterval(Network.interval);
				Network.offline = true;
				$('#online').html('connection lost');
			}
		);
	}

}

//Network.initialize()

