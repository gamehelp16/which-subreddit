import React, { Component } from 'react';
import Skeleton from 'react-skeleton-loader';
import FlipMove from 'react-flip-move';

class SrSelection extends Component {
	shouldComponentUpdate(nextProps) {
		if(this.props.subsFailedToLoad !== nextProps.subsFailedToLoad) return true;
		else if(this.props.subsLoaded === nextProps.subsLoaded && !this.props.subsLoaded) return false;
		return true;
	}

	handleClick(subreddit) {
		if(this.props.userSelection === '' && this.props.postsLoaded) this.props.setSelection(subreddit);
	}

	selectionModifier(subreddit) {
		if(!this.props.postsLoaded) return 'disabled';
		else if(this.props.userSelection === '') return 'unselected';
		else if(this.props.userIsCorrect(subreddit)) return 'correct';
		else if(subreddit === this.props.userSelection) return 'false';
		return 'disabled';
	}

	render() {

		if(this.props.subsFailedToLoad) {
			return (
				<div className="subreddit-selection__wrapper subreddit-selection__wrapper--error">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>
					<h2>Ouch, failed to load subreddits!</h2>
					Check your network connection, then <span onClick={() => this.props.retrySubLoading()}>try again</span>.
				</div>
			);
		}

		if(!this.props.subsLoaded) {
			let skeleton = [];
			let plus = (this.props.noneProbability > 0) ? 1 : 0;
			for(let i=0;i<this.props.numSubs+plus;i++) skeleton.push(<span key={i}><Skeleton borderRadius="50px" color="#e6e6e6" width="150px" height="34px" widthRandomness={.6} /></span>);
			return <FlipMove className="subreddit-selection__wrapper" staggerDelayBy={10} appearAnimation="fade">{skeleton}</FlipMove>;
		}

		let subredditList = [];
		this.props.subreddits.map(subreddit => subredditList.push(subreddit));
		if(this.props.noneProbability > 0) subredditList.push('none of them');

		return (
			<FlipMove className="subreddit-selection__wrapper" staggerDelayBy={10} appearAnimation="fade">
				{
					subredditList.map(subreddit => {
						return <span key={subreddit} className={`subreddit-selection__item subreddit-selection__item--${this.selectionModifier(subreddit)} ${subreddit === 'none of them' ? 'subreddit-selection__item--noneofthem' : ''}`} onClick={() => this.handleClick(subreddit)}>{subreddit}</span>;
					})
				}
			</FlipMove>
		)

	}
}

export default SrSelection;