import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from './components/header';
import UserStats from './components/userstats';
import Posts from './components/posts';
import SrSelection from './components/srselection';
import BottomInfo from './components/bottominfo';
import GameOver from './components/gameover';
import About from './components/about';
import Ads from './components/ads';
import registerServiceWorker from './registerServiceWorker';
import './style.css';

class App extends Component {

	constructor(props) {

		super(props);

		this.state = {
			accessToken: '',
			accessTokenExpiration: 0,
			UUID: localStorage.getItem('UUID') === null ? this.genUUID() : localStorage.getItem('UUID'),
			subsFailedToLoad: false,
			subsLoaded: false,
			postsLoaded: false,
			someNumber: 0,
			noGame: true,
			subreddits: [],
			numSubs: 0,
			secretSubreddits: [],
			secretSubredditsMax: 0,
			currentSub: '',
			noneProbability: 0,
			userSelection: '',
			gameOver: true,
			lives: 0,
			maxLives: 0
		}

		this.getAccessToken = this.getAccessToken.bind(this);
		this.newGame = this.newGame.bind(this);
		this.newLevel = this.newLevel.bind(this);
		this.retrySubLoading = this.retrySubLoading.bind(this);
		this.retryPostLoading = this.retryPostLoading.bind(this);
		this.startPostLoading = this.startPostLoading.bind(this);
		this.stopPostLoading = this.stopPostLoading.bind(this);
		this.setUserSelection = this.setUserSelection.bind(this);
		this.userIsCorrect = this.userIsCorrect.bind(this);

	}

	componentDidMount() {
		localStorage.setItem('UUID', this.state.UUID);
	}

	genUUID() { // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
		return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16) // eslint-disable-line
		)
	}

	getAccessToken(callback, errCallback) {
		let data = new FormData();
		data.append('grant_type', 'https://oauth.reddit.com/grants/installed_client');
		data.append('device_id', this.state.UUID);

		fetch('https://www.reddit.com/api/v1/access_token', {
			method: 'post', 
			body: data,
			headers: { 'Authorization': 'Basic dnRLWFgwS00zX2cwUGc6' }
		}).then(res => {
			if(res.status !== 200) {
				console.error('Failed to request access token! (unexpected response)');
				console.error(res);
				typeof errCallback === 'function' && errCallback();
				return;
			}

			res.json().then(data => {
				if(!data.access_token) {
					console.error('Failed to request access token! (no access token)');
					console.error(data);
					typeof errCallback === 'function' && errCallback();
					return;
				}

				let now = new Date();
				now.setSeconds(now.getSeconds() + data.expires_in - 10); // 3597
	
				this.setState({
					accessToken: data.access_token,
					accessTokenExpiration: now.getTime(),
				}, () => {
					typeof callback === 'function' && callback();
				});
			});
		}).catch(() => {
			console.error('Failed to request access token! (cannot connect to reddit)');
			typeof errCallback === 'function' && errCallback();
		});
	}

	newGame(numSubs, noneProbability, lives) {
		this.setState({
			subsFailedToLoad: false,
			subsLoaded: false,
			postsLoaded: false,
			noGame: false,
			subreddits: [],
			numSubs: numSubs,
			secretSubreddits: [],
			secretSubredditsMax: (noneProbability > 0) ? 21 : 1,
			currentSub: '',
			noneProbability: noneProbability,
			userSelection: '',
			gameOver: false,
			lives: lives,
			maxLives: lives
		}, () => {
			this.getRandomSubreddits();
		});
	}

	newLevel() {
		let subreddits = this.state.subreddits;
		for(let i=0;i<subreddits.length;i++) {
			if(subreddits[i] === this.state.currentSub) {
				subreddits.splice(i, 1);
				break;
			}
		}

		let secretSubreddits = this.state.secretSubreddits;
		for(let i=0;i<secretSubreddits.length;i++) {
			if(secretSubreddits[i] === this.state.currentSub) {
				secretSubreddits.splice(i, 1);
				break;
			}
		}

		if(this.state.lives === 0 || subreddits.length === 0) {
			this.setState({
				gameOver: true
			});
			return;
		}

		let newSub = subreddits[Math.floor(Math.random() * subreddits.length)];
		if(Math.random() < this.state.noneProbability && secretSubreddits.length > 1) newSub = secretSubreddits[Math.floor(Math.random() * secretSubreddits.length)];

		this.setState({
			subreddits: subreddits,
			secretSubreddits: secretSubreddits,
			currentSub: newSub,
			userSelection: ''
		});
	}

	getRandomSubreddits() {
		if(new Date().getTime() >= this.state.accessTokenExpiration) {
			this.getAccessToken(
				() => this.getRandomSubreddits(),
				() => this.setState({
					subsFailedToLoad: true
				})
			);
			return;
		}

		let this2 = this;

		let limit = Math.min(100, this.state.secretSubredditsMax - this.state.secretSubreddits.length + this.state.numSubs - this.state.subreddits.length + 10);

		let url = 'https://oauth.reddit.com/r/all/comments/?limit=' + limit;

		fetch(url, {
			method: 'get',
			headers: { 'Authorization': `Bearer ${this2.state.accessToken}` }
		}).then(response => {

			if(response.status !== 200) {
				this.setState({
					subsFailedToLoad: true
				});
				console.error('Failed to load subreddits! (unexpected response)');
				console.error(response);
				return;
			}

			response.json().then(data => {
				let subreddits = this2.state.subreddits;
				let secretSubreddits = this2.state.secretSubreddits;

				for(let i=0;i<data.data.children.length;i++) {

					if(subreddits.length >= this2.state.numSubs && secretSubreddits.length >= this2.state.secretSubredditsMax) break;

					let currentSub = data.data.children[i].data.subreddit;

					if(subreddits.includes(currentSub) || secretSubreddits.includes(currentSub) || currentSub.includes('u_') || data.data.children[i].data.over_18) continue;

					if(subreddits.length < this2.state.numSubs) subreddits.push(currentSub);
					else secretSubreddits.push(currentSub);

				}

				this2.setState({
					subreddits: subreddits.sort((a, b) => {
						a = a.toLowerCase();
						b = b.toLowerCase();
						if(a < b) return -1;
						else if(a > b) return 1;
						return 0;
					}),
					secretSubreddits: secretSubreddits
				}, () => {
					if(subreddits.length < this2.state.numSubs || secretSubreddits.length < this2.state.secretSubredditsMax)
						this2.getRandomSubreddits();
					else {
						this2.setState({
							subsLoaded: true
						}, () => {
							this2.newLevel();
						});
					}
				});
			});

		}).catch(() => {
			this.setState({
				subsFailedToLoad: true
			});
			console.error('Failed to load subreddits! (cannot connect to reddit)');
		});
	}

	retrySubLoading() {
		this.setState({
			subsFailedToLoad: false
		}, () => {
			this.getRandomSubreddits();
		});
	}

	retryPostLoading() {
		this.setState(state => ({
			someNumber: state.someNumber + 1
		}));
	}

	startPostLoading() {
		this.setState({
			postsLoaded: false
		});
	}

	stopPostLoading() {
		this.setState({
			postsLoaded: true
		});
	}

	userIsCorrect(selection) {
		if(selection !== 'none of them') return selection === this.state.currentSub;
		else return this.state.secretSubreddits.includes(this.state.currentSub);
	}

	setUserSelection(selection) {
		this.setState({
			userSelection: selection
		});

		if(!this.userIsCorrect(selection)) {
			this.setState(state => ({
				lives: state.lives - 1
			}));
		}
	}

	render() {

		let mainArea;
		if(this.state.gameOver) mainArea = <GameOver newGame={this.newGame} />;
		else {
			mainArea = (
				<div>
					<UserStats
						lives={this.state.lives}
						maxLives={this.state.maxLives}
						subreddits={this.state.subreddits}
						numSubs={this.state.numSubs} />
					<SrSelection
						retrySubLoading={this.retrySubLoading}
						subsFailedToLoad={this.state.subsFailedToLoad}
						subsLoaded={this.state.subsLoaded}
						postsLoaded={this.state.postsLoaded}
						subreddits={this.state.subreddits}
						numSubs={this.state.numSubs}
						setSelection={this.setUserSelection}
						currentSub={this.state.currentSub}
						noneProbability={this.state.noneProbability}
						userSelection={this.state.userSelection}
						userIsCorrect={this.userIsCorrect} />
					<BottomInfo
						currentSub={this.state.currentSub}
						userSelection={this.state.userSelection}
						userIsCorrect={this.userIsCorrect}
						newLevel={this.newLevel} />
				</div>
			);
		}

		return (
			<div className="wrapper">
				<div className="content__right">
					<Posts
						accessToken={this.state.accessToken}
						accessTokenExpiration={this.state.accessTokenExpiration}
						getAccessToken={this.getAccessToken}
						noGame={this.state.noGame}
						postsLoaded={this.state.postsLoaded}
						someNumber={this.state.someNumber}
						secretSubreddits={this.state.secretSubreddits}
						currentSub={this.state.currentSub}
						retryPostLoading={this.retryPostLoading}
						startPostLoading={this.startPostLoading}
						stopPostLoading={this.stopPostLoading}
						userSelection={this.state.userSelection} />
					<Ads noGame={this.state.noGame} />
				</div>
				<div className="content__left">
					<Header />
					{mainArea}
					<About />
				</div>
				<div style={{clear:'both'}}></div>
			</div>
		)

	}

}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
