import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { GithubProvider } from './context/context';
import { Auth0Provider } from '@auth0/auth0-react';

//Client ID: w25MF3IUHFpr0Tk5wdt0ACK2x0UDWJMc
//Domain : https://dev-toaj4m64.us.auth0.com/api/v2/

ReactDOM.render(
	<React.StrictMode>
		<Auth0Provider
			domain='dev-toaj4m64.us.auth0.com'
			clientId='w25MF3IUHFpr0Tk5wdt0ACK2x0UDWJMc'
			redirectUri={window.location.origin}
			cacheLocation='localstorage'>
			<GithubProvider>
				<App />
			</GithubProvider>
		</Auth0Provider>
	</React.StrictMode>,
	document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
