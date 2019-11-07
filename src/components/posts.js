import React, { Component } from 'react';
import Post from './post';
import FlipMove from 'react-flip-move';

class Posts extends Component {

	constructor(props) {
		super(props);
		this.state = {
			data: {},
			failToLoad: false
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.currentSub !== nextProps.currentSub || this.props.accessToken !== nextProps.accessToken || this.props.someNumber !== nextProps.someNumber)
			this.fetchData(nextProps);
	}

	fetchData(props) {

		let this2 = this;
		props.startPostLoading();

		this.setState({
			failToLoad: false
		}, () => {

			if(new Date().getTime() >= props.accessTokenExpiration) {
				props.getAccessToken(
					() => {},
					() => this.setState({
						failToLoad: true
					})
				);
				return;
			}

			let subreddit = props.currentSub;
			if(subreddit === "") return;

			fetch('https://oauth.reddit.com/r/' + subreddit + '/new/.json?limit=5&raw_json=1', {
				method: 'get',
				headers: { 'Authorization': `Bearer ${props.accessToken}` }
			}).then(response => {

				if(response.status !== 200) {
					this.setState({
						failToLoad: true
					});
					console.error('Failed to load posts! (unexpected response)');
					console.error(response);
					return;
				}

				response.json().then(data => {
					this2.setState({
						data: data
					}, () => {
						props.stopPostLoading();
					});
				});

			}).catch(err => {
				this.setState({
					failToLoad: true
				});
				console.error('Failed to load posts! (cannot connect to reddit)');
			});

		});

	}

	render() {

		if(this.props.noGame) return (
			<div className="post__wrapper"></div>
		);

		if(this.state.failToLoad) return (
			<div className="post__wrapper post__wrapper--error">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>
				<h2>Ouch, failed to load posts!</h2>
				Check your network connection, then <span onClick={() => this.props.retryPostLoading()}>try again</span>.
			</div>
		);

		if(!this.props.postsLoaded) return (
			<FlipMove className="post__wrapper" staggerDelayBy={10} appearAnimation="fade" enterAnimation="fade" leaveAnimation="fade" maintainContainerHeight={true}>
				<Post key={0} state={0} />
				<Post key={1} state={0} />
				<Post key={2} state={0} />
				<Post key={3} state={0} />
				<Post key={4} state={0} />
			</FlipMove>
		);

		return (
			<FlipMove className="post__wrapper" staggerDelayBy={10} appearAnimation="fade" enterAnimation="fade" leaveAnimation="fade" maintainContainerHeight={true}>
				{
					this.state.data.data.children.map(data =>
						<Post key={data.data.name} data={data} state={this.props.userSelection === '' ? 1 : 2} />
					)
				}
			</FlipMove>
		)

	}

}

export default Posts;