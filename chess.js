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
	allPieces: [],
	turn: 1,
	redKing: null,
	blackKing: null,
	redCheck: false,
	blackCheck: false,
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
				var x = clone(Game.pieces[a[i]]);
				Game.state[i][0] = x;
				Game.allPieces.push(x);
				if(a[i]=='king')
					Game.blackKing = x;
				
				x = clone(Game.pieces[a[i]]);
				Game.state[i][7] = x;
				Game.allPieces.push(x);
				if(a[i]=='king')
					Game.redKing = x;
			}
			for (var i = 0; i < 8; i++) {
				var x = clone(Game.pieces.pawn);
				Game.state[i][1] = x;
				Game.allPieces.push(x);
				
				x = clone(Game.pieces.pawn);
				Game.state[i][6] = x;
				Game.allPieces.push(x);
			}
			for (var i = 0; i < 8; i++) {
				for (var j = 6; j < 8; j++) {
					Game.state[i][j].color = 1;
				}
			}

			// draw current state
			Game.draw();

			// add click event listener to the canvas
			$(Game.canvas).bind('click', Game.choosePiece);
		}
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

	//given a piece and a target tuple, can that piece go there?
	validateMove: function (type, here, there, color) {
		if (here[0] == there[0] && here[1] == there[1]) return true;
		if (Game.getPieceAt(there) != null && Game.getPieceAt(there).color == color) return false;

		switch (type) { //Game.getPieceAt(grid)
		case ("rook"):
			{
				if (here[0] == there[0]) {
					if (there[1] > here[1]) var inc = -1;
					else var inc = 1;

					for (var y = there[1] + inc; y != here[1]; y += inc) {
						if (Game.getPieceAt([here[0], y]) != null) return false;
					}
					return true;
				}

				if (here[1] == there[1]) {
					if (there[0] > here[0]) var inc = -1;
					else var inc = 1;

					for (var x = there[0] + inc; x != here[0]; x += inc) {
						if (Game.getPieceAt([x, here[1]]) != null) return false;
					}
					return true;
				}

				return false;
				break;
			}
		case ("knight"):
			{
				if (there[0] == here[0] + 2 || there[0] == here[0] - 2) if (there[1] == here[1] + 1 || there[1] == here[1] - 1) return true;
				if (there[1] == here[1] + 2 || there[1] == here[1] - 2) if (there[0] == here[0] + 1 || there[0] == here[0] - 1) return true;
				return false;
				break;
			}
		case ("bishop"):
			{
				if (!(Math.abs(here[0] - there[0]) == Math.abs(here[1] - there[1]))) return false;

				if (there[1] > here[1]) var yinc = -1;
				else var yinc = 1;

				if (there[0] > here[0]) var xinc = -1;
				else var xinc = 1;

				var x = there[0] + xinc;
				var y = there[1] + yinc;

				while (x != here[0] && y != here[1]) {
					console.log('checking (%o,%o)', x, y);
					if (Game.getPieceAt([x, y]) != null) return false;

					x += xinc;
					y += yinc;
				}

				return true;
				break;
			}
		case ("queen"):
			{
				//rook-like movement
				if (here[0] == there[0]) {
					if (there[1] > here[1]) var inc = -1;
					else var inc = 1;

					for (var y = there[1] + inc; y != here[1]; y += inc) {
						if (Game.getPieceAt([here[0], y]) != null) return false;
					}
					return true;
				}

				if (here[1] == there[1]) {
					if (there[0] > here[0]) var inc = -1;
					else var inc = 1;

					for (var x = there[0] + inc; x != here[0]; x += inc) {
						if (Game.getPieceAt([x, here[1]]) != null) return false;
					}
					return true;
				}
				//bishop-like movement
				if (!(Math.abs(here[0] - there[0]) == Math.abs(here[1] - there[1]))) return false;

				if (there[1] > here[1]) var yinc = -1;
				else var yinc = 1;

				if (there[0] > here[0]) var xinc = -1;
				else var xinc = 1;

				var x = there[0] + xinc;
				var y = there[1] + yinc;
				while (x != here[0] && y != here[1]) {
					console.log('checking (%o,%o)', x, y);
					if (Game.getPieceAt([x, y]) != null) return false;

					x += xinc;
					y += yinc;
				}

				return true;
				break;
			}
		case ("king"):
			{
				if (Math.abs(here[0] - there[0]) <= 1 && Math.abs(here[1] - there[1]) <= 1) return true;
				return false;
				break;
			}
		case ("pawn"):
			{
				if (color == 0) var forward = 1;
				else var forward = -1

				if (there[0] == here[0] && there[1] == here[1] + forward && Game.getPieceAt(there) == null) return true;

				if ((there[0] == here[0] + 1 || there[0] == here[0] - 1) && there[1] == here[1] + forward && Game.getPieceAt(there) != null) return true;

				if (there[0] == here[0] && there[1] == here[1] + forward + forward && Game.getPieceAt([here[0], here[1] + forward]) == null && here[1] == 3.5 - (2.5 * forward)) return true;

				return false;
				break;
			}
		}
	},

	placePiece: function (event) {
		var cancelMove = false;		
		var pos = Game.getPosition(event);
		var grid = Game.getGrid(pos);
		
		var initialBlackCheck = Game.blackCheck
		var initialRedCheck = Game.redCheck
		Game.blackCheck = false;
		Game.redCheck = false;
		
		cancelMove = !(Game.validateMove(Game.previous.piece.type, Game.previous.grid, grid, Game.previous.piece.color))
		
		if (cancelMove)
			return;
			
		console.log("placePiece: %o", grid);

		// check if there's a piece here
		var piece = Game.getPieceAt(grid);
		if (piece != null) {
			// check who the piece belongs to
			if (piece.color == Game.turn) {
				console.log('place on your piece: %o', piece.type);
				//TODO
			} else {
				console.log('place on opponent piece: %o', piece.type);
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

		// check if the move is valid according to game rules
		
		var wasThere = Game.getPieceAt(grid);
		Game.setPieceAt(grid, Game.previous.piece); // place piece temporarily
				
		Game.checkForCheck();
		
		 //undo temporary placement of piece
		
		console.log("Black Check is %o. Red Check is %o", Game.blackCheck, Game.redCheck)
		
		if((Game.blackCheck || Game.redCheck) &&  Game.checkForCheckmate()) 
			console.log("Checkmate has been detected.")
		
		Game.setPieceAt(grid, wasThere);	
		
		if (!cancelMove)
		{
			
		if(!(initialBlackCheck) && Game.blackCheck && Game.turn == 0)
			{
				Game.blackCheck = initialBlackCheck;
				Game.redCheck = initialRedCheck;
				console.log("Can't put yourself in check!")
				return;
			}
		if(initialBlackCheck && Game.blackCheck && Game.turn == 0)
			{
				Game.blackCheck = initialBlackCheck;
				Game.redCheck = initialRedCheck;
				console.log("Still in check!")
				return;
			}
			
		if(!(initialRedCheck) && Game.redCheck && Game.turn == 1)
			{
				Game.blackCheck = initialBlackCheck;
				Game.redCheck = initialRedCheck;
				console.log("Can't put yourself in check!")
				return;
			}
		if(initialRedCheck && Game.redCheck && Game.turn == 1)
			{
				Game.blackCheck = initialBlackCheck;
				Game.redCheck = initialRedCheck;
				console.log("Still in check!")
				return;
			}
		}
		else
			{
				Game.blackCheck = initialBlackCheck;
				Game.redCheck = initialRedCheck;
			}
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

	getAllPieces: function ()
	{
		array = [];
		for(var i =0; i<8; i++)
		for(var j =0; j<8; j++)
		{
			var x = Game.state[i][j];
			if(!(x == null)) 
				array.push( [x, [i,j] ]  )
		}
		return array;
	},
	
	checkForCheck: function ()
	{
		var allPieces = Game.getAllPieces();
		var redKingGrid;
		var blackKingGrid;
		Game.blackCheck = false;
		Game.redCheck = false;
		
		for(var i =0; i< allPieces.length; i++) 
			{

			if(allPieces[i][0] == Game.blackKing) 
				blackKingGrid = allPieces[i][1];
			if(allPieces[i][0] == Game.redKing) 
				redKingGrid = allPieces[i][1];
			}
		
		for(var i=0; i<allPieces.length; i++)
		{
			var checkPiece = allPieces[i][0]; 
			if (checkPiece == Game.blackKing) continue;
			if (checkPiece.color == 0) continue;
			if (Game.validateMove(checkPiece.type, allPieces[i][1], blackKingGrid, checkPiece.color))
				{
				Game.blackCheck = true;
				break;
				}
		}
		
		for(var i=0; i<allPieces.length; i++)
		{
			var checkPiece = allPieces[i][0]; 
			if (checkPiece == Game.redKing) continue;
			if (checkPiece.color == 1) continue;
			if (Game.validateMove(checkPiece.type, allPieces[i][1], redKingGrid, checkPiece.color))
				{
				Game.redCheck = true;
				break;
				}
		}

		
	},
	
	checkForCheckmate: function()
	{
		console.log("checking for checkmate...")
		var allPieces = Game.getAllPieces();
		var redKingGrid;
		var blackKingGrid;
		var colorInCheck;
		var initialBlackCheck = Game.blackCheck
		var initialRedCheck = Game.redCheck
		
		if(Game.blackCheck) colorInCheck = 0;
		else colorInCheck = 1;
		
		for(var i =0; i< allPieces.length; i++) 
			{

			if(allPieces[i][0] == Game.blackKing) 
				blackKingGrid = allPieces[i][1];
			if(allPieces[i][0] == Game.redKing) 
				redKingGrid = allPieces[i][1];
			}
		
		for(var i =0; i< allPieces.length; i++) 
			{
				var piece = allPieces[i][0]
				var where = allPieces[i][1]
				
				if (colorInCheck != piece.color) continue;
				console.log(piece.type + " at " + where)
				for(var x = 0; x < 8; x++)
				{
					for(var y = 0; y<8; y++)
					{
					
						if(Game.validateMove(piece.type, where, [x,y], piece.color))
						{
							if([x,y]!=redKingGrid && [x,y] != blackKingGrid) 
							{
							
						    console.log("can go to " + [x,y])
						
							var wasThere = Game.getPieceAt([x,y]);
							
							Game.setPieceAt(where, null)
							Game.setPieceAt([x,y], piece);
							
							Game.blackCheck = initialBlackCheck;
							Game.redCheck = initialRedCheck;
							Game.checkForCheck();
							console.log("Then black check would be %o and red check would be %o", Game.blackCheck, Game.redCheck)
							
							Game.setPieceAt([x,y], wasThere);
							Game.setPieceAt(where, piece);
							
							if ((Game.blackCheck == false && colorInCheck == 0) || (Game.redCheck == false && colorInCheck == 1)) 
							{
								Game.blackCheck = initialBlackCheck;
								Game.redCheck = initialRedCheck;
								return false;
							}
						}
					}
					
					}
					
				}
			
			}
			return true;
	},
	
	
	// draw a game piece at a specified position (in pixels)
	drawPiece: function (type, color, pos) {
		//TODO: use the drawImage() method instead
		// https://developer.mozilla.org/en/Canvas_tutorial%3AUsing_images
		var c = Game.ctx;
		c.beginPath();
		switch (type) {
			case 'king':
				c.arc(pos[0], pos[1], 20, 0, Math.PI * 2, true);
				break;
			case 'rook':
				c.arc(pos[0], pos[1], 20, 0, Math.PI * 2, true);
				break;
			case 'bishop':
				c.arc(pos[0], pos[1], 20, 0, Math.PI * 2, true);
				break;
			case 'queen':
				c.arc(pos[0], pos[1], 20, 0, Math.PI * 2, true);
				break;
			case 'knight':
				c.arc(pos[0], pos[1], 20, 0, Math.PI * 2, true);
				break;
			case 'pawn':
				c.arc(pos[0], pos[1], 20, 0, Math.PI * 2, true);
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
		switch (color) {
			case 0:
				c.fillStyle = 'white';
				break;
			case 1:
				c.fillStyle = 'black';
				break;
		}
		c.fillText(type, pos[0] - 12, pos[1] + 3);
	}
}

Game.initialize();

