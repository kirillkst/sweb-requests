import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

const rootNode = document.getElementById('sweb-requests');

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	rootNode
);
