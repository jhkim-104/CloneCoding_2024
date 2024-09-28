import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Movie from "../components/Movie";
import styles from "./Detail.module.css";

function Detail() {
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState([]);
  const { id } = useParams();
  const getMovie = async () => {
    const json = await (
      await fetch(`https://nomad-movies.nomadcoders.workers.dev/movies/${id}`)
    ).json();
    setMovie(json);
    setLoading(false);
  };

  useEffect(() => {
    getMovie();
  }, []);
  console.log(movie);
  return (
    <div>
      {loading ? (
        <div className={styles.loader}>
          <span>Loading...</span>
        </div>
      ) : (
        <div className={styles.movies}>
          <Movie
            id={movie.id}
            coverImg={movie.poster_path}
            title={movie.title}
            releaseDate={movie.release_date}
            summary={movie.overview}
            genres={movie.genres.map((genre) => genre.name)}
          />
        </div>
      )}
    </div>
  );
}
export default Detail;
