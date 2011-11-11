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
			type: 'king',
			color: 0,
			moves: []
		},
		rook: {
			type: 'rook',
			color: 0,
			moves: []
		},
		bishop: {
			type: 'bishop',
			color: 0,
			moves: []
		},
		queen: {
			type: 'queen',
			color: 0,
			moves: []
		},
		knight: {
			type: 'knight',
			color: 0,
			moves: []
		},
		pawn: {
			type: 'pawn',
			color: 0,
			moves: []
		},
	},
	state: [],
	turn: 1,
	previous: {
		piece: null,
		grid: null
	},

	// graphics variables
	canvas: document.getElementById('canvas'),
	ctx: null,

	// initialize all game variables
	initialize: function () {
		console.log('initialize');

		// check if canvas is supported
		if (canvas && canvas.getContext) {
			Game.ctx = Game.canvas.getContext('2d');
			Game.ctx.save();

			// clear the game state
			for (var i = 0; i < 8; i++) {
				Game.state[i] = [];
				for (var j = 0; j < 8; j++) {
					Game.state[i][j] = null;
				}
			}

			// set initial game state
			var a = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
			for (var i = 0; i < a.length; i++) {
				Game.state[i][0] = clone(Game.pieces[a[i]]);
				Game.state[i][7] = clone(Game.pieces[a[i]]);
			}
			for (var i = 0; i < 8; i++) {
				Game.state[i][1] = clone(Game.pieces.pawn);
				Game.state[i][6] = clone(Game.pieces.pawn);
			}
			for (var i = 0; i < 8; i++) {
				for (var j = 6; j < 8; j++) {
					Game.state[i][j].color = 1;
				}
			}

			// draw current state
			Game.draw();
		}
	},

	// load content, graphics, sound etc.
	loadContent: function () {
		console.log('loadContent');

		// add click event listener to the canvas
		$(Game.canvas).bind('click', Game.choosePiece);
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
		console.log('piece detected: %o %o', piece.type, piece.color);

		// check if current player is allowed to select that piece
		if (piece.color != Game.turn) {
			console.log('tried to select opponent piece');
			return;
		}

		// snap the piece to the mouse
		Game.setPieceAt(grid, null);
		Game.draw();
		Game.drawPiece(piece.type, piece.color, pos);

		// unbind the current click listener
		$(Game.canvas).unbind('click', Game.choosePiece);

		// snap to mouse; next click sets down the piece
		$(Game.canvas).bind('mousemove', Game.movePiece);
		$(Game.canvas).bind('click', Game.placePiece);

		// store previous piece
		Game.previous.piece = piece;
		Game.previous.grid = grid;
	},

	getPieceAt: function (grid) {
		return Game.state[grid[0]][grid[1]];
	},

	setPieceAt: function (grid, piece) {
		Game.state[grid[0]][grid[1]] = piece;
	},

	// make the piece follow the mouse position
	movePiece: function (event) {
		var pos = Game.getPosition(event);
		var piece = Game.previous.piece;
		//TODO: it's really inefficient to redraw the entire game board every time the mouse moves
		//TODO: look into ctx.save() and ctx.restore()
		Game.draw();
		// draw piece at these coordinates
		Game.drawPiece(piece.type, piece.color, pos);
	},

	placePiece: function (event) {
		var cancelMove = false;
		var pos = Game.getPosition(event);
		var grid = Game.getGrid(pos);
		console.log("placePiece: %o", grid);

		// check if there's a piece here
		var piece = Game.getPieceAt(grid);
		if (piece != null) {
			// check who the piece belongs to
			if (piece.color == Game.turn) {
				console.log('place on your piece');
				//TODO
			} else {
				console.log('place on opponent piece');
				//TODO
			}
		} else {
			// placing in empty space
			var prev = Game.previous.grid;
			if (prev != null && prev[0] == grid[0] && prev[1] == grid[1]) {
				console.log('place at same place');
				cancelMove = true;
			}
		}

		//TODO: check if the move is valid according to game rules

		// snap the piece to the grid
		Game.setPieceAt(grid, Game.previous.piece);
		Game.draw();

		// unbind the current listeners
		$(Game.canvas).unbind('mousemove', Game.movePiece);
		$(Game.canvas).unbind('click', Game.placePiece);

		// next click picks up piece
		$(Game.canvas).bind('click', Game.choosePiece);

		// next turn
		if (!cancelMove) {
			Game.turn++;
			Game.turn = Game.turn % 2;
			console.log('turn: %o', Game.turn);
		}
	},

	// get the position of a click event in pixels
	getPosition: function (event) {
		return [event.offsetX, event.offsetY];
	},

	// compute grid location given coordinates in pixels
	getGrid: function (pos) {
		var tile = Game.canvas.width / 8;
		return [Math.floor(pos[0] / tile), Math.floor(pos[1] / tile)];
	},

	// draw the current state to the canvas
	draw: function () {
		// clear the game board
		var c = Game.ctx;
		var rect = [Game.canvas.width, Game.canvas.height];
		c.clearRect(0, 0, rect[0], rect[1]);

		// draw the game board
		c.strokeStyle = 'black';
		c.fillStyle = 'black';
		var baseX = 0.5, baseY = 0.5, width = Game.canvas.width / 8;
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				var x = baseX + width * i, y = baseY + width * j;
				c.strokeRect(x, y, width, width);
				if ((i + j) % 2 != 0) {
					c.fillRect(x, y, width, width);
				}
			}
		}

		// iterate over all game tiles
		var tile = Game.canvas.width / 8;
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				var piece = Game.state[i][j];
				if (piece != null) {
					var pos = [i * tile + tile / 2, j * tile + tile / 2];
					// draw game piece at this position
					Game.drawPiece(piece.type, piece.color, pos);
				}
			}
		}
	},

	// draw a game piece at a specified position (in pixels)
	drawPiece: function (type, color, pos) {
		//TODO: use the drawImage() method instead
		// https://developer.mozilla.org/en/Canvas_tutorial%3AUsing_images
		var c = Game.ctx;
		c.beginPath();
		switch (type) {
			case 'king':
				c.arc(pos[0], pos[1], 15, 0, Math.PI * 2, true);
				break;
			case 'rook':
				c.arc(pos[0], pos[1], 15, 0, Math.PI * 2, true);
				break;
			case 'bishop':
				c.arc(pos[0], pos[1], 15, 0, Math.PI * 2, true);
				break;
			case 'queen':
				c.arc(pos[0], pos[1], 15, 0, Math.PI * 2, true);
				break;
			case 'knight':
				c.arc(pos[0], pos[1], 15, 0, Math.PI * 2, true);
				break;
			case 'pawn':
				c.arc(pos[0], pos[1], 15, 0, Math.PI * 2, true);
				break;
		}
		switch (color) {
			case 0:
				c.strokeStyle = 'white';
				c.fillStyle = 'black';
				break;
			case 1:
				c.strokeStyle = 'black';
				c.fillStyle = 'white';
				break;
		}
		c.stroke();
		c.fill();
	}
}

Game.initialize();
Game.loadContent();

