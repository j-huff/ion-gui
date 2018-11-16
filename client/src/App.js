import React, { Component } from 'react';
import Editor from './Editor';
import FileExplorer from './components/fileExplorer/fileExplorer';
import {BrowserRouter, Route} from 'react-router-dom'

const App = () =>{

//        <Editor load={false}/>


  return (
    <div id="App" className="App">
      <BrowserRouter>
        <div>
        <Route exact path="/" component={FileExplorer}/>
        <Route path="/projects" component={FileExplorer}/>
        <Route path="/editor/:id" component={Editor}/>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
