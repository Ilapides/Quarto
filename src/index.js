import bitwise from 'bitwise';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
  renderSquare(i) {
    return (
    	<Square 
    		value={this.props.squares[i]}
    		onClick={() => this.props.onClick(i)} 
    	/>
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
        </div>
        <div className="board-row">
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
        </div>
        <div className="board-row">
          {this.renderSquare(8)}
          {this.renderSquare(9)}
          {this.renderSquare(10)}
          {this.renderSquare(11)}
        </div>
        <div className="board-row">
          {this.renderSquare(12)}
          {this.renderSquare(13)}
          {this.renderSquare(14)}
          {this.renderSquare(15)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(16).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      nextPiece: -1,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i] != null || this.state.nextPiece < 0) { //check for squares[i] = 0 returns false!
      return;
    }
    squares[i] = this.state.nextPiece;
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      nextPiece: -1,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0, 
      nextPiece: -1,
    });
  }

  choosePiece(piecenum) {
    if (this.state.nextPiece === -1){
      this.setState({
        nextPiece: piecenum,
      });
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    // could I map? is that even better?
    // const piecebox = remainingPieces(current.squares).map((piecenum) => {
    const piecebox = [];
    remainingPieces(current.squares).forEach((value, piecenum) => {
      if (value !== false) { // should only ever be T/F, not null
        piecebox.push(
          <ul key={piecenum}>
            <button onClick={() => this.choosePiece(piecenum)}>{piecenum}</button>
          </ul>
        );
      }
    });

    let status;
    if (winner) { // I don't like these else ifs!
      status = 'Winner: ' + (this.state.xIsNext ? 'X' : 'O');
    } else if (this.state.nextPiece < 0) {
      status = 'Player ' + (this.state.xIsNext ? 'O' : 'X') + ', choose a piece for your opponent to play.';
    } else if (this.state.stepNumber === 16) {
      status = 'Tie!';
    } else {
      status = 'Player ' + (this.state.xIsNext ? 'X' : 'O') + ', choose a place for piece ' + this.state.nextPiece;
    } // will people frown on this? refactor

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            pieces={current.pieces}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ul>{piecebox}</ul> 
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function remainingPieces(squares) { // this can be shortened a lot! 
  var pieces = Array(16).fill(true);
  for (let i = squares.length - 1; i >= 0; i--) {
    if (squares[i] != null) { //sometimes 0
      pieces[squares[i]] = false;
    }
  }
  return pieces;
}

function calculateWinner(squares) {
  // how to abstract this?
  const lines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d] = lines[i]; // how can I turn this into squares[a] etc.
    if (shareBit(squares[a], squares[b], squares[c], squares[d])) {
      return true;
    }
  }
  return null;
}

function shareBit(w, x, y, z) {
  //this is very nibble based
  // shouldn't be separate from win-check

  //var vs const? idk
  
  if (w === null || x === null || y === null || z === null) { //I'd like to remove this but I don't know if I can
    return false;
  }

  for (var i = 3; i >= 0; i--) {
    if (bitwise.integer.getBit(w, i) === bitwise.integer.getBit(x, i) && bitwise.integer.getBit(w, i) === bitwise.integer.getBit(y, i) && bitwise.integer.getBit(w, i) === bitwise.integer.getBit(z, i)) {
      return true;
    }
  } 
  // can we do this in fewer lines?
  return false;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

