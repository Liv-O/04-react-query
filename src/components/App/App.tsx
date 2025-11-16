import { useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import styles from './App.module.css';
import fetchMovies from '../../services/movieService';
import type { Movie } from '../../types/movie';

import toast, { Toaster } from 'react-hot-toast';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['title', title, currentPage],
    queryFn: () => fetchMovies(title, currentPage),
    enabled: title !== '',
    placeholderData: keepPreviousData,
  });

  if (data && data.results.length === 0) {
    toast.error('No movies found for your request.');
  }

  const totalPages = data?.total_pages ?? 0;
  console.log(data);

  const handleSearch = (title: string) => {
    setTitle(title);
    setCurrentPage(1);
  };

  function handleSelect(movie: Movie) {
    setIsModalOpen(true);
    setSelectedMovie(movie);
  }
  function closeModal() {
    setIsModalOpen(false);
    setSelectedMovie(null);
  }

  return (
    <div className={styles.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}

      {isError && <ErrorMessage />}
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {data && data.results.length > 0 && (
        <MovieGrid
          movies={data.results}
          onSelect={handleSelect}
        />
      )}
      {isModalOpen && selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;
