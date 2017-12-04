import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import {
  Router,
  Route,
	Link,
	Switch,
} from 'react-router-dom';

import App from './App';

const render = (Component) => {
  ReactDOM.render(
		<AppContainer>
			<Component/>
		</AppContainer>,
    document.getElementById('app'),
  );
};

render(App);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./App', () => { render(App); });
}

