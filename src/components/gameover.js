import React, { Component } from 'react';

class GameOver extends Component {

	difficulties = [
		{ name: "baby", num: 5, lives: 2, none: 0 },
		{ name: "easy", num: 10, lives: 2, none: 0 },
		{ name: "medium", num: 15, lives: 3, none: 0 },
		{ name: "medium+", num: 15, lives: 3, none: .15 },
		{ name: "hard", num: 20, lives: 4, none: .2 },
		{ name: "expert", num: 30, lives: 5, none: .2 }
	]

	numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	render() {
		return (
			<div className="game-over__wrapper">
				Select difficulty:<br /><br />
				{
					this.difficulties.map(data => {
						return (
							<div className="game-over__difficulty" key={data.name}>
								<button className="button__new-game" onClick={() => this.props.newGame(data.num, data.none, data.lives)}>{data.name}</button>
								<span className="game-over__explainer">{data.num} subreddits, {data.lives} lives</span>
							</div>
						)
					})
				}
				<div className="game-over__tip">
					<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/></svg>
					On medium+ difficulty and higher there's a chance that the game will show posts from a subreddit that doesn't exist on the subreddit choice, in that case you need to choose the "none of them" option.
				</div>
			</div>
		)
	}
}

export default GameOver;