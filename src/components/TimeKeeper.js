import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

export default class TimeKeeper extends Component {

  static propTypes = {
    hasStarted : PropTypes.bool,
    reportTime : PropTypes.func.isRequired
  }

  state = {
    counter     : 10,
    time        : moment().minutes(0).seconds(0).milliseconds(0),
    hasStarted  : false,
    hasStopped  : false
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.hasStarted && nextProps.hasStarted) {
      this.interval = setInterval(this.timer, 10)
    }

    if (!this.props.hasStopped && nextProps.hasStopped) {
      this.props.reportTime(this.state.time)
      clearInterval(this.interval)
    }
  }  

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    let { time } = this.state

    return (
      <p>time: { time.format('mm:ss.SS') }</p>
    )
  }

  timer = () => {
    let { counter } = this.state
    counter = counter + 10

    let time = moment().hours(0).minutes(0).seconds(0).milliseconds(counter)

    this.setState({
      counter: counter,
      time: time
    })
  }
}