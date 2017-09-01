import React, { Component } from 'react'
import './Game.css'

import Board from './components/Board'
import Menu from './components/Menu'
import Dialog from './components/Dialog'
import GameMaster from './components/GameMaster'
import TimeKeeper from './components/TimeKeeper'

import * as Mine from './lib/mine'

const initialState = {
  board: null,
  boardDetails: null,
  map: null,
  isGameOver: false,
  isWinner: false,
  difficulty: null,
  showDialog: false,
  hasStarted: false,
  time: null
}

class App extends Component {

  state = initialState

  componentDidMount () {
    document.title = 'React Minesweeper'
  }

  render() {
    let gameScreen = this.getGameScreen()
    let context

    if (this.state.map !== null) {
      if (this.state.isGameOver) {
        context = 'GAMEOVER'
      }
      if (this.state.isWinner) {
        context = 'WIN'
      }
    }

    let dialog = this.state.showDialog
      ? (
        <Dialog
          context={context}
          onClick={this.resetGame}
          time={this.state.time}
          isVisible={this.state.showDialog} />
      ) : null

    return (
      <div className='game'>
        <h2>Minesweeper</h2>
        <p><strong>Instructions: </strong>Left click to reveal cell. Right click to mark/flag.</p>

        { gameScreen }

        { dialog }

      </div>
    )
  }

  getGameScreen = () => {
    return this.state.map !== null ?
      (
        <div>
          <Board
            isGameOver={this.state.isGameOver}
            onUpdate={this._onGameUpdate}
            map={this.state.map} />

            <TimeKeeper
              reportTime={this._recordTime}
              hasStarted={this.state.hasStarted}
              hasStopped={this.state.isGameOver || this.state.isWinner } />

            <GameMaster
              boardDetails={this.state.boardDetails}
              map={this.state.map}
              board={this.state.board}
              onGameWin={this._onGameWin}
              onGameOver={this._onGameOver} />
  
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
      map           : mine.getMineField(),
      boardDetails  : boardDetails
    })
  }

  _onGameWin = () => {
    this.setState({
      isWinner: true,
      showDialog: true
    })
  }

  _onGameOver = () => {
    this.setState({
      isGameOver: true,
      showDialog: true
    })
  }

  _onGameUpdate = (updatedBoard) => {
    this.setState({ board: updatedBoard })

    if (!this.state.hasStarted && this.state.board !== null) {
      this.setState({ hasStarted: true })
    }
  }

  _recordTime = (time) => {
    this.setState({ time: time })
  }
}

export default App;
