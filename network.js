var Network = {

	//TODO Change as necessary
	server: 'http://127.0.0.1:8000',
	ID: null,
	offline: false,

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
		Network.send({
				command: 'newUser'
			},
			function (data) {
				console.log(data);
				Network.ID = JSON.parse(data);
			},
			function (jqXHR, textStatus, errorThrown) {
				console.log(textStatus + ' ' + errorThrown);
				console.log('unable to assign network ID, switching to offline mode');
				Network.offline = true;
			}
		);
	}

}

Network.initialize()

