import { useState, useEffect } from "react";
import api from "../../api/axios";
import "./movies.css";

// Movie interfaces
interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface MovieResponse {
  results: Movie[];
  total_pages: number;
}

// Genre interface
interface Genre {
  id: number;
  name: string;
}

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);     // ⭐ جديد
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  // 🟡 جلب الـ Genres من backend
  const fetchGenres = async (): Promise<void> => {
    try {
      const res = await api.get("/movies/genres");
      setGenres(res.data.genres || []); 
    } catch (err) {
      console.error("خطأ في جلب التصنيفات:", err);
    }
  };

  // 🟠 جلب الأفلام
const fetchMovies = async (pageNumber: number, genreId: number | null) => {
  setIsLoading(true);
  try {
    // التغيير هنا: نغير الـ endpoint بناءً على وجود genreId
    const endpoint = genreId ? "/movies/genre" : "/movies/popular";
    const params = genreId 
      ? { genre: genreId, page: pageNumber } // لمسار /genre
      : { page: pageNumber };               // لمسار /popular

    const res = await api.get<MovieResponse>(endpoint, { params });

    setMovies(res.data.results || []);
    setTotalPages(Math.min(res.data.total_pages, 500));
  } catch (err) {
    console.error("Error fetching movies:", err);
  } finally {
    setIsLoading(false);
  }
};

  // 🔄 عندما الصفحة أو الـ genre يتغير
  useEffect(() => {
    fetchMovies(page, selectedGenre);
  }, [page, selectedGenre]);

  // 🟢 عند تحميل الصفحة الأولية
  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <div className="movie-container">

      <h2 className="title">أفلام</h2>

      {/* 🟦 شريط التصنيفات */}
      <div className="genre-bar">

        <button
          className={selectedGenre === null ? "active" : ""}
          onClick={() => {
            setSelectedGenre(null);
            setPage(1);
          }}
        >
          الكل
        </button>

        {genres.map((g) => (
        <button
  key={g.id}
  className={selectedGenre === g.id ? "active" : ""}
  onClick={() => {
    setSelectedGenre(g.id); // سيقوم الـ useEffect بجلب الأفلام فوراً
    setPage(1);             // العودة لأول صفحة في تصنيف الأكشن
  }}
>
  {g.name}
</button>
        ))}

      </div>

      {isLoading ? (
        <div className="loading">جاري التحميل...</div>
      ) : (
        <div className="movie-grid">

          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">

              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Poster"
                }
                alt={movie.title}
                loading="lazy"
              />

              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>Release: {movie.release_date.split("-")[0] || "N/A"}</p>
                <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
              </div>

            </div>
          ))}

        </div>
      )}

      {/* ⏭️ Pagination */}
      <div className="pagination">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page <= 1 || isLoading}
        >
          Previous
        </button>

        <span className="page-number">Page {page} of {totalPages}</span>

        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page >= totalPages || isLoading}
        >
          Next
        </button>
      </div>

    </div>
  );
}