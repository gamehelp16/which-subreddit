import React, { Component } from 'react';
import Skeleton from 'react-skeleton-loader';

class Post extends Component {
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

	render() {

		if(this.isLoading()) {
			const skeletonThing = [];
			for(let i=Math.floor(Math.random()*3);i>=0;i--) {
				skeletonThing.push(<div key={i}><Skeleton borderRadius="0px" width="100%" widthRandomness={i === 0 ? .75 : 0} color="#e6e6e6" /><br /></div>);
			}

			return (
				<div className="post__item post__item--loading">
					<small><Skeleton borderRadius="0px" color="#e6e6e6" /></small>
					<div className="post__title">{skeletonThing}</div>
					<small><Skeleton borderRadius="0px" color="#e6e6e6" width="200px" /></small>
				</div>
			);
		}

		return (
			<div className="post__item">

				<small>
					<span>
						<b>{this.revealAll() ? this.numberWithCommas(this.props.data.data.score) : '?'}</b>
						&nbsp;points -&nbsp;
						{
							this.revealAll() ?
							<a href={this.getFullPermalink(this.props.data.data.permalink)} target="_blank" rel="noopener noreferrer">
								<b>{this.numberWithCommas(this.props.data.data.num_comments)}</b> comments
							</a> :
							<span><b>?</b> comments</span>
						}
					</span>
				</small>

				<div className="post__title">
					{
						this.revealAll() ?
						<a className="post__actual-title" href={this.props.data.data.url} target="_blank" rel="noopener noreferrer">{this.props.data.data.title}</a> :
						<span className="post__actual-title">{this.props.data.data.title}</span>
					}
				</div>

				<small>
					<span>
						{
							this.revealAll() && this.props.data.data.over_18 ?
							<span className="post__item-nsfw">NSFW</span> : ''
						}
						{
							this.revealAll() && this.props.data.data.spoiler ?
							<span className="post__item-spoiler">SPOILER</span> : ''
						}
						submitted {this.revealAll() ? this.timeSince(new Date(parseInt(this.props.data.data.created_utc, 10)*1000)) : 'some time'} ago by&nbsp;
						<b>{
							this.revealAll() ?
							<a href={this.getAuthorURL(this.props.data.data.author)} target="_blank" rel="noopener noreferrer">{this.props.data.data.author}</a> :
							'???'
						}</b>
					</span>
				</small>

			</div>
		);
	}
}

export default Post;