import React from 'react';
import DetectAdBlock from './DetectAdBlock';

const Ads = props => {

	if(props.noGame) return <div className="advertisement"></div>;

	return (
		<div className="advertisement">
			<iframe title="ad" data-aa="650128" src="//ad.a-ads.com/650128?size=728x90" scrolling="no" style={{width:'728px', height:'90px', border:'0px', padding:'0', overflow:'hidden'}} allowtransparency="true"></iframe>
			<DetectAdBlock pathname={window.location.pathname} />
		</div>
	)

}

export default Ads;