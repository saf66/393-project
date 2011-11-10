var Game = {

	// game state variables
	pieces: {
		//TODO: add valid moves for each piece
		king: {
			grid: [0, 0],
			color: 0,
			moves: []
		},
		rook: {
			grid: [0, 0],
			color: 0,
			moves: []
		},
		bishop: {
			grid: [0, 0],
			color: 0,
			moves: []
		},
		queen: {
			grid: [0, 0],
			color: 0,
			moves: []
		},
		knight: {
			grid: [0, 0],
			color: 0,
			moves: []
		},
		pawn: {
			grid: [0, 0],
			color: 0,
			moves: []
		},
	},
	state: [],
	turn: 0,

	// graphics variables
	canvas: document.getElementById('canvas'),
	ctx: null,

	// initialize all game variables
	initialize: function () {
		console.log('initialize');

		// check if canvas is supported
		if (canvas && canvas.getContext) {
			this.ctx = this.canvas.getContext('2d');

			// draw the game board
			var baseX = 0.5, baseY = 0.5, width = this.canvas.width / 8;
			for (var i = 0; i < 8; i++) {
				for (var j = 0; j < 8; j++) {
					var x = baseX + width * i, y = baseY + width * j;
					this.ctx.strokeRect(x, y, width, width);
					if ((i + j) % 2 != 0) {
						this.ctx.fillRect(x, y, width, width);
					}
				}
			}

			// clear the game state
			for (var i = 0; i < 8; i++) {
				this.state[i] = [];
				for (var j = 0; j < 8; j++) {
					this.state[i][j] = null;
				}
			}

			//TODO: set initial game state
			this.state[0][0] = this.pieces.pawn;
		}
	},

	// load content, graphics, sound etc.
	loadContent: function () {
		console.log('loadContent');

		// add click event listener to the canvas
		$(this.canvas).bind('click', this.choosePiece);
	},

	// pick up a game piece with the mouse
	choosePiece: function (event) {
		var pos = Game.getPosition(event);
		var grid = Game.getGrid(pos);
		console.log('choosePiece: %o', grid);

		//TODO: check if there's a piece here
		//TODO: check if current player is allowed to select that piece
		if (true) {
			// unbind the current click listener
			$(Game.canvas).unbind('click', Game.choosePiece);

			// snap to mouse; next click sets down the piece
			$(Game.canvas).bind('mousemove', Game.movePiece);
			$(Game.canvas).bind('click', Game.placePiece);
		}
	},

	// make the piece follow the mouse position
	movePiece: function (event) {
		var pos = Game.getPosition(event);
		//TODO: draw piece at these coordinates
	},

	placePiece: function (event) {
		var pos = Game.getPosition(event);
		var grid = Game.getGrid(pos);
		console.log("placePiece: %o", grid);

		//TODO: check if the player is allowed to place the piece here
		if (true) {
			// unbind the current listeners
			$(Game.canvas).unbind('mousemove', Game.movePiece);
			$(Game.canvas).unbind('click', Game.placePiece);

			// next click picks up piece
			$(Game.canvas).bind('click', Game.choosePiece);
		}
	},

	// get the position of a click event in pixels
	getPosition: function (event) {
		return [event.offsetX, event.offsetY];
	},

	// compute grid location given coordinates in pixels
	getGrid: function (pos) {
		var w = this.canvas.width / 8;
		return [Math.floor(pos[0] / w), Math.floor(pos[1] / w)];
	}
}

Game.initialize();
Game.loadContent();

