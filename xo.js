// abstract representation of the 4D board
class Board {
  constructor() {
    this._board = [];
    
    for (let i = 0; i < 5; i++) {
      this._board.push([]);
      
      for (let j = 0; j < 5; j++) {
        this._board[i].push([])
        
        for (let k = 0; k < 5; k++) {
          this._board[i][j].push([0,0,0,0,0])
        }
      }
    }
  }
  
  Reset() {
    for (let i=0; i<5; i++) {
      for (let j=0; j<5; j++) {
        for (let k=0; k<5; k++) {
          for (let l=0; l<5; l++) {
            this._board[i][j][k][l] = 0
          }
        }
      }
    }
  }
  
  IsFree(coord) {
    const [i,j,k,l] = coord;
    
    if (this._board[i][j][k][l] == 0) {
      return true
    } else {
      return false
    }
  }
  
  SetMark(coord, player) {
    const [i,j,k,l] = coord;
    
    if (this._board[i][j][k][l] == 0) {
      this._board[i][j][k][l] = player
    }
  }
  
  GetMark(coord, player) {
    const [i,j,k,l] = coord;
    return this._board[i][j][k][l]
  }
  
  Inside(coord) {
    if (0 < Math.min(...coord) && Math.max(...coord) < 4) {
      return true
    } else {
      return false
    }
  }
  
  GetFreeTiles() {
    let free = [];
    
    for (let i=0; i<5; i++) {
      for (let j=0; j<5; j++) {
        for (let k=0; k<5; k++) {
          for (let l=0; l<5; l++) {
            if (this._board[i][j][k][l] == 0) {
              free.push([i,j,k,l])
            }
          }
        }
      }
    }
    
    return free
  }
  
  GetFreeTilesNearCoord(coord) {
    let free = [];
    
    for (let i=coord[0]-1; i<coord[0]+1; i++) {
      for (let j=coord[1]-1; j<coord[1]+1; j++) {
        for (let k=coord[2]-1; k<coord[2]+1; k++) {
          for (let l=coord[3]-1; l<coord[3]+1; l++) {
            if (this.Inside([i,j,k,l]) && this._board[i][j][k][l] == 0) {
              free.push([i,j,k,l])
            }
          }
        }
      }
    }
    
    return free
  }
  
  // rules of the game (five in row)
  MarkWins(coord, player) {
    // test for straight lines through coord
    for (let i=0; i<4; i++) {
      let FiL = [];
      let test = [...coord];
      for (let x=0; x<5; x++) {
        test[i] = x;
        if (this.GetMark(test) == player) {
          FiL.push([...test]);
        } else {
          break
        }
      }
      if (FiL.length == 5) {
        return FiL
      }
    }
      
    // test for diagonals in two dimensions
    for (let i=0; i<4; i++) {
      for (let j=i; j<4; j++) {
        // test first diagonal
        let FiL = [];
        let test = [...coord];
        if (coord[i] == coord[j]) {
          for (let x=0; x<5; x++) {
            test[i] = test[j] = x;
            if (this.GetMark(test) == player) {
              FiL.push([...test])
            } else {
              break
            }
          }
        }
        if (FiL.length == 5) {
          return FiL
        }
        
        // test second diagonal
        FiL = [];
        test = [...coord];
        if (coord[i] == 4 - coord[j]) {
          for (let x=0; x<5; x++) {
            test[i] = x;
            test[j] = 4 - x;
            if (this.GetMark(test) == player) {
              FiL.push([...test])
            } else {
              break
            }
          }
        }
        if (FiL.length == 5) {
          return FiL
        }
      }
    }
    
    // test for diagonal in three dimensions
    for (let i=0; i<4; i++) {
      for (let j=i; j<4; j++) {
        for (let k=i; k<4; k++) {
          
          // now we have four diagonals, use parities p1 and p2 to loop through them
          let mirror = [...coord];
          mirror[j] = 4 - coord[j];
          mirror[k] = 4 - coord[k];
          let parity = [coord, mirror];
          
          for (let p1=0; p1<2; p1++) {
            for (let p2=0; p2<2; p2++) {
              let FiL = [];
              let test = [...coord];
              
              if ( (coord[i] == parity[p1][j]) && (parity[p1][j] == parity[p2][k]) ) {
                for (let x=0; x<5; x++) {
                  let parX = [x, 4-x];
                  test[i] = x;
                  test[j] = parX[p1];
                  test[k] = parX[p2];
                  
                  if (this.GetMark(test) == player) {
                    FiL.push([...test])
                  } else {
                    break
                  }
                }
              }
              if (FiL.length == 5) {
                return FiL
              }
            }
          }
        }
      }
    }
    
    // test for diagonal in four dimensions
    for (let i=0; i<4; i++) {
      for (let j=i; j<4; j++) {
        for (let k=i; k<4; k++) {
          for (let l=i; l<4; l++) {
            
            // now we have eight diagonals, use parities p1, p2, and p3 to loop through them
            let mirror = [...coord];
            mirror[j] = 4 - coord[j];
            mirror[k] = 4 - coord[k];
            mirror[l] = 4 - coord[l];
            let parity = [coord, mirror];
            
            for (let p1=0; p1<2; p1++) {
              for (let p2=0; p2<2; p2++) {
                for (let p3=0; p3<2; p3++) {
                  let FiL = [];
                  let test = [...coord];
                  
                  if ( (coord[i] == parity[p1][j]) && (parity[p1][j] == parity[p2][k]) && (parity[p2][k] == parity[p3][l]) ) {
                    for (let x=0; x<5; x++) {
                      let parX = [x, 4-x];
                      test[i] = x;
                      test[j] = parX[p1];
                      test[k] = parX[p2];
                      test[l] = parX[p3];
                      
                      if (this.GetMark(test) == player) {
                        FiL.push([...test])
                      } else {
                        break
                      }
                    }
                  }
                  if (FiL.length == 5) {
                    return FiL
                  }
                }
              }
            }
          }
        }
      }
    }
    
    return null
  }
  
  Stalemate(board) {
    if (this.GetFreeTiles().length == 0) {
      return true
    } else {
      return false
    }
  }
}

class AI {
  constructor(board) {
    this._board = board;
    this._lastMove = null;
  }
  
  Reset() {
    this._lastMove = null
  }
  
  _RandomChoice(moves) {
    const rand = Math.floor(Math.random()*moves.length);
    return moves[rand]
  }
  
  _MarksInLine(n, coord) {
    const opponent = this._board.GetMark(coord);
    
    let free = [];
    for (let i=n; i<5; i++) {
      free.push([])
    }
    
    // test for straight lines through coord
    for (let i=0; i<4; i++) {
      let MiL = 0;
      let empty = [];
      let test = [...coord];
      for (let x=0; x<5; x++) {
        test[i] = x;
        if (this._board.GetMark(test) == opponent) {
          MiL += 1
        } else if (this._board.GetMark(test) == 0) {
          empty.push([...test])
        }
      }
      
      if ( (MiL >= n) && (empty.length + MiL == 5) ) {
        free[4-MiL].push(...empty)
      }
    }
      
    // test for diagonals in two dimensions
    for (let i=0; i<4; i++) {
      for (let j=i; j<4; j++) {
        // test first diagonal
        let MiL = 0;
        let empty = [];
        let test = [...coord];
        if (coord[i] == coord[j]) {
          for (let x=0; x<5; x++) {
            test[i] = test[j] = x;
            if (this._board.GetMark(test) == opponent) {
              MiL += 1
            } else if (this._board.GetMark(test) == 0) {
              empty.push([...test])
            }
          }
        }
        if ( (MiL >= n) && (empty.length + MiL == 5) ) {
          free[4-MiL].push(...empty)
        }
        
        // test second diagonal
        MiL = 0;
        empty = [];
        test = [...coord];
        if (coord[i] == 4 - coord[j]) {
          for (let x=0; x<5; x++) {
            test[i] = x;
            test[j] = 4 - x;
            if (this._board.GetMark(test) == opponent) {
              MiL += 1
            } else if (this._board.GetMark(test) == 0) {
              empty.push([...test])
            }
          }
        }
        if ( (MiL >= n) && (empty.length + MiL == 5) ) {
          free[4-MiL].push(...empty)
        }
      }
    }
    
    // test for diagonal in three dimensions
    for (let i=0; i<4; i++) {
      for (let j=i; j<4; j++) {
        for (let k=i; k<4; k++) {
          
          // now we have four diagonals, use parities p1 and p2 to loop through them
          let mirror = [...coord];
          mirror[j] = 4 - coord[j];
          mirror[k] = 4 - coord[k];
          let parity = [coord, mirror];
          
          for (let p1=0; p1<2; p1++) {
            for (let p2=0; p2<2; p2++) {
              let MiL = 0;
              let empty = [];
              let test = [...coord];
              
              if ( (coord[i] == parity[p1][j]) && (parity[p1][j] == parity[p2][k]) ) {
                for (let x=0; x<5; x++) {
                  let parX = [x, 4-x];
                  test[i] = x;
                  test[j] = parX[p1];
                  test[k] = parX[p2];
                  
                  if (this._board.GetMark(test) == opponent) {
                    MiL += 1
                  } else if (this._board.GetMark(test) == 0) {
                    empty.push([...test])
                  }
                }
              }
              if ( (MiL >= n) && (empty.length + MiL == 5) ) {
                free[4-MiL].push(...empty)
              }
            }
          }
        }
      }
    }
    
    // test for diagonal in four dimensions
    for (let i=0; i<4; i++) {
      for (let j=i; j<4; j++) {
        for (let k=i; k<4; k++) {
          for (let l=i; l<4; l++) {
            
            // now we have eight diagonals, use parities p1, p2, and p3 to loop through them
            let mirror = [...coord];
            mirror[j] = 4 - coord[j];
            mirror[k] = 4 - coord[k];
            mirror[l] = 4 - coord[l];
            let parity = [coord, mirror];
            
            for (let p1=0; p1<2; p1++) {
              for (let p2=0; p2<2; p2++) {
                for (let p3=0; p3<2; p3++) {
                  let MiL = 0;
                  let empty = [];
                  let test = [...coord];
                  
                  if ( (coord[i] == parity[p1][j]) && (parity[p1][j] == parity[p2][k]) && (parity[p2][k] == parity[p3][l]) ) {
                    for (let x=0; x<5; x++) {
                      let parX = [x, 4-x];
                      test[i] = x;
                      test[j] = parX[p1];
                      test[k] = parX[p2];
                      test[l] = parX[p3];
                      
                      if (this._board.GetMark(test) == opponent) {
                        MiL += 1
                      } else if (this._board.GetMark(test) == 0) {
                        empty.push([...test])
                      }
                    }
                  }
                  if ( (MiL >= n) && (empty.length + MiL == 5) ) {
                    free[4-MiL].push(...empty)
                  }
                }
              }
            }
          }
        }
      }
    }
    
    return free
  }
  
  NextMove(lastPlayerMove) {
    let move = null;
    let block = [[],[]];
    let plan = [[],[],[]];
    let priority = [];
    move = null;
    
    if (lastPlayerMove) {
      block = this._MarksInLine(3, lastPlayerMove)
    }
    
    if (this._lastMove) {
      plan = this._MarksInLine(2, this._lastMove)
    }
    
    priority = [plan[0], block[0], block[1], plan[1], plan[2]];
    
    for (let i=0; i<priority.length; i++) {
      let moves = priority[i]
      if (moves.length) {
        move = this._RandomChoice(moves);
        break
      }
    }
    
    if (!move && this._lastMove) {
      let moves = this._board.GetFreeTilesNearCoord(this._lastMove);
      if (moves.length) {
        move = this._RandomChoice(moves)
      }
    }
    
    if (!move) {
      move = this._RandomChoice(this._board.GetFreeTiles())
    }
    
    this._lastMove = move;
    
    return move
  }
}

class GUI {
  constructor() {
    this._gameOn = true;
    this._board = new Board();
    this._boardCanvas = new BoardCanvas();
    this._ai = [new AI(this._board), new AI(this._board)];
    this._currentAI = 0;
    this._lastMoves = [null, null];
    this._interval = null;
    this._timeout = null;
    this._turnDelay = 1000;
    this._gameDelay = 10000;
  }
  
  Init() {
    this._boardCanvas.Reset();
    let self = this;
    this._interval = setInterval( function(){self._AdvanceAITurn()}, this._turnDelay );
  }
  
  _GetCoordinatesFromPoint(evt) {
    let canvas = document.getElementById('xo');
    const left = canvas.offsetLeft + canvas.clientLeft - canvas.width/2;
    const top = canvas.offsetTop + canvas.clientTop - canvas.height/2;
    
    const x = evt.pageX - left;
    const y = evt.pageY - top;
    
    let coord = null;
    if ( (34 < x && x < 685) && (34 < y && y < 685) ) {
      const i = Math.floor((y - 34)/131.0),
          j = Math.floor((x - 34)/131.0),
          k = Math.floor((y - 34 - i*131)/22.0),
          l = Math.floor((x - 34 - j*131)/22.0);
      
      if (k < 5 && l < 5) {
        coord = [i,j,k,l];
      }
    }
    
    return coord
  }
  
  OnClick(evt) {
    if (this._hasPlayer && this._gameOn) {
      let coord = this._GetCoordinatesFromPoint(evt);
      if (coord && this._board.IsFree(coord)) {
        this._AdvanceTurns(coord);
      }
    } else {
      this._hasPlayer = true;
      this._gameOn = false;
      clearTimeout(this._timeout);
      clearInterval(this._interval);
      this.Reset();
    }
  }
  
  Reset() {
    this._ai[0].Reset();
    this._ai[1].Reset();
    this._board.Reset();
    this._boardCanvas.Reset()
    this._lastMoves = [null, null];
    this._gameOn = true;
    
    if (!this._hasPlayer) {
      let self = this;
      this._interval = setInterval( function(){self._AdvanceAITurn()}, this._turnDelay );
    }
  }
  
  _MakeMove(coord, player, op) {
    // clear highlight for the last move
    let last = this._lastMoves[player-1];
    let lastOP = this._lastMoves[op-1];
    if (last) {
      this._boardCanvas.SetMark(last, player, false);
    }
    
    // set the new mark on board
    this._board.SetMark(coord, player);
    this._boardCanvas.SetMark(coord, player, true);
    this._lastMoves[player-1] = coord;
    
    // check for victory conditions
    const line = this._board.MarkWins(coord, player);
    if (line) {
      this._boardCanvas.SetMark(lastOP, op, false);
      for (let c of line) {
        this._boardCanvas.SetMark(c, player, true);
      }
      this._gameOn = false
    }
    
    if (this._board.Stalemate()) {
      this._gameOn = false
    }
  }
  
  _AdvanceTurns(coord) {
    // human turn
    this._MakeMove(coord, 1, 2);
    
    // ai turn
    let aicoord = this._ai[0].NextMove(coord);
    this._MakeMove(aicoord, 2, 1);
  }
  
  _AdvanceAITurn() {
    if (this._gameOn) {
      const id = this._currentAI;
      let coord = this._ai[id].NextMove(this._lastMoves[(id+1)%2]);
      this._MakeMove(coord, id+1, (id+1)%2+1);
      this._currentAI = (id+1)%2;
    } else {
      clearInterval(this._interval);
      let self = this;
      this._timeout = setTimeout( function(){self.Reset()}, this._gameDelay);
    }
  }
}


class BoardCanvas {
  constructor() {
    this._board = new Image();
    this._board.src = 'resource/board.png';
    
    this._x = new Image();
    this._x.src = 'resource/X.png';
    
    this._xHigh = new Image();
    this._xHigh.src = 'resource/X_high.png';
    
    this._o = new Image();
    this._o.src = 'resource/O.png';
    
    this._oHigh = new Image();
    this._oHigh.src = 'resource/O_high.png';
  }
  
  Reset() {
    let ctx = document.getElementById('xo').getContext("2d");
    ctx.drawImage(this._board, 0, 0);
  }
  
  SetMark(coord, player, highlight) {
    let ctx = document.getElementById('xo').getContext("2d");
    let [i,j,k,l] = coord;
    let x = 34 + j*131 + l*22;
    let y = 34 + i*131 + k*22;
    
    if (player == 1) {
      if (highlight) {
        ctx.drawImage(this._xHigh, x, y)
      } else {
        ctx.drawImage(this._x, x, y)
      }
    } else {
      if (highlight) {
        ctx.drawImage(this._oHigh, x, y)
      } else {
        ctx.drawImage(this._o, x, y)
      }
    }
  }
}

var gui = new GUI();

function test() {
  let canvas = document.getElementById('xo');
  gui.Init();
  canvas.addEventListener('click', function(evt) {gui.OnClick(evt)});
  //setInterval(function(){gui.Clear()}, 1000);
}

window.onload = test;