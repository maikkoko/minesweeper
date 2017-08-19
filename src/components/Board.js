import React, { Component } from 'react'
import PropTypes from 'prop-types'
import update from 'react-addons-update'

import Cell from './Cell'

import './Board.css'

export default class Board extends Component {

  static propTypes = {
    map         : PropTypes.arrayOf(PropTypes.array).isRequired,
    onUpdate    : PropTypes.func.isRequired
  }

  state = {
    board: null // UI state of board (open or close)
  }

  componentDidMount () {
    this.initBoard()
  }

  render () {
    let {board} = this.state
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
      this.onCellReveal(coords)
    } else if (context === 'flag') {
      this.onUpdateFlagState(coords)
    }
  }

  onCellReveal = (coords) => {
    let { board } = this.state
    let { map } = this.props
    let { x, y } = coords

    this.setState({
      board: update(board, { [x]: { [y]: { isRevealed: { $set: true } } } })
    })

    // Update Game State
    if (map[x][y] === '*') {
      this.props.onUpdate('gameOver')
    } else {
      this.props.onUpdate('reveal')    
    }
  }

  onUpdateFlagState = (coords) => {
    let { board } = this.state
    let { x, y } = coords
    let flagState = !board[x][y].isFlagged
    let operation = flagState ? 'add' : 'subtract'
    
    this.setState({
      board: update(board, { [x]: { [y]: { isFlagged: { $set: flagState } } } })
    })

    // Update Game State
    this.props.onUpdate('flag', operation)
  }
}