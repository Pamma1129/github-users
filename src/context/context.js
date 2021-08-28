import React, { useState, useEffect, useContext, createContext } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = createContext();

// Provider and consumer
const GithubProvider = ({ children }) => {
	const [githubUser, setGithubUser] = useState(mockUser);
	const [githubRepos, setGithubRepos] = useState(mockRepos);
	const [githubFollowers, setGithubFollowers] = useState(mockFollowers);
	const [request, setRequest] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState({ show: false, msg: '' });

	const checkRequest = () => {
		axios(`${rootUrl}/rate_limit`)
			.then(({ data }) => {
				let {
					rate: { remaining },
				} = data;
				setRequest(remaining);
				if (remaining === 0) {
					toggleError(
						true,
						'No more request left, Please try again after sometime!',
					);
				}
			})
			.catch(error => {
				toggleError(true, error.message);
			});
	};

	const toggleError = (show = false, msg = '') => {
		setError({ show, msg });
	};

	const searchGithubUser = async user => {
		toggleError();
		setLoading(true);
		const response = await axios(`${rootUrl}/users/${user}`).catch(error =>
			console.log(error),
		);
		if (response) {
			setGithubUser(response.data);
			const { repos_url, followers_url } = response.data;
			await Promise.allSettled([
				axios(`${repos_url}/repos?per_page=100`),
				axios(followers_url),
			])
				.then(results => {
					const [repos, followers] = results;
					if (repos.status === 'fulfilled') {
						setGithubRepos(repos.value.data);
					}
					if (followers.status === 'fulfilled') {
						setGithubFollowers(followers.value.data);
					}
				})
				.catch(error => console.log(error));
		} else {
			toggleError(true, 'There is no user with that user name');
		}
		checkRequest();
		setLoading(false);
	};

	useEffect(checkRequest, []);

	return (
		<GithubContext.Provider
			value={{
				githubUser,
				githubRepos,
				githubFollowers,
				request,
				loading,
				error,
				searchGithubUser,
			}}>
			{children}
		</GithubContext.Provider>
	);
};

/* Custom hook */
const useGlobalContext = () => {
	return useContext(GithubContext);
};

export { useGlobalContext, GithubProvider };
