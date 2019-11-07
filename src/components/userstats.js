import React, { Component } from 'react';

class UserStats extends Component {
	numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	render() {
		let lives = [];
		for(let i=1;i<=this.props.maxLives;i++) {
			lives.push(
				<span className={`heart ${this.props.lives < i ? 'heart--empty' : ''}`} key={i}>
					<svg fill="#000000" height="30" viewBox="0 0 24 24" width="30" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 0h24v24H0z" fill="none"/>
						<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
					</svg>
				</span>
			);
		}

		return (
			<div>
				<div className="user-stats--lives">{lives}</div>
				<div className="user-stats--subreddits"><b>{this.props.subreddits.length}</b> out of {this.props.numSubs} subreddits to go</div>
				<div style={{clear:'both'}}></div>
			</div>
		)
	}
}

export default UserStats;