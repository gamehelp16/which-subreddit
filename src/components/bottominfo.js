import React from 'react';

const BottomInfo = props => {
	if(props.userSelection === '') return <div></div>

	let resultModifier = props.currentSub === props.userSelection ? 'bottom-info__result--correct' : 'bottom-info__result--false';
	return (
		<div className="bottom-info">
			<div className={`bottom-info__result ${resultModifier}`}>
				{
					props.currentSub === props.userSelection ?
					'Correct! ' :
					'Wrong! The correct answer is ' + props.currentSub + '. '
				}
				<span className="button__new-level" onClick={props.newLevel}>Continue &raquo;</span>
			</div>
			<div className="bottom-info__tip">
				<img src='data:image/svg+xml;utf8,<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/></svg>' alt="" />
				<small>Protip: Some parts of the posts are links that you can click, just in case a post intrigues you ;)</small>
			</div>
		</div>
	)
}

export default BottomInfo;