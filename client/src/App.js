import React, { Component } from 'react';
import Editor from './Editor';
import Error404 from './errorPages/error404';
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
        <Route path="/404" component={Error404}/>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
