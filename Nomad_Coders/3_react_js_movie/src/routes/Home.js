import { useEffect, useState } from "react";
import Movie from "../components/Movie";
import styles from "./Home.module.css";

function Home() {
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
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loader}>
          <span>Loading...</span>
        </div>
      ) : (
        <div className={styles.movies}>
          {movies.map((movie) => (
            <Movie
              key={movie.id}
              id={movie.id}
              coverImg={movie.poster_path}
              title={movie.title}
              releaseDate={movie.release_date}
              summary={movie.overview}
              genres={movie.genre_ids}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
