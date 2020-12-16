import React, { Component } from "react";
import Cell from "./Cell";
import "./Board.css";

/** GLOW.
 *
 * Props:
 *
 * - nrows: a sorok száma a táblán
 * - ncols: az oszlopok száma a táblán
 * - chanceLightStartsOn: float, esély, hogy a cella be legyen kapcsolva létrejöttekor
 *
 * State:
 *
 * - hasWon: boolean, true amikor a tábla teljesen ki van kapcsolva
 * - board: 2D boolean tömb (tömbök tömbje)
 *
 *  ┌───┬───┬───┐
 *  │ . │ . │ . │
 *  ├───┼───┼───┤
 *  │ O │ O │ . │ ('.' a kikapcsolt cella, és 'O' a bekapcsolt cella)
 *  ├───┼───┼───┤
 *  │ . │ . │ . │
 *  └───┴───┴───┘
 *
 *  Ez lenne: [[false, false, false], [true, true, false], [false, false, false]]
 *  [[1,2,3],[4,5,6],[7,8,9]]
 *
 *  Renderelnünk kell egy HTML táblát <Cell /> elemekkel.
 *
 *  Klikkeket nem itt, hanem  az egyes  cellákban kezelünk
 **/

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.25,
  };
  constructor(props) {
    super(props);

    this.state = {
      hasWon: false,
      board: this.createBoard(),
    };
  }

  createBoard() {
    let board = [];
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        row.push(Math.random() < this.props.chanceLightStartsOn);
      }
      board.push(row);
    }
    return board;
  }

  flipCellsAround(coord) {
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    flipCell(y, x);
    flipCell(y, x - 1);
    flipCell(y, x + 1);
    flipCell(y - 1, x);
    flipCell(y + 1, x);

    let hasWon = board.every((row) => row.every((cell) => cell === false));
    this.setState({ board, hasWon });
  }

  makeTable() {
    let tblBoard = [];
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        let coord = `${y}-${x}`;
        row.push(
          <Cell
            key={coord}
            isLit={this.state.board[y][x]}
            flipCellsAroundMe={() => this.flipCellsAround(coord)}
          />
        );
      }
      tblBoard.push(<tr key={y}>{row}</tr>);
    }
    return (
      <table className="Board">
        <tbody>{tblBoard}</tbody>
      </table>
    );
  }
  render() {
    return (
      <div>
        {this.state.hasWon ? (
          <div className="winner">
            <span className="neon-orange">YOU</span>
            <span className="neon-blue">WIN!</span>
          </div>
        ) : (
          <div>
            <div className="Board-title">
              <div className="neon-orange">GLOW</div>
              <div className="neon-blue">GAME</div>
            </div>
            {this.makeTable()}
          </div>
        )}
      </div>
    );
  }
}

export default Board;
