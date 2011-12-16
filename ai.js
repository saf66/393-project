var AI = {

	move: function () {
		//TODO: read Game.state and determine next move
		console.log('AI.move()');

		// user turn
		Game.turn = Game.color;
		$('#turn').html('Current turn: ' + Game.colorString(Game.turn));
	}

}

