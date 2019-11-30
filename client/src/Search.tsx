import * as React from 'react';

interface SearchProps {
  searchEvents: () => void;
}

export default function Search(Props: SearchProps) {
  return (
    <div>
      <input id="search-input"></input>
      <button onClick={Props.searchEvents}>Search Events</button>
    </div>
  );
}
