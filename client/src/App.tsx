import * as React from 'react';
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/json';
import Search from './Search';
import Results from './Results';

interface AppProps {}
interface AppState {
  searchWords: string;
  pageNumber: number;
  pageCount: number;
  searchResults: any[];
  editMode: boolean;
  currentRecord: { id: number; date: string; description: string };
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      searchWords: undefined,
      pageNumber: undefined,
      pageCount: undefined,
      searchResults: [],
      editMode: false,
      currentRecord: { id: 0, date: '', description: '' }
    };
    this.searchEvents = this.searchEvents.bind(this);
    this.changePage = this.changePage.bind(this);
    this.editRecord = this.editRecord.bind(this);
    this.setCurrentRecord = this.setCurrentRecord.bind(this);
    this.saveRecord = this.saveRecord.bind(this);
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

  editRecord(record: { id: number; date: string; description: string }) {
    this.setState({ editMode: true, currentRecord: record });
  }

  setCurrentRecord() {
    let date = (document.getElementById('date-input') as HTMLInputElement).value;
    let description = (document.getElementById('description-input') as HTMLInputElement).value;
    this.setState({
      currentRecord: { id: this.state.currentRecord.id, date: date, description: description }
    });
  }

  saveRecord() {
    axios
      .patch(`/events/${this.state.currentRecord.id}`, this.state.currentRecord)
      .then(() => {
        return this.setState({
          editMode: false,
          currentRecord: { id: 0, date: '', description: '' }
        });
      })
      .then(() => {
        return this.getEvents(this.state.searchWords, this.state.pageNumber);
      })
      .catch((err: string) => {
        console.log('Error:', err);
      });
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
          editMode={this.state.editMode}
          editRecord={this.editRecord}
          setCurrentRecord={this.setCurrentRecord}
          currentRecord={this.state.currentRecord}
          saveRecord={this.saveRecord}
        />
      </div>
    );
  }
}
