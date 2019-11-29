import * as React from 'react';
import ReactPaginate from 'react-paginate';

interface ResultsProps {
  searchResults: any[],
  pageCount: number,
  changePage: (data: {selected: number}) => void
}

export default function Results(Props: ResultsProps) {
  return (
    <div>
      <h2>Search Results</h2>
      <ul className="search-results">
      {Props.searchResults.map((event: {id: number, date: string, description: string}) => {
        return (
        <li key={event.id}>{event.date}: {event.description}</li>
        );
      })}
      </ul>
      {Props.searchResults.length > 0 && <ReactPaginate
        pageCount={Props.pageCount}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        previousLabel={'Previous'}
        nextLabel={'Next'}
        onPageChange={Props.changePage}
        containerClassName={'pagination'}
      />}
    </div>
  );
};
