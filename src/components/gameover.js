import React, { Component } from 'react';

class GameOver extends Component {
	numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	render() {
		return (
			<div className="game-over__wrapper">
				<h2>No lives left!</h2>
				<div className="game-over__stats">
					<span>Score:</span> <b>{this.numberWithCommas(this.props.pts)}</b><br/>
					<span>Highest streak:</span> <b>{this.numberWithCommas(this.props.streakHigh2)}</b><br />
					<span><small>(this round)&nbsp;</small></span> <b></b><br /><br />
					<span>High score:</span> <b>{this.numberWithCommas(this.props.ptsHigh)}</b><br />
					<span>Highest streak:</span> <b>{this.numberWithCommas(this.props.streakHigh)}</b><br />
					<span><small>(all time)&nbsp;</small></span> <b></b><br /><br />
				</div>
				<button className="button__new-game" onClick={this.props.newGame}>Start New Game</button>
			</div>
		)
	}
}

export default GameOver;