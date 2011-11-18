
	//given a piece and a target tuple, can that piece go there?
 function validateMove( type, here, there, color)
 {

 	switch(type)
 		{
 			case("rook"):{
 				if(here[0]==there[0]||here[1]==there[1])
 					return true
 				else
 					return false
 				break;
 				}
 			case("knight"):{
 				if(there[0] == here[0] + 2 || there[0] == here[0] - 2)
 						if(there[1] == here[1]+1 || there[1] == here[1]-1)
 							return true;
 				if(there[1] == here[1] + 2 || there[1] == here[1] - 2)
 						if(there[0] == here[0]+1 || there[0] == here[0]-1)
 							return true;
 				return false;
 				break;
 			}
 			case("bishop"):{
 				if (Math.abs(here[0] - there[0]) == Math.abs(here[1]-there[1]))
 					return true;
 				return false;
 				break;
 			}
 			case("queen"):{
 				if(here[0]==there[0]||here[1]==there[1]) //rook-like movement
 					return true
 				if (Math.abs(here[0] - there[0]) == Math.abs(here[1]-there[1])) //bishop-like movement
 					return true;
 				return false;
 				break;
 			}
 			case("king"):{
 				if(Math.abs(here[0] - there[0]) <= 1 && Math.abs(here[1] - there[1]) <= 1)
 					return true;
 				return false;
 				break;
 			}
 			case("pawn"):{
 				//move forward
 				if(board[there[0]][there[1]].onMe.length>0)
 					return false;
 				if(color == 0)
 					if(there[1]==here[1] && there[0] == here[0]+1 )
 						return true;
 				if(color == 1)
 					if(there[1]==here[1] && there[0] == here[0]-1 )
 						return true;
 				//capture diagonally
 				if(color == 0)
 					{
 						if (there[0]==here[0]-1 && (there[1] == here[1]-1 || there[1] == here[1]+1))
 							if(board[there[0]][there[1]].onMe.length!=0 && board[there[0]][there[1]].onMe[0].color != 'b')
 								return true;
 					}
 				if(color == 1)
 					{
 						if (there[0]==here[0]+1 && (there[1] == here[1]-1 || there[1] == here[1] + 1) )
 							if(board[there[0]][there[1]].onMe.length!=0 && board[there[0]][there[1]].onMe[0].color != 'r')
 								return true;	
 					}
 				}
 			break;
 			}
 		}
 		
 


	//DOES NOT CHECK VALIDITY OF MOVE. You should call validateMove before calling move 
function move(piece, there){
	board[piece.loc[0]][piece.loc[1]].onMe.pop();
	if(board[there[0]][there[1]].onMe.length!=0)
		board[there[0]][there[1]].pop();
	piece.loc = there;
	board[there[0]][there[1]].push(piece);
}

function getAvailableMoves(piece)
{
	returnList = new Array();
	
	switch(piece.type)
	{
		case("rook"):{
			//add leftward moves
			for(var i = 1; i <8; i++)
				{
					if(piece.loc[1] - i >=0)
					{
						if (board[piece.loc[0]][piece.loc[1]-i].onMe.length==0 ||
							(board[piece.loc[0]][piece.loc[1]-i].onMe.length!=0 &&
							 board[piece.loc[0]][piece.loc[1]-i].onMe[0].color!= piece.color)) //if not a friend's spot
							returnList.push(board[piece.loc[0]][piece.loc[1]-i]);
						if (board[piece.loc[0]][piece.loc[1]-i].onMe.length!=0) //done if found a piece
							break;
					}
					
				}
			//add rightward moves
			for(var i = 1; i <8; i++)
				{
					if(piece.loc[1] + i <8)
					{
						if (board[piece.loc[0]][piece.loc[1]+i].onMe.length==0 ||
							(board[piece.loc[0]][piece.loc[1]+i].onMe.length!=0 &&
							 board[piece.loc[0]][piece.loc[1]+i].onMe[0].color!= piece.color)) //if not a friend's spot
							returnList.push(board[piece.loc[0]][piece.loc[1]+i]);
							
						if (board[piece.loc[0]][piece.loc[1]+i].onMe.length!=0) //done if found a piece
							break;
					}
					
				}
				
			//add upward moves
			for(var j = 1; j <8; j++)
				{
					if(piece.loc[0] - j >=0)
					{
						if (board[piece.loc[0]-j][piece.loc[1]].onMe.length==0 ||
							(board[piece.loc[0]-j][piece.loc[1]].onMe.length!=0 &&
							 board[piece.loc[0]-j][piece.loc[1]].onMe[0].color!= piece.color)) //if not a friend's spot
							returnList.push(board[piece.loc[0]-j][piece.loc[1]]);
							
						if (board[piece.loc[0]-j][piece.loc[1]].onMe.length!=0) //done if found a piece
							break;
					}
					
				}
			//add downward moves
			for(var j = 1; j <8; j++)
				{
					if(piece.loc[0] + j >=0)
					{
						if (board[piece.loc[0]+j][piece.loc[1]].onMe.length==0 ||
							(board[piece.loc[0]+j][piece.loc[1]].onMe.length!=0 &&
							 board[piece.loc[0]+j][piece.loc[1]].onMe[0].color!= piece.color)) //if not a friend's spot
							returnList.push(board[piece.loc[0]+j][piece.loc[1]]);
							
						if (board[piece.loc[0]+j][piece.loc[1]].onMe.length!=0) //done if found a piece
							break;
					}
				}
			break;}
		case("bishop"):{
		//add up-left moves
			for(var i = 1; i <8; i++)
				{
					if(piece.loc[0] - i >=0 &&  piece.loc[1]-i >= 0)
					{
						if (board[piece.loc[0]-i][piece.loc[1]-i].onMe.length==0 ||
							(board[piece.loc[0]-i][piece.loc[1]-i].onMe.length!=0 &&
							 board[piece.loc[0]-i][piece.loc[1]-i].onMe[0].color!= piece.color)) //if not a friend's spot
							returnList.push(board[piece.loc[0]-i][piece.loc[1]-i]);
						if (board[piece.loc[0]-i][piece.loc[1]-i].onMe.length!=0) //done if found a piece
							break;
					}
					
				}
		//add up-right moves
			for(var i = 1; i <8; i++)
				{
					if(piece.loc[0] - i >=0 &&  piece.loc[1]+i >= 0)
					{
						if (board[piece.loc[0]-i][piece.loc[1]+i].onMe.length==0 ||
							(board[piece.loc[0]-i][piece.loc[1]+i].onMe.length!=0 &&
							 board[piece.loc[0]-i][piece.loc[1]+i].onMe[0].color!= piece.color)) //if not a friend's spot
							returnList.push(board[piece.loc[0]-i][piece.loc[1]+i]);
						if (board[piece.loc[0]-i][piece.loc[1]+i].onMe.length!=0) //done if found a piece
							break;
					}
					
				}
			//add down-left moves
			for(var i = 1; i <8; i++)
				{
					if(piece.loc[0] + i >=0 &&  piece.loc[1]-i >= 0)
					{
						if (board[piece.loc[0]+i][piece.loc[1]-i].onMe.length==0 ||
							(board[piece.loc[0]+i][piece.loc[1]-i].onMe.length!=0 &&
							 board[piece.loc[0]+i][piece.loc[1]-i].onMe[0].color!= piece.color)) //if not a friend's spot
							returnList.push(board[piece.loc[0]+i][piece.loc[1]-i]);
						if (board[piece.loc[0]+i][piece.loc[1]-i].onMe.length!=0) //done if found a piece
							break;
					}
					
				}
			//add down-right moves
			for(var i = 1; i <8; i++)
				{
					if(piece.loc[0] + i >=0 &&  piece.loc[1]+i >= 0)
					{
						if (board[piece.loc[0]+i][piece.loc[1]+i].onMe.length==0 ||
							(board[piece.loc[0]+i][piece.loc[1]+i].onMe.length!=0 &&
							 board[piece.loc[0]+i][piece.loc[1]+i].onMe[0].color!= piece.color)) //if not a friend's spot
							returnList.push(board[piece.loc[0]+i][piece.loc[1]+i]);
						if (board[piece.loc[0]+i][piece.loc[1]+i].onMe.length!=0) //done if found a piece
							break;
					}
					
				}
			break;}
		case("knight"):{
			if(piece.loc[0]-2 >=0 && 
			   piece.loc[0]-2 < 8 &&
			   piece.loc[1]-1 >=0 &&
			   piece.loc[1]-1 < 8 &&
			   (board[piece.loc[0]-2][piece.loc[1]-1].onMe.length!=0&&board[piece.loc[0]-2][piece.loc[1]-1].onMe[0].color != piece.color)
			   )
			returnList.push( [ piece.loc[0]-2, piece.loc[1]-1 ] );
			
			if(piece.loc[0]-2 >=0 && 
			   piece.loc[0]-2 < 8 &&
			   piece.loc[1]+1 >=0 &&
			   piece.loc[1]+1 < 8 &&
			   (board[piece.loc[0]-2][piece.loc[1]+1].onMe.length!=0&&board[piece.loc[0]-2][piece.loc[1]+1].onMe[0].color != piece.color)
			   )
			returnList.push( [ piece.loc[0]-2, piece.loc[1]+1 ] )
			
			if(piece.loc[0]-1 >=0 && 
			   piece.loc[0]-1 < 8 &&
			   piece.loc[1]-2 >=0 &&
			   piece.loc[1]-2 < 8 &&
			   (board[piece.loc[0]-1][piece.loc[1]-2].onMe.length!=0&&board[piece.loc[0]-1][piece.loc[1]-2].onMe[0].color != piece.color)
			   )
			returnList.push( [ piece.loc[0]-1, piece.loc[1]-2 ] )
			
			if(piece.loc[0]-1 >=0 && 
			   piece.loc[0]-1 < 8 &&
			   piece.loc[1]+2 >=0 &&
			   piece.loc[1]+2 < 8 &&
			   (board[piece.loc[0]-1][piece.loc[1]+2].onMe.length!=0&&board[piece.loc[0]-1][piece.loc[1]+2].onMe[0].color != piece.color)
			   )
			returnList.push( [ piece.loc[0]-1, piece.loc[1]+2 ] )
			
			if(piece.loc[0]+1 >=0 && 
			   piece.loc[0]+1 < 8 &&
			   piece.loc[1]-2 >=0 &&
			   piece.loc[1]-2 < 8 &&
			   (board[piece.loc[0]+1][piece.loc[1]-2].onMe.length!=0&&board[piece.loc[0]+1][piece.loc[1]-2].onMe[0].color != piece.color)
			   )
			returnList.push( [ piece.loc[0]+1, piece.loc[1]-2 ] )
			
			if(piece.loc[0]+1 >=0 && 
			   piece.loc[0]+1 < 8 &&
			   piece.loc[1]+2 >=0 &&
			   piece.loc[1]+2 < 8 &&
			   (board[piece.loc[0]+1][piece.loc[1]+2].onMe.length!=0&&board[piece.loc[0]+1][piece.loc[1]+2].onMe[0].color != piece.color)
			   )
			returnList.push( [ piece.loc[0]+1, piece.loc[1]+2 ] )
			
			if(piece.loc[0]+2 >=0 && 
			   piece.loc[0]+2 < 8 &&
			   piece.loc[1]-1 >=0 &&
			   piece.loc[1]-1 < 8 &&
			   (board[piece.loc[0]+2][piece.loc[1]-1].onMe.length!=0&&board[piece.loc[0]+2][piece.loc[1]-1].onMe[0].color != piece.color)
			   )
			returnList.push( [ piece.loc[0]+2, piece.loc[1]-1 ] )
			
			if(piece.loc[0]+2 >=0 && 
			   piece.loc[0]+2 < 8 &&
			   piece.loc[1]+1 >=0 &&
			   piece.loc[1]+1 < 8 &&
			   (board[piece.loc[0]+2][piece.loc[1]+1].onMe.length!=0&&board[piece.loc[0]+2][piece.loc[1]+1].onMe[0].color != piece.color)
			   )
			returnList.push( [ piece.loc[0]+2, piece.loc[1]+1 ] )
			break;}
		case("queen"):{
			//add up-left moves
			for(var i = 1; i <8; i++)
				{
					if(piece.loc[0] - i >=0 &&  piece.loc[1]-i >= 0)
					{
						if (board[piece.loc[0]-i][piece.loc[1]-i].onMe.length==0 ||
							(board[piece.loc[0]-i][piece.loc[1]-i].onMe.length!=0 &&
							 board[piece.loc[0]-i][piece.loc[1]-i].onMe[0].color!= piece.color)) //if not a friend's spot
							returnList.push(board[piece.loc[0]-i][piece.loc[1]-i]);
						if (board[piece.loc[0]-i][piece.loc[1]-i].onMe.length!=0) //done if found a piece
							break;
					}
					
				}
		//add up-right moves
			for(var i = 1; i <8; i++)
				{
					if(piece.loc[0] - i >=0 &&  piece.loc[1]+i >= 0)
					{
						if (board[piece.loc[0]-i][piece.loc[1]+i].onMe.length==0 ||
							(board[piece.loc[0]-i][piece.loc[1]+i].onMe.length!=0 &&
							 board[piece.loc[0]-i][piece.loc[1]+i].onMe[0].color!= piece.color)) //if not a friend's spot
							returnList.push(board[piece.loc[0]-i][piece.loc[1]+i]);
						if (board[piece.loc[0]-i][piece.loc[1]+i].onMe.length!=0) //done if found a piece
							break;
					}
					
				}
			//add down-left moves
			for(var i = 1; i <8; i++)
				{
					if(piece.loc[0] + i >=0 &&  piece.loc[1]-i >= 0)
					{
						if (board[piece.loc[0]+i][piece.loc[1]-i].onMe.length==0 ||
							(board[piece.loc[0]+i][piece.loc[1]-i].onMe.length!=0 &&
							 board[piece.loc[0]+i][piece.loc[1]-i].onMe[0].color!= piece.color)) //if not a friend's spot
							returnList.push(board[piece.loc[0]+i][piece.loc[1]-i]);
						if (board[piece.loc[0]+i][piece.loc[1]-i].onMe.length!=0) //done if found a piece
							break;
					}
					
				}
			//add down-right moves
			for(var i = 1; i <8; i++)
				{
					if(piece.loc[0] + i >=0 &&  piece.loc[1]+i >= 0)
					{
						if (board[piece.loc[0]+i][piece.loc[1]+i].onMe.length==0 ||
							(board[piece.loc[0]+i][piece.loc[1]+i].onMe.length!=0 &&
							 board[piece.loc[0]+i][piece.loc[1]+i].onMe[0].color!= piece.color)) //if not a friend's spot
							returnList.push(board[piece.loc[0]+i][piece.loc[1]+i]);
						if (board[piece.loc[0]+i][piece.loc[1]+i].onMe.length!=0) //done if found a piece
							break;
					}
					
				}
				
				//add leftward moves
			for(var i = 1; i <8; i++)
				{
					if(piece.loc[1] - i >=0)
					{
						if (board[piece.loc[0]][piece.loc[1]-i].onMe.length==0 ||
							(board[piece.loc[0]][piece.loc[1]-i].onMe.length!=0 &&
							 board[piece.loc[0]][piece.loc[1]-i].onMe[0].color!= piece.color)) //if not a friend's spot
							returnList.push(board[piece.loc[0]][piece.loc[1]-i]);
						if (board[piece.loc[0]][piece.loc[1]-i].onMe.length!=0) //done if found a piece
							break;
					}
					
				}
			//add rightward moves
			for(var i = 1; i <8; i++)
				{
					if(piece.loc[1] + i <8)
					{
						if (board[piece.loc[0]][piece.loc[1]+i].onMe.length==0 ||
							(board[piece.loc[0]][piece.loc[1]+i].onMe.length!=0 &&
							 board[piece.loc[0]][piece.loc[1]+i].onMe[0].color!= piece.color)) //if not a friend's spot
							returnList.push(board[piece.loc[0]][piece.loc[1]+i]);
							
						if (board[piece.loc[0]][piece.loc[1]+i].onMe.length!=0) //done if found a piece
							break;
					}
					
				}
				
			//add upward moves
			for(var j = 1; j <8; j++)
				{
					if(piece.loc[0] - j >=0)
					{
						if (board[piece.loc[0]-j][piece.loc[1]].onMe.length==0 ||
							(board[piece.loc[0]-j][piece.loc[1]].onMe.length!=0 &&
							 board[piece.loc[0]-j][piece.loc[1]].onMe[0].color!= piece.color)) //if not a friend's spot
							returnList.push(board[piece.loc[0]-j][piece.loc[1]]);
							
						if (board[piece.loc[0]-j][piece.loc[1]].onMe.length!=0) //done if found a piece
							break;
					}
					
				}
			//add downward moves
			for(var j = 1; j <8; j++)
				{
					if(piece.loc[0] + j >=0)
					{
						if (board[piece.loc[0]+j][piece.loc[1]].onMe.length==0 ||
							(board[piece.loc[0]+j][piece.loc[1]].onMe.length!=0 &&
							 board[piece.loc[0]+j][piece.loc[1]].onMe[0].color!= piece.color)) //if not a friend's spot
							returnList.push(board[piece.loc[0]+j][piece.loc[1]]);
							
						if (board[piece.loc[0]+j][piece.loc[1]].onMe.length!=0) //done if found a piece
							break;
					}
				}
			break;}
		case("king"):{
		if(piece.loc[0]-1 >=0 && 
			   piece.loc[0]-1 < 8 &&
			   piece.loc[1]-1 >=0 &&
			   piece.loc[1]-1 < 8 &&
			   (board[piece.loc[0]-1][piece.loc[1]-1].onMe.length!=0&&board[piece.loc[0]-1][piece.loc[1]-1].onMe[0].color != piece.color)
			   )
			returnList.push( [ piece.loc[0]-1, piece.loc[1]-1 ] );
			
			if(piece.loc[0]-1 >=0 && 
			   piece.loc[0]-1 < 8 &&
			   piece.loc[1] >=0 &&
			   piece.loc[1] < 8 &&
			   (board[piece.loc[0]-1][piece.loc[1]].onMe.length!=0&&board[piece.loc[0]-1][piece.loc[1]].onMe[0].color != piece.color)
			   )
			returnList.push( [ piece.loc[0]-1, piece.loc[1] ] )
			
			if(piece.loc[0]-1 >=0 && 
			   piece.loc[0]-1 < 8 &&
			   piece.loc[1]+1 >=0 &&
			   piece.loc[1]+1 < 8 &&
			   (board[piece.loc[0]-1][piece.loc[1]+1].onMe.length!=0&&board[piece.loc[0]-1][piece.loc[1]+1].onMe[0].color != piece.color)
			   )
			returnList.push( [ piece.loc[0]-1, piece.loc[1]+1 ] )
			
			if(piece.loc[0] >=0 && 
			   piece.loc[0] < 8 &&
			   piece.loc[1]-1 >=0 &&
			   piece.loc[1]-1 < 8 &&
			   (board[piece.loc[0]][piece.loc[1]-1].onMe.length!=0&&board[piece.loc[0]][piece.loc[1]-1].onMe[0].color != piece.color)
			   )
			returnList.push( [ piece.loc[0], piece.loc[1]-1 ] )
			
			if(piece.loc[0] >=0 && 
			   piece.loc[0] < 8 &&
			   piece.loc[1]+1 >=0 &&
			   piece.loc[1]+1 < 8 &&
			   (board[piece.loc[0]][piece.loc[1]+1].onMe.length!=0&&board[piece.loc[0]][piece.loc[1]+1].onMe[0].color != piece.color)
			   )
			returnList.push( [ piece.loc[0], piece.loc[1]+1 ] )
			
			if(piece.loc[0]+1 >=0 && 
			   piece.loc[0]+1 < 8 &&
			   piece.loc[1]-1 >=0 &&
			   piece.loc[1]-1 < 8 &&
			   (board[piece.loc[0]+1][piece.loc[1]-1].onMe.length!=0&&board[piece.loc[0]+1][piece.loc[1]-1].onMe[0].color != piece.color)
			   )
			returnList.push( [ piece.loc[0]+1, piece.loc[1]-1 ] )
			
			if(piece.loc[0]+1 >=0 && 
			   piece.loc[0]+1 < 8 &&
			   piece.loc[1] >=0 &&
			   piece.loc[1] < 8 &&
			   (board[piece.loc[0]+1][piece.loc[1]].onMe.length!=0&&board[piece.loc[0]+1][piece.loc[1]].onMe[0].color != piece.color)
			   )
			returnList.push( [ piece.loc[0]+1, piece.loc[1] ] )
			
			if(piece.loc[0]+1 >=0 && 
			   piece.loc[0]+1 < 8 &&
			   piece.loc[1]+1 >=0 &&
			   piece.loc[1]+1 < 8 &&
			   (board[piece.loc[0]+1][piece.loc[1]+1].onMe.length!=0&&board[piece.loc[0]+1][piece.loc[1]+1].onMe[0].color != piece.color)
			   )
			returnList.push( [ piece.loc[0]+1, piece.loc[1]+1 ] )
			break;}
		case("pawn"):{
			var increment = 0;
			if(piece.color =='r') increment = 1; else increment = -1;
			
			//check if forward space is open
			if(board[piece.loc[0]+increment][piece.loc[1]].onMe.length==0)
				returnList.push([piece.loc[0]+increment][piece.loc[1]])
			//check capture moves			
			if(piece.loc[1]-1 >= 0 &&
			   board[piece.loc[0]+increment][piece.loc[1]-1].onMe.length!=0 &&
			   board[piece.loc[0]+increment][piece.loc[1]-1].onMe[0].color != piece.color)
					returnList.push([piece.loc[0]+increment, piece.loc[1]-1]);
								
			if(piece.loc[1]+1 >= 0 &&
			   board[piece.loc[0]+increment][piece.loc[1]+1].onMe.length!=0 &&
			   board[piece.loc[0]+increment][piece.loc[1]+1].onMe[0].color != piece.color) 
			   
					returnList.push([piece.loc[0]+increment, piece.loc[1]+1]);
						
					break;
		}
	}
	return returnList;
	}
