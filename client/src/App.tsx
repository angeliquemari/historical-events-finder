import * as React from 'react';
import axios from 'axios';
import Search from './Search';
import Results from './Results';

interface AppProps {}
interface AppState {
  searchWords: string;
  pageNumber: number;
  pageCount: number;
  searchResults: any[];
  editMode: boolean;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      searchWords: undefined,
      pageNumber: undefined,
      pageCount: undefined,
      searchResults: [],
      editMode: false
    };
    this.searchEvents = this.searchEvents.bind(this);
    this.changePage = this.changePage.bind(this);
    this.editResults = this.editResults.bind(this);
    this.saveResults = this.saveResults.bind(this);
  }

  getEvents(searchWords: string, pageNumber: number) {
    axios
      .get(`/events?q=${searchWords}&_page=${pageNumber}`)
      .then((response: { headers?: { link?: string }; data?: any[] }) => {
        if (response.headers.link) {
          let pageLinks = response.headers.link.split(', ');
          let lastPageLink = pageLinks[pageLinks.length - 1];
          let lastPageNumber = Number(lastPageLink.match(/&_page=\d+>/)[0].match(/\d+/)[0]);
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

  changePage(data: { selected: number }) {
    let pageNumber = data.selected + 1;
    this.getEvents(this.state.searchWords, pageNumber);
  }

  editResults() {
    this.setState({ editMode: true });
  }

  saveResults() {
    // patch request to server
    this.setState({ editMode: false });
  }

  render() {
    return (
      <div>
        <h1>Historical Events Finder</h1>
        <Search searchEvents={this.searchEvents} />
        <Results
          searchResults={this.state.searchResults}
          pageCount={this.state.pageCount}
          changePage={this.changePage}
          editResults={this.editResults}
          saveResults={this.saveResults}
        />
      </div>
    );
  }
}
