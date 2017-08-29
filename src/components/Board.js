import React, { Component } from 'react'
import PropTypes from 'prop-types'
import update from 'react-addons-update'

import Cell from './Cell'

import './Board.css'

export default class Board extends Component {

  static propTypes = {
    map           : PropTypes.arrayOf(PropTypes.array).isRequired,
    onUpdate      : PropTypes.func.isRequired
  }

  state = {
    board: null // UI state of board (open or close)
  }

  componentDidMount () {
    this.initBoard()
  }

  render () {
    let { board } = this.state
    // Null check
    if (board) {
      let gameBoard = this.drawBoard()

      return (
        <div className="board">
          { gameBoard }
        </div>
      )
    }

    return (<div />)
  }

  initBoard = () => {
    let { map } = this.props
    
    let board = new Array(map.length)
    for (let row = 0; row < map.length; row++) {
      board[row] = new Array(map[row].length)
      for (let col = 0; col < board[row].length; col++) {
        board[row][col] = {
          isRevealed: false,
          isFlagged: false
        }
      }
    }

    this.setState({ board: board })
    this.props.onUpdate(board)
  }

  drawBoard = () => {
    let { map } = this.props
    let { board } = this.state

    let gameBoard = map.map((rowValue, rowIdx) => {
      let cellRow = rowValue.map((colValue, colIdx) => {
        let coords = {
          x: rowIdx,
          y: colIdx
        }

        return (
          <Cell
            uiState={board[rowIdx][colIdx]}
            onClick={this._onCellClick}
            key={'row-' + rowIdx + 'col-' + colIdx}
            coords={coords}
            value={colValue.toString()} />
        )
      })
      
      return (
        <div
          id={rowIdx}
          className='board-row'
          key={'row-' + rowIdx}>
          { cellRow }
        </div>
      )
    })

    return gameBoard
  }

  _onCellClick = (coords, context) => {
    if (context === 'reveal') {
      this.floodCells(coords)
    } else if (context === 'flag') {
      this.onUpdateFlagState(coords)
    }
  }

  floodCells = (coords) => {
    let { x, y } = coords
    let board = this.state.board

    let updatedBoard = update(board, { [x]: { [y]: { isRevealed: { $set: true } } } })

    if (this.props.map[x][y] !== 0) {
      this.revealCell(updatedBoard)      
      return
    }

    else if (board[x][y].isRevealed) {
      return
    }

    let Q = []
    this.revealCell(updatedBoard)
    Q.push(coords)
    
    while (Q.length > 0) {
      let { x, y } = Q[0]

      // NW
      let nwCoords = { x: x-1, y: y-1 }
      if (!this.isOutOfBounds(nwCoords) && !this.isCellRevealed(updatedBoard, nwCoords)) {
        updatedBoard = this.updateBoard(updatedBoard, nwCoords)
        if (this.hasNoNeighborMine(nwCoords)) {
          Q.push(nwCoords)
        }
      }
      // N
      let nCoords = { x: x-1, y: y }
      if (!this.isOutOfBounds(nCoords) && !this.isCellRevealed(updatedBoard, nCoords)) {
        updatedBoard = this.updateBoard(updatedBoard, nCoords)
        if (this.hasNoNeighborMine(nCoords)) {
          Q.push(nCoords)
        }
      }
      // NE
      let neCoords = { x: x-1, y: y+1 }
      if (!this.isOutOfBounds(neCoords) && !this.isCellRevealed(updatedBoard, neCoords)) {
        updatedBoard = this.updateBoard(updatedBoard, neCoords)
        if (this.hasNoNeighborMine(neCoords)) {
          Q.push(neCoords)
        }
      }
      // E
      let eCoords = { x: x, y: y+1 }
      if (!this.isOutOfBounds(eCoords) && !this.isCellRevealed(updatedBoard, eCoords)) {
        updatedBoard = this.updateBoard(updatedBoard, eCoords)
        if (this.hasNoNeighborMine(eCoords)) {
          Q.push(eCoords)
        }
      }
      // SE
      let seCoords = { x: x+1, y: y+1 }
      if (!this.isOutOfBounds(seCoords) && !this.isCellRevealed(updatedBoard, seCoords)) {
        updatedBoard = this.updateBoard(updatedBoard, seCoords)
        if (this.hasNoNeighborMine(seCoords)) {
          Q.push(seCoords)
        }
      }
      // S
      let sCoords = { x: x+1, y: y }
      if (!this.isOutOfBounds(sCoords) && !this.isCellRevealed(updatedBoard, sCoords)) {
        updatedBoard = this.updateBoard(updatedBoard, sCoords)
        if (this.hasNoNeighborMine(sCoords)) {
          Q.push(sCoords)
        }
      }
      // SW
      let swCoords = { x: x+1, y: y-1 }
      if (!this.isOutOfBounds(swCoords) && !this.isCellRevealed(updatedBoard, swCoords)) {
        updatedBoard = this.updateBoard(updatedBoard, swCoords)
        if (this.hasNoNeighborMine(swCoords)) {
          Q.push(swCoords)
        }
      }
      // W
      let wCoords = { x: x, y: y-1 }
      if (!this.isOutOfBounds(wCoords) && !this.isCellRevealed(updatedBoard, wCoords)) {
        updatedBoard = this.updateBoard(updatedBoard, wCoords)
        if (this.hasNoNeighborMine(wCoords)) {
          Q.push(wCoords)
        }
      }

      Q = Q.slice(1)

      this.revealCell(updatedBoard)
    }
  }

  revealCell = (updatedBoard) => {
    this.setState({ board: updatedBoard }) 
    this.props.onUpdate(updatedBoard)
  }

  isCellRevealed = (updatedBoard, coords) => {
    return updatedBoard[coords.x][coords.y].isRevealed
  }

  isOutOfBounds = (coords) => {
    let { x, y } = coords
    let { map } = this.props
    let height = map.length
    let width = map[0].length
    
    if (x >= 0 && x < height && y >= 0 && y < width) {
      return false
    }

    return true
  }

  hasNoNeighborMine = (coords) => {
    let { x, y } = coords
    let { map } = this.props

    return map[x][y] === 0
  }

  updateBoard = (board, coords) => {
    return update(board, { [coords.x]: { [coords.y]: { isRevealed: { $set: true } } } })
  }

  onUpdateFlagState = (coords) => {
    let { board } = this.state
    let { x, y } = coords
    let flagState = !board[x][y].isFlagged

    let updatedBoard = update(board, { [x]: { [y]: { isFlagged: { $set: flagState } } } })
    this.setState({ board: updatedBoard })

    // Update Game State
    this.props.onUpdate(updatedBoard)
  }
}