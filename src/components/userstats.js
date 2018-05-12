import React, { Component } from 'react';

class UserStats extends Component {
	constructor(props) {
		super(props);
		this.lives = this.lives.bind(this);
	}

	numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	lives() {
		const heart = <svg fill="#000000" height="30" viewBox="0 0 24 24" width="30" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;
		let data = [];
		for(let i=1;i<=3;i++) {
			let classes = "heart";
			if(this.props.lives < i) classes += " heart--empty";
			data.push(<span className={classes} key={i}>{heart}</span>);
		}
		return data;
	}

	render() {
		return (
			<div>
				<div className="user-stats--lives">{this.lives()}</div>
				<div className="user-stats--points">
					<b>{this.numberWithCommas(this.props.pts)}</b> pts. <span>(streak: <b>{this.numberWithCommas(this.props.streak)}</b>)</span>
				</div>
				<div style={{clear:'both'}}></div>
			</div>
		)
	}
}

export default UserStats;