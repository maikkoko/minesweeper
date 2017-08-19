import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Menu.css'

import {
  BEGINNER,
  INTERMEDIATE,
  EXPERT
} from '../lib/mine'

export default class Menu extends Component {

  static propTypes = {
    onLevelSelect     : PropTypes.func.isRequired
  }

  render () {
    return (
      <div className='menu'>
        <div className='menu-header'>
          <h3>New Game!</h3>
        </div>
        
        <div
          className='menu-item'
          onClick={this._onClick}
          id={BEGINNER}>
          <p id={BEGINNER}>Beginner</p>
        </div>
        <div
          className='menu-item'
          onClick={this._onClick}
          id={INTERMEDIATE}>
          <p id={INTERMEDIATE}>Intermediate</p>
        </div>
        <div
          className='menu-item'
          onClick={this._onClick}
          id={EXPERT}>  
          <p id={EXPERT}>Expert</p>
        </div>
      </div>
    )
  }

  _onClick = (event) => {
    this.props.onLevelSelect(event.target.id)
  }
}