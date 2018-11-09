import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ContextMenu from './components/contextMenu';
import CreateNodeMenu from './components/createNodeMenu';
import Node from './components/node';


class App extends Component {

  constructor(){
    super()
    this.state = {
      contextMenuComp: null,
      createNodeComp: null,
      nodeComps: [],
      nodes: [],
      activeStroke: "",
    }
    this.createNodeMenu = React.createRef();
  }
  contextMenu = (e) => {

    this.setState({
      contextMenuComp: <ContextMenu x={e.clientX} y={e.clientY} parentCallback={this.handleContextMenuSelect}/> 
    })
    e.preventDefault();
    console.log(e.clientX)
    console.log("Opened Context Menu 1")

  }

  handleClick(e){
    console.log("handleClick")
    this.setState({
      contextMenuComp: null,
    })

  }

  drawActiveStroke = (data) =>{
    var x1 = data.mousedown.x
    var y1 = data.mousedown.y
    var vx = data.x -data.mousedown.x
    var vy = data.y -data.mousedown.y

    var str = "M "+x1+" "+y1+" q 100 100 "+vx+" "+ vy
    this.setState({
      activeStroke: str
    })
  }

  handleContextMenuSelect = (command,x,y) =>{
    console.log(command,x,y)
    if(command === "CreateNode"){
      console.log("Opening create node menu")
      this.setState({
        createNodeComp: <CreateNodeMenu ref={this.createNodeMenu} x={x} y={y} parentCloseCallback={this.handleCreateNodeClose} parentSubmitCallback={this.handleCreateNodeSubmit}/> 
      })
    }
  }

  handleCreateNodeClose = (e) =>{
    this.setState({
      createNodeComp: null
    })
  }

  handleCreateNodeSubmit = (node) =>{
    console.log(node)
    this.handleCreateNodeClose()
    
    var approved = true
    if(!approved){
      var res = {approved: false}
      this.createNodeMenu.current.submissionResponse(res)
      return
    }
console.log(this.state.nodeComps)

    var joined = this.state.nodeComps.concat(<Node key={node.ipn} data={node} drawActiveStrokeCallback={this.drawActiveStroke} />)
    this.setState({
      nodeComps: joined
    })

    console.log(this.state.nodeComps)

    

  }

  render() {

    return (
      <div id="MyApp" className="App" onClick={this.handleClick.bind(this)}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Express Starter 1</h1>
        </header>
        hello

        <div className="page-center" onContextMenu={this.contextMenu.bind(this)}>
          {this.state.nodeComps}
          {this.state.createNodeComp}
          {this.state.contextMenuComp}

          <svg id="activeStroke" height='20000' width='20000' style={{position:'fixed', top:'0', left:'0'}}>
        
        <path d={this.state.activeStroke} stroke="blue"
  strokeWidth="3" fill="none" />
        </svg>
          
        </div>
        <div className="page-left"></div>
        <div className="page-right"></div>

        

      </div>
    );
  }
}

export default App;
