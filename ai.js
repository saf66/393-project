function shuffle(v) {
	for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
	return v;
}

var AI = {

	move: function () {
		console.log('AI.move()');
		var color = Game.turn;

		// get all of our pieces
		var all = Game.getAllPieces();
		var pieces = [];
		for (var i = 0; i < all.length; i++)
			if (all[i][0].color == color)
				pieces.push(all[i]);

		// iterate through all possible moves
		var moves = [];
		for (var i = 0; i < pieces.length; i++) {
			pieces[i][0].moves = [];
			var source = pieces[i][1];
			for (var x = 0; x < 8; x++)
				for (var y = 0; y < 8; y++) {
					var target = [x, y];
					if (!(source[0] == target[0] && source[1] == target[1]) && Game.validateMove(pieces[i][0].type, source, target, color)) {
						var score = 0;
						var piece = Game.getPieceAt(source);
						var opponent = Game.getPieceAt(target);
						//TODO: rank the move
						if (opponent != null) {
							switch (opponent.type) {
								case ('pawn'): score += 2;
								case ('knight'): score += 3;
								case ('bishop'): score += 5;
								case ('rook'): score += 5;
								case ('queen'): score += 8;
								case ('king'): score += 100;
							}
						}
						Game.setPieceAt(source, null);
						Game.setPieceAt(target, piece);
						Game.checkForCheck();
						Game.setPieceAt(source, piece);
						Game.setPieceAt(target, opponent);
						if (color == 0) {
							if (Game.blackCheck)
								score -= 50;
							if (Game.redCheck)
								score += 10;
						} else {
							if (Game.redCheck)
								score -= 50;
							if (Game.blackCheck)
								score += 10;
						}
						moves.push([score, source, target]);
					}
				}
		}

		// perform the best possible move according to the ranking
		var max = -1;
		for (var i = 0; i < moves.length; i++)
			if (moves[i][0] > max)
				max = moves[i][0];
		var total = [];
		for (var i = 0; i < moves.length; i++)
			if (moves[i][0] == max)
				total.push(moves[i]);
		max = shuffle(total)[0];
		var piece = Game.getPieceAt(max[1]);
		Game.setPieceAt(max[1], null);
		Game.setPieceAt(max[2], piece);

		// user turn
		Game.turn = Game.color;
		Game.draw();
		$('#turn').html('Current turn: ' + Game.colorString(Game.turn));
	}

}

