import axios from 'axios';

import type { Movie } from '../types/movie';

interface MovieHttpResponse {
  results: Movie[];
  total_pages: number;
}

const fetchMovies = async (
  title: string,
  currentPage: number
): Promise<MovieHttpResponse> => {
  const getParams = {
    params: {
      query: title,
      page: currentPage,
      // твої параметри
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  };

  const response = await axios.get<MovieHttpResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    getParams
  );
  //const { results, total_page } = response.data;
  return response.data;
};

export default fetchMovies;
