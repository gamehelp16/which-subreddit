import React, { Component } from 'react';
import Post from './post';

class Posts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			data: {}
		}
		this.fetchData = this.fetchData.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.currentSub !== nextProps.currentSub) this.fetchData(nextProps);
	}

	fetchData(props) {
		let this2 = this;
		this2.setState({
			loaded: false,
			data: {}
		});

		if(props.currentSub === "") return;

		fetch('https://www.reddit.com/r/' + props.currentSub + '/new/.json?limit=5&raw_json=1').then(response => {
			if (response.status !== 200) {
				console.log('Response is not OK:', response.status);
				return;
			}
			response.json().then(function(data) {
				this2.setState({
					loaded: true,
					data: data
				});
				this2.props.stopLoading();
			});
		}).catch(err => {
			console.log('Error:', err);
		});
	}

	render() {
		if(!this.state.loaded) return (
			<div className="post__wrapper">
				<Post key={0} state={0} />
				<Post key={1} state={0} />
				<Post key={2} state={0} />
				<Post key={3} state={0} />
				<Post key={4} state={0} />
			</div>
		);

		let count = 0;
		return (
			<div className="post__wrapper">
				{
					this.state.data.data.children.map(data =>
						<Post key={count++} data={data} state={this.props.userSelection === '' ? 1 : 2} />
					)
				}
			</div>
		)
	}
}

export default Posts;