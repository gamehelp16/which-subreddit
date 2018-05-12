import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from './components/header';
import UserStats from './components/userstats';
import Posts from './components/posts';
import SrSelection from './components/srselection';
import BottomInfo from './components/bottominfo';
import GameOver from './components/gameover';
import About from './components/about';
import registerServiceWorker from './registerServiceWorker';
import './style.css';

let numSelection = 10;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			subreddits: [],
			currentSub: '',
			userSelection: '',
			gameOver: false,
			lives: 3,
			pts: 0,
			streak: 0,
			streakHigh2: 0, // highest streak this round
			ptsHigh: localStorage.getItem('ptsHigh') === null ? 0 : localStorage.getItem('ptsHigh'),
			streakHigh: localStorage.getItem('streakHigh') === null ? 0 : localStorage.getItem('streakHigh'), // highest streak all time
		}

		localStorage.setItem('ptsHigh', this.state.ptsHigh);
		localStorage.setItem('streakHigh', this.state.streakHigh);

		this.newGame = this.newGame.bind(this);
		this.newLevel = this.newLevel.bind(this);
		this.getRandomSubreddits = this.getRandomSubreddits.bind(this);
		this.setUserSelection = this.setUserSelection.bind(this);
		this.stopLoading = this.stopLoading.bind(this);
	}

	componentDidMount() {
		this.newGame();
	}

	stopLoading() {
		this.setState({
			loaded: true
		});
	}

	newGame() {
		this.setState({
			subreddits: [],
			gameOver: false,
			lives: 3,
			pts: 0,
			streak: 0,
			streakHigh2: 0
		}, () => {
			this.newLevel();
		});
	}

	newLevel() {
		if(this.state.lives === 0) {
			this.setState({
				gameOver: true
			});
			return;
		}

		this.setState({
			loaded: false,
			subreddits: this.state.subreddits.slice(numSelection),
			currentSub: '',
			userSelection: ''
		}, () => {
			if(this.state.subreddits.length >= numSelection) {
				let subreddits = this.state.subreddits;
				this.setState({
					currentSub: subreddits[Math.floor(Math.random() * numSelection)]
				});
				return;
			}
			this.getRandomSubreddits();
		});
	}

	getRandomSubreddits() {
		let this2 = this;

		fetch('https://www.reddit.com/r/all/new/.json').then(response => {
			if (response.status !== 200) {
				console.log('Response is not OK:', response.status);
				return;
			}
			response.json().then(function(data) {
				let subreddits = this2.state.subreddits;
				for(let i=0;i<data.data.children.length;i++) {
					if(subreddits.includes(data.data.children[i].data.subreddit) ||
						data.data.children[i].data.subreddit.includes('u_')) continue;
					subreddits.push(data.data.children[i].data.subreddit);
				}
				this2.setState({
					subreddits: subreddits,
					currentSub: subreddits[Math.floor(Math.random() * numSelection)]
				});
			});
		}).catch(err => {
			console.log('Error:', err);
		});
	}

	setUserSelection(selection) {
		this.setState({
			userSelection: selection
		});

		if(selection === this.state.currentSub) {
			let playerStreakNew = this.state.streak + 1;
			let playerPtsNew = this.state.pts + 99 + playerStreakNew;
			this.setState({
				pts: playerPtsNew,
				ptsHigh: Math.max(this.state.ptsHigh, playerPtsNew),
				streak: playerStreakNew,
				streakHigh2: Math.max(this.state.streakHigh2, playerStreakNew),
				streakHigh: Math.max(this.state.streakHigh, playerStreakNew),
			}, () => {
				localStorage.setItem('ptsHigh', this.state.ptsHigh);
				localStorage.setItem('streakHigh', this.state.streakHigh);
			});
		}
		else {
			this.setState({
				lives: this.state.lives - 1,
				streak: 0,
			});
		}
	}

	render() {
		return (
			<div className="wrapper">
				<div className="content__right">
					<Posts currentSub={this.state.currentSub} stopLoading={this.stopLoading} userSelection={this.state.userSelection} />
				</div>
				<div className="content__left">
					<Header />
					<UserStats lives={this.state.lives} pts={this.state.pts} streak={this.state.streak} />
					{
						this.state.gameOver ? <GameOver pts={this.state.pts} streakHigh2={this.state.streakHigh2} ptsHigh={this.state.ptsHigh} streakHigh={this.state.streakHigh} newGame={this.newGame} /> : ''
					}
					{
						this.state.gameOver ? '' :
							<SrSelection loaded={this.state.loaded} subreddits={this.state.subreddits.slice(0, numSelection)} setSelection={this.setUserSelection} userSelection={this.state.userSelection} currentSub={this.state.currentSub} />
					}
					{
						this.state.gameOver ? '' :
							<BottomInfo loaded={this.state.loaded} currentSub={this.state.currentSub} userSelection={this.state.userSelection} newLevel={this.newLevel} />
					}
					<About />
				</div>
				<div style={{clear:'both'}}></div>
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
