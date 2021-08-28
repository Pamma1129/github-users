import React from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/context';
import { Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';

const Repos = () => {
	const { githubRepos } = useGlobalContext();

	let data = githubRepos.reduce((total, item) => {
		const { language, stargazers_count } = item;
		if (!language) return total;

		// if (!total[language]) {
		// 	total[language] = { label: language, value: 1 };
		// } else {
		// 	total[language] = {
		// 		...total[language],
		// 		value: total[language].value + 1,
		// 	};
		// }
		total[language] = !total[language]
			? { label: language, value: 1, stars: stargazers_count }
			: {
					...total[language],
					value: total[language].value + 1,
					stars: total[language].stars + stargazers_count,
			  };
		return total;
	}, {});

	const dataToArray = Object.values(data);

	const mostUsed = dataToArray
		.map(item => {
			return { ...item };
		})
		.sort((a, b) => {
			return b.value > a.value ? 1 : -1;
		})
		.slice(0, 5);

	const mostStars = dataToArray
		.map(item => {
			return { ...item, value: item.stars };
		})
		.sort((a, b) => {
			return b.stars > a.stars ? 1 : -1;
		})
		.slice(0, 5);

	let { stars, forks } = githubRepos.reduce(
		(total, item) => {
			const { stargazers_count, name, forks } = item;

			total.stars[stargazers_count] = {
				label: name,
				value: stargazers_count,
			};
			total.forks[forks] = {
				label: name,
				value: forks,
			};
			return total;
		},
		{ stars: {}, forks: {} },
	);

	// stars = Object.values(stars).slice(-5).reverse();
	stars = Object.values(stars)
		.sort((a, b) => {
			return b.value > a.value ? 1 : -1;
		})
		.slice(0, 5);

	forks = Object.values(forks)
		.sort((a, b) => {
			return b.value > a.value ? 1 : -1;
		})
		.slice(0, 5);

	return (
		<section className='section'>
			<Wrapper className='section-center'>
				<Pie3D data={mostUsed} />
				<Column3D data={stars} />
				<Doughnut2D data={mostStars} />
				<Bar3D data={forks} />
			</Wrapper>
		</section>
	);
};

const Wrapper = styled.div`
	display: grid;
	justify-items: center;
	gap: 2rem;
	@media (min-width: 800px) {
		grid-template-columns: 1fr 1fr;
	}

	@media (min-width: 1200px) {
		grid-template-columns: 2fr 3fr;
	}

	div {
		width: 100% !important;
	}
	.fusioncharts-container {
		width: 100% !important;
	}
	svg {
		width: 100% !important;
		border-radius: var(--radius) !important;
	}
`;

export default Repos;
