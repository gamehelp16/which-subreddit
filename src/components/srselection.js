import React, { Component } from 'react';
import Skeleton from 'react-skeleton-loader';

class SrSelection extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	shouldComponentUpdate(nextProps) {
		if(nextProps.loaded === this.props.loaded && !this.props.loaded) return false;
		return true;
	}

	handleClick(e) {
		if(this.props.userSelection === '') this.props.setSelection(e.target.innerHTML);
	}

	getSubredditURL(subreddit) {
		return "https://www.reddit.com/r/" + subreddit;
	}

	selectionModifier(subreddit) {
		if(this.props.userSelection === '') return 'unselected';
		if(subreddit === this.props.currentSub) return 'correct';
		if(subreddit === this.props.userSelection) return 'false';
		return 'disabled';
	}

	render() {
		let count = 0;

		if(!this.props.loaded) {
			let skeleton = [];
			for(let i=0;i<10;i++) skeleton.push(<Skeleton key={count++} borderRadius="50px" color="#e6e6e6" width="170px" height="35px" widthRandomness={.6} />);

			return <div className="subreddit-selection__wrapper">{skeleton}</div>
		}

		return (
			<div className="subreddit-selection__wrapper">
				{
					this.props.subreddits.map(subreddit => {
						const element = <span key={count++} className={`subreddit-selection__item subreddit-selection__item--${this.selectionModifier(subreddit)}`} onClick={this.handleClick}>{subreddit}</span>;

						return this.props.userSelection === '' ? element : <a key={count++} href={this.getSubredditURL(subreddit)} target="_blank" rel="noopener noreferrer">{element}</a>;
					})
				}
			</div>
		)
	}
}

export default SrSelection;