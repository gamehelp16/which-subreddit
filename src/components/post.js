import React, { Component } from 'react';
import Skeleton from 'react-skeleton-loader';

class Post extends Component {
	constructor(props) {
		super(props);
		this.revealAll = this.revealAll.bind(this);
		this.topLine = this.topLine.bind(this);
		this.midLine = this.midLine.bind(this);
		this.bottomLine = this.bottomLine.bind(this);
	}

	shouldComponentUpdate(nextProps) {
		if(nextProps.state === this.props.state) return false;
		return true;
	}

	getFullPermalink(permalink) {
		return "https://www.reddit.com" + permalink;
	}

	getAuthorURL(author) {
		return "https://www.reddit.com/user/" + author;
	}

	numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	isLoading() {
		return this.props.state === 0;
	}

	revealAll() {
		return this.props.state === 2;
	}

	timeSince(date) {
		let seconds = Math.floor((new Date() - date) / 1000);

		let interval = Math.floor(seconds / 31536000);
		if (interval >= 1) return interval + " years";
		interval = Math.floor(seconds / 2592000);

		if (interval >= 1) return interval + " months";
		interval = Math.floor(seconds / 86400);

		if (interval >= 1) return interval + " days";
		interval = Math.floor(seconds / 3600);

		if (interval >= 1) return interval + " hours";
		interval = Math.floor(seconds / 60);

		if (interval >= 1) return interval + " minutes";

		return Math.floor(seconds) + " seconds";
	}

	topLine() {
		if(this.isLoading()) return <Skeleton borderRadius="0px" color="#e6e6e6" />
		return (
			<span>
				<b>{this.revealAll() ? this.numberWithCommas(this.props.data.data.score) : '?'}</b> points&nbsp;-&nbsp;
				{
					this.revealAll() ?
					<a href={this.getFullPermalink(this.props.data.data.permalink)} target="_blank" rel="noopener noreferrer">
						<b>{this.numberWithCommas(this.props.data.data.num_comments)}</b> comments
					</a> :
					<span><b>?</b> comments</span>
				}
			</span>
		)
	}

	midLine() {
		if(this.isLoading()) {
			const skeletonThing = [];
			let count = 0;
			for(let i=0;i<Math.floor(Math.random()*3);i++) {
				skeletonThing.push(<div key={count++}><Skeleton key={count++} borderRadius="0px" width="100%" widthRandomness={0} color="#e6e6e6" /><br /></div>);
			}
			skeletonThing.push(<div key={count++}><Skeleton borderRadius="0px" width="100%" widthRandomness={.75} color="#e6e6e6" /></div>);
			return <div>{skeletonThing}</div>
		}

		return this.revealAll() ?
			<a className="post__actual-title" href={this.props.data.data.url} target="_blank" rel="noopener noreferrer">{this.props.data.data.title}</a> :
			<span className="post__actual-title">{this.props.data.data.title}</span>
	}

	bottomLine() {
		if(this.isLoading()) return <Skeleton borderRadius="0px" color="#e6e6e6" width="200px" />
		return (
			<span>
				{ this.revealAll() && this.props.data.data.over_18 ? <span className="post__item-nsfw">NSFW</span> : '' }
				{ this.revealAll() && this.props.data.data.spoiler ? <span className="post__item-spoiler">SPOILER</span> : '' }
				Posted by&nbsp;
				<b>
					{
						this.revealAll() ?
						<a href={this.getAuthorURL(this.props.data.data.author)} target="_blank" rel="noopener noreferrer">{this.props.data.data.author}</a> :
						'???'
					}
				</b>&nbsp;
				{this.revealAll() ? this.timeSince(new Date(parseInt(this.props.data.data.created_utc, 10)*1000)) : 'some time'} ago
			</span>
		)
	}

	render() {
		return (
			<div className="post__item">
				<small>{this.topLine()}</small>
				<div className="post__title">
					{this.midLine()}
				</div>
				<small>{this.bottomLine()}</small>
			</div>
		)
	}
}

export default Post;