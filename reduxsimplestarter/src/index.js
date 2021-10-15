import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ytsearch from 'youtube-api-search'
import SearchBar from './components/searchbar';
import VideoList from './components/videolist';
import VideoDetail from './components/videodetail';

class App extends Component {
    
    constructor(props) {
        super(props);

        this.state = { videos: [], selectedVideo: null };

        this.videoSearch('child in time');
    }

    videoSearch(term) {
        ytsearch({ key: process.env.YOUTUBE_APIKEY, term }, videos => {
            this.setState({ videos, selectedVideo: videos[0] });
        });
    }

    render() {
        const videoSearch = _.debounce((term) => {this.videoSearch(term)}, 300);

        return (
            <div class='row'>
                <SearchBar onSearchTermChange={videoSearch} />
                <VideoDetail video={this.state.selectedVideo} />
                <VideoList
                    videos={this.state.videos}
                    onVideoSelect={selectedVideo => this.setState({selectedVideo})} />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.querySelector('.container'));