var Network = {

	//TODO Change as necessary
	server: 'http://127.0.0.1:8000',
	ID: null,
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
				Network.interval = setInterval(Network.userWait, 1000);
			},
			function (jqXHR, textStatus, errorThrown) {
				console.log(textStatus + ' ' + errorThrown);
				Network.offline = true;
				$('#online').html('failed to contact server');
			}
		);
	},

	// wait for the server to pair us up with another user
	userWait: function () {
		Network.send({
				command: 'pairUser',
				ID: Network.ID
			},
			function (data) {
				id = JSON.parse(data);
				if (id != null) {
					console.log('partner ID: ' + id);
					clearInterval(Network.interval);
					$('#online').html('paired!');
					//TODO: clear game state, see who goes first, go into getState() loop
				}
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

