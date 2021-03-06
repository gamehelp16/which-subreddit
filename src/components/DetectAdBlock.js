/**
 *
 * Detect Ad Blockers
 *
 * Copyright (c) 2017 James Robert Perih
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation 
 * files (the "Software"), to deal in the Software without 
 * restriction, including without limitation the rights to use, 
 * copy, modify, merge, publish, distribute, sublicense, and/or sell  
 * copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following 
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { Component } from 'react';

class DetectAdBlock extends Component {
	
    constructor(props) {
		super(props);
		
        this.state = {
            adBlockDetected: false
		}
		
        this.detectAdBlocker = this.detectAdBlocker.bind(this);
	}

    componentDidMount() {
        this.detectAdBlocker();
	}
	
    componentWillUpdate(nextProps, nextState) {
        if (this.props.pathname !== nextProps.pathname) {
            this.detectAdBlocker();
        }
	}
	
    detectAdBlocker() {
        const head = document.getElementsByTagName('head')[0];
    
        const noAdBlockDetected = () => {
            this.setState({
                adBlockDetected: false
            });
		}
		
        const adBlockDetected = () => {
            this.setState({
                adBlockDetected: true
            });
		}
		
        // clean up stale bait
        const oldScript = document.getElementById('adblock-detection');
        if (oldScript) {
            head.removeChild(oldScript);
		}
		
        // we will dynamically generate some 'bait'.
        const script = document.createElement('script');
        script.id = 'adblock-detection';
        script.type = 'text/javascript';
        script.src = '/showads.js';
        script.onload = noAdBlockDetected;
		script.onerror = adBlockDetected;
		
        head.appendChild(script);
	}
	
    noticeContentJSX() {
        return (
            <div>
                It would be appreciated if you disable adblock for this site!
            </div>
        );
	}
	
    render() {
        return (
            <div id="no-ads">
                { this.state.adBlockDetected 
                  ? this.noticeContentJSX()
                  : null
                }
            </div>
        )
    }
}

DetectAdBlock.defaultProps = {
    pathname: ''
}

export default DetectAdBlock;