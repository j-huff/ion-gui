import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ContextMenu from './components/contextMenu';
import CreateNodeMenu from './components/createNodeMenu';
import Node from './components/node';
import NodeEditor from './components/nodeEditor';
import {Panel} from 'react-bootstrap'


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

class App extends Component {

  constructor(){
    super()
    this.state = {
      contextMenuComp: null,
      createNodeComp: null,
      nodeEditorComp: null,
      nodeComps: [],
      nodes: [],
      activeStroke: "",
    }

    this.nodeMap = new Map();

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



    var uuid = uuidv4()

    var nodeRef = React.createRef();
    var joined = this.state.nodeComps.concat(
      <Node ref={nodeRef} 
      key={uuid} 
      reactid={uuid} 
      data={node} 
      drawActiveStrokeCallback={this.drawActiveStroke} 
      editNodeCallback={this.handleEditNode}/>)
    this.setState({
      nodeComps: joined
    })
    this.nodeMap.set(uuid,{data:node,comp:nodeRef})

    console.log(this.nodeMap.get(uuid))


  }

  handleEditNode = (reactid) =>{
    var entry = this.nodeMap.get(reactid)
    console.log(entry.data)
    entry.data["reactid"]=reactid
    this.setState({
      nodeEditorComp: <NodeEditor data={entry.data} dataChangeCallback={this.handleNodeEdit}/>,
    })
  }

  checkNodeConflicts(data){
    var res = {
      ipnHelp:null,
      nameHelp:null,
    }
    var fail = false
    if(data.ipn < 1){
      fail = true
      res["ipnHelp"]= "IPN must be greater than 0"
    }
    if(data.name.trim().length < 1){
      fail = true
      res["nameHelp"]= "Name cannot be empty"
    };

    for (let key of this.nodeMap.keys()){
      if(key == data.reactid){
        continue
      }
      var val = this.nodeMap.get(key)
      if(data.ipn == val.data.ipn){
        fail = true
        res["ipnHelp"]= "IPN must be unique"
      }
      if(data.name == val.data.name){
        fail = true
        res["nameHelp"]= "Name must be unique"
      }
    }
    return {res:res, fail:fail}
  }

  handleNodeEdit = (data) =>{
    console.log("Handle node edit")
    console.log(data)
    var comp = this.nodeMap.get(data.reactid).comp
    var conflicts = this.checkNodeConflicts(data)
    if(!conflicts.fail){
      comp.current.setState(data)
    }
    return conflicts.res
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
        <div className="page-right">
          <Panel id="nodeEditor" defaultExpanded>
          <Panel.Heading >
            <Panel.Title toggle componentClass="h3">Edit Node</Panel.Title>
          </Panel.Heading>
          {this.state.nodeEditorComp}
          </Panel>
          
        </div>

        

      </div>
    );
  }
}

export default App;
