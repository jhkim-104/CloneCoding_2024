import { useEffect, useState } from "react";

function App() {
	const [loading, setLoading] = useState(true);
	const [movies, setMovies] = useState([]);
	const getMovies = async () => {
		// const response = await fetch(
		// 	`https://nomad-movies.nomadcoders.workers.dev/movies`
		// );
		// const json = await response.json();
		const json = await (
			await fetch(`https://nomad-movies.nomadcoders.workers.dev/movies`)
		).json();
		setMovies(json);
		setLoading(false);
	};
	useEffect(() => {
		getMovies();
	}, []);
	console.log(movies);
	return (
		<div>
			{loading ? (
				<h1>Loading...</h1>
			) : (
				<div>
					{movies.map((movie) => (
						<div key={movie.id}>
							<img src={movie.poster_path} />
							<h2>{movie.title}</h2>
							<p>{movie.overview}</p>
							<ul>
								{movie.genre_ids.map((g) => (
									<li key={g}>{g}</li>
								))}
							</ul>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default App;
