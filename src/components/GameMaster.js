import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class GameMaster extends Component {

  static propTypes = {
    board         : PropTypes.array,
    map           : PropTypes.array.isRequired,
    boardDetails  : PropTypes.object.isRequired,
    onGameOver    : PropTypes.func.isRequired,
    onGameWin     : PropTypes.func.isRequired
  }

  state = {
    mines: 0,
    flaggedCells: 0,
    revealedCells: 0,
    gameHeight: 0,
    gameWidth: 0,
  }

  componentWillReceiveProps (nextProps) {
    let props = this.props
    
    if (props.board !== nextProps.board) {
      this.updateGameState(nextProps.board)
    }
  }

  componentDidMount () {
    this.setupGameMaster()
  }

  render () {
    return (
      <p>bombs left: {this.state.mines - this.state.flaggedCells}</p>
    )
  }

  setupGameMaster = () => {
    let { boardDetails } = this.props
    this.setState({
      mines: boardDetails.mines,
      gameHeight: boardDetails.height,
      gameWidth: boardDetails.width
    })
  }

  updateGameState = (board) => {
    let { map } = this.props
    let revealedCells = 0
    let flaggedCells = 0    

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col].isRevealed) {
          revealedCells += 1
          if (map[row][col] === '*') {
            this.props.onGameOver()
            break
          }
        }

        if (board[row][col].isFlagged) {
          flaggedCells += 1
        }
      }
    }

    this.setState({
      revealedCells  : revealedCells,
      flaggedCells   : flaggedCells
    })

    if (this.hasWonGame(revealedCells)) {
      this.props.onGameWin()
    }
  }

  hasWonGame = (newRevealedCells) => {
    let {
      revealedCells,
      gameHeight,
      gameWidth,
      mines
    } = this.state

    if (newRevealedCells) {
      revealedCells = newRevealedCells
    }

    let totalCells = gameHeight * gameWidth

    let tilesRemaining = totalCells - revealedCells - mines 

    return tilesRemaining === 0 && mines !== 0
  }
  
}