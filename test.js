jQuery.fn.log = function (msg) {
	console.log("%s: %o", msg, this);
	return this;
};

var Game = {
	Initialize: function () {
		console.log('Initialize');
		// initialize all game variables
		var canvas = document.getElementById('canvas');
		var ctx = null;
		if (canvas && canvas.getContext) {
			// check whether browser support getting canvas context
			ctx = canvas.getContext('2d');

			ctx.fillStyle = "rgb(200,0,0)";
			ctx.fillRect(10, 10, 55, 50);

			ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
			ctx.fillRect(30, 30, 55, 50);
		}
	},

	LoadContent: function () {
		console.log('LoadContent');
		// load content, graphics, sound etc.
		var ourGame = this;
		$(document).bind('keyup', function (event) {
			ourGame.Update(event);
			ourGame.Draw();
		});
	},

	Update: function (event) {
		console.log('Update: %o', event.keyCode);
		// update game variables, handle user input, perform calculations etc.
	},

	Draw: function () {
		console.log('Draw');
		// draw game frame
	}
}

Game.Initialize();
Game.LoadContent();

