import React, { Component } from 'react'
import './Game.css'

import Board from './components/Board'
import Menu from './components/Menu'
import Dialog from './components/Dialog'

import * as Mine from './lib/mine'

const initialState = {
  map: null,
  mines: 0,
  flaggedCells: 0,
  revealedCells: 0,
  gameHeight: null,
  gameWidth: null,
  isGameOver: false,
  isWinner: false,
  difficulty: null,
  showDialog: false
}

class App extends Component {

  state = initialState

  componentDidMount () {
    document.title = 'React Minesweeper'
  }

  render() {
    let gameScreen = this.getGameScreen()
    let dialogText = ''

    if (this.state.map !== null) {
      if (this.state.isGameOver) {
        dialogText = 'You stepped on a bomb! Game Over!'
      }
      if (this.state.isWinner) {
        dialogText = 'Congratulations! You Win!'
      }
    }

    return (
      <div className='game'>
        <h2>Minesweeper</h2>
        <p><strong>Instructions: </strong>Left click to reveal cell. Right click to mark/flag.</p>

        { gameScreen }

        <Dialog
          text={dialogText}
          onClick={this.resetGame}
          isVisible={this.state.showDialog} />

      </div>
    )
  }

  getGameScreen = () => {
    return this.state.map !== null ?
      (
        <div>
          <Board
            onUpdate={this._onGameUpdate}
            map={this.state.map} />

          <p>bombs left: {this.state.mines - this.state.flaggedCells}</p>

          <div
            onClick={this.resetGame}
            className='game-button'>
            <p>Give Up!</p>
          </div>

        </div>
      ) : <Menu onLevelSelect={this._onCreateGame} />
  }

  resetGame = () => {
    this.setState(initialState)
  }

  _onCreateGame = (level) => {
    let mine = new Mine.Map(level)
    let boardDetails = mine.getBoardDetails()

    this.setState({
      map: mine.getMineField(),
      mines: boardDetails.mines,
      gameHeight: boardDetails.height,
      gameWidth: boardDetails.width
    })
  }

  _onGameUpdate = (context, operation) => {
    if (context === 'reveal') {
      let newRevealedCells = this.state.revealedCells + 1
      if (!this.checkGameState(newRevealedCells)) {
        this.setState({
          revealedCells: newRevealedCells
        })
      } else {
        this.setState({
          isWinner: true,
          showDialog: true
        })
      }
    } else if (context === 'flag') {
      let newFlaggedValue = this.state.flaggedCells

      if (operation === 'add') {
        newFlaggedValue++
      } else if (operation === 'subtract') {
        newFlaggedValue--
      }

      this.setState({
        flaggedCells: newFlaggedValue
      })
    } else {
      this.setState({
        isGameOver: true,
        showDialog: true
      })
    }
  }

  checkGameState = (newRevealedCells = null) => {
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

    return tilesRemaining === 0
  }
}

export default App;
