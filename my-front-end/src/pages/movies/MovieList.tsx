import { useState, useEffect } from "react";
// 1. استيراد api بدلاً من fetch الخام
import api from "../../api/axios"; // تأكد من صحة مسار ملف axios الخاص بك
import "./movies.css";

// واجهات البيانات (Interfaces)
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

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchMovies(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const fetchMovies = async (pageNumber: number): Promise<void> => {
    setIsLoading(true);
    try {
      /**
       * 2. التعديل الجوهري هنا:
       * بما أن baseURL ينتهي بـ /api والباك إيند Prefix هو /api/movies
       * نطلب المسار النسبي /movies/popular
       */
      const res = await api.get<MovieResponse>(`/movies/popular`, {
        params: { page: pageNumber } // إرسال الـ pagination كـ query params
      });

      // في axios البيانات تكون داخل res.data
      setMovies(res.data.results || []);
      setTotalPages(res.data.total_pages > 500 ? 500 : res.data.total_pages);
    } catch (err) {
      console.error("خطأ في جلب الأفلام عبر Axios:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="movie-container">
      <h2 className="title">أفلام شائعة</h2>

      {isLoading ? (
        <div className="loading">جاري التحميل...</div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                  : "https://via.placeholder.com/500x750?text=No+Poster"}
                alt={movie.title}
                loading="lazy"
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>Release: {movie.release_date?.split('-')[0] || "N/A"}</p>
                <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page <= 1 || isLoading}
        >
          Previous
        </button>

        <span className="page-number">Page {page} of {totalPages}</span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page >= totalPages || isLoading}
        >
          Next
        </button>
      </div>
    </div>
  );
}