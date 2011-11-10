function clone(obj) {
	if (null == obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
}

var Game = {

	// game state variables
	pieces: {
		//TODO: add valid moves for each piece
		king: {
			color: 0,
			moves: []
		},
		rook: {
			color: 0,
			moves: []
		},
		bishop: {
			color: 0,
			moves: []
		},
		queen: {
			color: 0,
			moves: []
		},
		knight: {
			color: 0,
			moves: []
		},
		pawn: {
			color: 0,
			moves: []
		},
	},
	state: [],
	turn: 0,
	previous: null,

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
			this.state[0][0] = clone(this.pieces.pawn);
			this.state[1][0] = clone(this.pieces.pawn);
			this.state[1][0].color = 1;
			this.state[2][0] = clone(this.pieces.pawn);

			//TODO: draw current state
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

		// check if there's a piece here
		var piece = Game.getPieceAt(grid);
		if (piece == null) {
			return;
		}
		console.log('piece detected: %o', piece);

		// check if current player is allowed to select that piece
		if (piece.color != Game.turn) {
			console.log('tried to select opponent piece');
			return;
		}

		// unbind the current click listener
		$(Game.canvas).unbind('click', Game.choosePiece);

		// snap to mouse; next click sets down the piece
		$(Game.canvas).bind('mousemove', Game.movePiece);
		$(Game.canvas).bind('click', Game.placePiece);

		// store coordinates
		Game.previous = grid;
	},

	getPieceAt: function (grid) {
		return Game.state[grid[0]][grid[1]];
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

		// check if there's a piece here
		var piece = Game.getPieceAt(grid);
		if (piece != null) {
			// check who the piece belongs to
			if (piece.color == Game.turn) {
				console.log('place on your piece');
				//TODO: check if
			} else {
				console.log('place on opponent piece');
			}
		}

		//TODO: check if the move is valid according to game rules

		// unbind the current listeners
		$(Game.canvas).unbind('mousemove', Game.movePiece);
		$(Game.canvas).unbind('click', Game.placePiece);

		// next click picks up piece
		$(Game.canvas).bind('click', Game.choosePiece);

		// next turn
		Game.turn++;
		Game.turn = Game.turn % 2;
		console.log('turn: %o', Game.turn);
	},

	// get the position of a click event in pixels
	getPosition: function (event) {
		return [event.offsetX, event.offsetY];
	},

	// compute grid location given coordinates in pixels
	getGrid: function (pos) {
		var tile = this.canvas.width / 8;
		return [Math.floor(pos[0] / tile), Math.floor(pos[1] / tile)];
	},

	// draw the current state to the canvas
	draw: function () {
		console.log("draw");

		var tile = this.canvas.width / 8;
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				var piece = Game.state[i][j];
				if (piece != null) {
					var pos = [piece.grid[0] * tile, piece.grid[1] * tile];
					//TODO: draw game piece at this position
				}
			}
		}
	}
}

Game.initialize();
Game.loadContent();

