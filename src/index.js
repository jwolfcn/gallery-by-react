import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import GalleryByReactApp from './components/Main';

// Render the main component into the dom
// let arr = [{name:'1abc',value:1},{name:'2bbc',value:2},{name:'3c',value:3},{name:'4bbc',value:4},{name:'5bbc',value:5}];
ReactDOM.render(<GalleryByReactApp />, document.getElementById('app'));
