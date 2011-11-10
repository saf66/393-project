jQuery.fn.log = function (msg) {
	console.log("%s: %o", msg, this);
	return this;
};

var Game = {

	// position of pieces and game state
	board: [],
	state: 0,

	// graphics variables
	canvas: document.getElementById('canvas'),
	ctx: null,

	// initialize all game variables
	Initialize: function () {
		console.log('Initialize');

		// check if canvas is supported
		if (canvas && canvas.getContext) {
			this.ctx = this.canvas.getContext('2d');

			// draw the game board
			var baseX = 0.5, baseY = 0.5, width = 50;
			for (var i = 0; i < 8; i++) {
				for (var j = 0; j < 8; j++) {
					var x = baseX + width * i, y = baseY + width * j;
					this.ctx.strokeRect(x, y, width, width);
					if ((i + j) % 2 != 0) {
						this.ctx.fillRect(x, y, width, width);
					}
				}
			}
		}
	},

	// load content, graphics, sound etc.
	LoadContent: function () {
		console.log('LoadContent');

		// add click event listener to the canvas
		var g = this;
		$(g.canvas).bind('click', function (event) {
			g.Update(event);
			g.Draw();
		});
	},

	// update game variables, handle user input, perform calculations etc.
	Update: function (event) {
		var pos = [event.offsetX, event.offsetY];
		console.log('Update: click at (%d, %d)', pos[0], pos[1]);

		//TODO: compute grid location of click
		//TODO: depending on state, either snap piece to mouse position or place piece
	},

	// draw game frame
	Draw: function () {
		console.log('Draw');

		//TODO: clear board
		//TODO: draw pieces
	}
}

Game.Initialize();
Game.LoadContent();

