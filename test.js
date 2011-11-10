jQuery.fn.log = function (msg) {
	console.log("%s: %o", msg, this);
	return this;
};

var Game = {
	Initialize: function () {
		console.log('Initialize');
		// initialize all game variables
		var canvas = document.getElementById('canvas');
		if (canvas && canvas.getContext) {
			// check whether browser support getting canvas context
			var ctx = canvas.getContext('2d');
			var baseX = 0.5, baseY=0.5, width=50;
			for (var i=0;i<8;i++){
				for (var j=0;j<8;j++){
					var x = baseX+width*i, y=baseY+width*j;
					ctx.strokeRect(x,y,width,width);
					if((i+j) %2 !=0){
						ctx.fillRect(x,y,width,width);
					}
				}
			}
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

