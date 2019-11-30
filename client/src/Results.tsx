import * as React from 'react';
import ReactPaginate from 'react-paginate';

interface ResultsProps {
  searchResults: any[];
  pageCount: number;
  changePage: (data: { selected: number }) => void;
  editMode: boolean;
  editRecord: () => void;
  saveRecord: () => void;
}

export default function Results(Props: ResultsProps) {
  return (
    <div>
      {Props.searchResults.length > 0 && (
        <div>
          <h2>Search Results</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {Props.searchResults.map(
                (event: { id: number; date: string; description: string }) => {
                  return (
                    <tr key={event.id}>
                      <td>{event.date}</td>
                      <td>{event.description}</td>
                      <td>
                        <button onClick={Props.editRecord}>Edit</button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
          {!Props.editMode && (
            <ReactPaginate
              pageCount={Props.pageCount}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              previousLabel={'Previous'}
              nextLabel={'Next'}
              onPageChange={Props.changePage}
              containerClassName={'pagination'}
            />
          )}
          {Props.editMode && (
            <div>
              <input placeholder="Date"></input>
              <input placeholder="Description"></input>
              <button onClick={Props.saveRecord}>Save</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
