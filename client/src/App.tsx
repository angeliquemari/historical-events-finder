import * as React from 'react';
import axios from 'axios';
import Search from './Search';

type AppProps = {}
type AppState = {
  searchWords: string | undefined,
  pageNumber: number | undefined,
  pageCount: number | undefined,
  searchResults: any[]
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      searchWords: undefined,
      pageNumber: undefined,
      pageCount: undefined,
      searchResults: []
    };
    this.searchEvents = this.searchEvents.bind(this);
  }

  getEvents(searchWords: string, pageNumber: number) {
    axios.get(`/events?q=${searchWords}&_page=${pageNumber}`)
      .then((response: {headers?: {link?: string}, data?: any[]}) => {
        if (response.headers.link) {
          let pageLinks = response.headers.link.split(', ');
          let lastPageLink = pageLinks[pageLinks.length - 1];
          let lastPageNumber = Number(lastPageLink.match(/&_page=\d+>/)[0].match(/\d+/)[0]);
          // console.log('response.data:', response.data);
          this.setState({
            searchWords: searchWords,
            pageNumber: pageNumber,
            pageCount: lastPageNumber,
            searchResults: response.data
          });
        }
      })
      .catch((err: string) => {
        console.log('Error:', err);
      });
  }

  searchEvents() {
    let searchWords = (document.getElementById('search-input') as HTMLInputElement).value;
    this.getEvents(searchWords, 1);
  }
  render() {
      return (
        <div>
          <h1>Historical Events Finder</h1>
          <Search searchEvents={this.searchEvents} />
          {/* <Results searchResults={this.state.searchResults} pageCount={this.state.pageCount} changePage={this.changePage} /> */}
        </div>
      );
  }
}
