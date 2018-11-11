import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ContextMenu from './components/contextMenu';
import CreateNodeMenu from './components/createNodeMenu';
import Node from './components/node';
import NodeEditor from './components/nodeEditor';
import {Panel,FormControl, Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import Radium from 'radium';
import EventListener from 'react-event-listener';
import deepcopy from 'deepcopy';



function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

var remoteURL = 'localhost:5000'

class Editor extends Component {

  constructor(){
    super()
    this.state = {
      nodes: {},
      activeStroke: "",
      contextMenu: {opened: false},
      createNodeMenu: {opened: false},
      nodeEditHelpMessages: {},
      createNodeHelpMessages: {},
      nodeEditor: {},
      links: {},
    }
    this.draggingNode = false
    this.linkingNode = false
    this.hoveringNode = false
    this.mouseDown = false
    this.nodeMap = new Map();
    this.createNodeMenu = React.createRef();
    this.nodeEditorRef = React.createRef();
  }

  handleMouseMove = (e) => {
    var x = e.clientX
    var y = e.clientY
    if(this.draggingNode){
      var n = this.draggingNode
      var node = this.state.nodes[n.uuid]
      var nodes = this.state.nodes
      node["x"] = n.x + x - this.mouseDown.x
      node["y"] = n.y + y - this.mouseDown.y
      nodes[n.uuid] = node
      this.setState({
        nodes:nodes
      })
    }
    if(this.linkingNode){
      var x1 = this.mouseDown.x
      var y1 = this.mouseDown.y
      var vx = x - this.mouseDown.x
      var vy = y - this.mouseDown.y
      var str = "M "+x1+" "+y1+" q 100 100 "+vx+" "+ vy
      this.setState({
        activeStroke: str
      })
    }
  }

  handleMouseUp = (e) => {

    if(this.linkingNode && this.hoveringNode){
      this.createLink(this.linkingNode, this.hoveringNode)
    }

    this.draggingNode = false
    this.linkingNode = false
    this.setState({
      activeStroke: ""
    })
  }
  handleMouseOver = (e) => {
    
  }
  handleMouseOut = (e) => {
    
  }

  createLink = (node1_uuid, node2_uuid) => {

    var uuid = uuidv4()
    var link = {
      uuid: uuid,
      node1_uuid: node1_uuid,
      node2_uuid: node2_uuid
    }
    var links = this.state.links
    links[uuid] = link
    this.setState({links:links})

  }
  
  contextMenu = (e) => {
    this.setState({
      contextMenu:{
        opened: true,
        x: e.clientX,
        y: e.clientY,
      }
    })
    e.preventDefault();
  }

  handleClick(e){
    var menu = this.state.contextMenu
    menu["opened"] = false
    this.setState({
      contextMenu: menu,
    })

  }

  createNodeSubmit = (node) => {
    var res = this.checkNodeConflicts(node)
    this.setState({
      createNodeHelpMessages:res.helpMessages
    })
    if(res.fail){
      return
    }
    this.setState({
      createNodeMenu:{"opened":false}
    })
    var uuid = uuidv4()
    node["uuid"] = uuid
    var nodes = this.state.nodes;
    nodes[uuid] = node
    this.setState({
      nodes: nodes
    })
  }

  nodeDrag = (e,uuid,x,y) => {
    this.mouseDown = {x: e.clientX, y: e.clientY}
    this.draggingNode = {uuid:uuid, x:x, y:y}
  }

  nodeLinkBegin = (e,uuid) => {
    this.mouseDown = {x: e.clientX, y: e.clientY}
    this.linkingNode = uuid
  }

  nodeMouseOver = (uuid) => {
    this.hoveringNode = uuid
    if(this.linkingNode){
      var nodes = this.state.nodes
      nodes[uuid]["hover"] = true
      this.setState({
        nodes:nodes
      })
    }
  }

  nodeMouseOut = (uuid) => {
    if(this.hoveringNode == uuid){
      this.hoveringNode = null
      var nodes = this.state.nodes
      nodes[uuid]["hover"] = false
      this.setState({
        nodes:nodes
      })
    }
    
  }

  editNode = (uuid) => {
    var nodeEditor = this.state.nodeEditor
    nodeEditor["node_uuid"] = uuid
    var node = this.state.nodes[uuid]
    nodeEditor["nodeData"] = JSON.parse(JSON.stringify(node))
    this.setState({
      nodeEditor:nodeEditor
    })
  }

  handleContextMenuSelect = (command,x,y) =>{
    var menu = this.state.createNodeMenu
    menu["opened"] = true
    menu["x"] = x
    menu["y"] = y
    if(command === "CreateNode"){
      this.setState({
        createNodeMenu:menu
      })
    }
  }

  closeCreateNodeMenu = () =>{
    this.setState({
      createNodeMenu:{"opened":false}
    })
  }


  checkNodeConflicts(data){

    var fail = false
    var helpMessages = {}
    if(data.ipn < 1){
      fail = true
      helpMessages["ipn"]= "IPN must be greater than 0"
    }
    if(data.name.trim().length < 1){
      fail = true
      helpMessages["name"]= "Name cannot be empty"
    };

    for (let key of this.nodeMap.keys()){
      if(key == data.reactid){
        continue
      }
      var val = this.nodeMap.get(key)
      if(data.ipn == val.data.ipn){
        fail = true
        helpMessages["ipn"]= "IPN must be unique"
      }
      if(data.name == val.data.name){
        fail = true
        helpMessages["name"]= "Name must be unique"
      }
    }
    
    return {fail:fail,helpMessages:helpMessages}
  }

  handleNodeEdit = (node) =>{
    var res = this.checkNodeConflicts(node)
    this.setState({
      nodeEditHelpMessages:res.helpMessages
    })
    if(res.fail){
      return
    }

    var nodes = this.state.nodes;
    var x = nodes[node.uuid].x
    var y = nodes[node.uuid].y
    nodes[node.uuid] = JSON.parse(JSON.stringify(node))
    nodes[node.uuid]["x"] = x
    nodes[node.uuid]["y"] = y
    this.setState({
      nodes: nodes
    })

  }

  render() {

    var titleStyle = {

      base:{
        boxShadow: "none",
        border: "none",
        background: "transparent",
        ':hover':{
          background: "#FFF",
          boxShadow: "inset 0 1px 3px #ddd",

        }
      }
    }
    var authorStyle = {

      base:{
        boxShadow: "none",
        border: "none",
        background: "transparent",
        ':hover':{
          background: "#FFF",
          boxShadow: "inset 0 1px 3px #ddd",

        }
      }
    }

    var nodes = Object.keys(this.state.nodes).map((key,idx) => {
      var n = this.state.nodes[key]
      return <Node 
      key={n.uuid}
      data={n}
      dragCallback={this.nodeDrag}
      linkCallback={this.nodeLinkBegin}
      mouseOverCallback={this.nodeMouseOver}
      mouseOutCallback={this.nodeMouseOut}
      editNodeCallback={this.editNode}/> 
    });

      

    var link_lines = Object.keys(this.state.links).map((key,idx) => {
      var l = this.state.links[key]
      var node1 = this.state.nodes[l.node1_uuid]
      var node2 = this.state.nodes[l.node2_uuid]

      var x1 = node1.x + 50
      var y1 = node1.y + 50
      var vx = node2.x - node1.x
      var vy = node2.y - node1.y
      var str = "M "+x1+" "+y1+" q 100 100 "+vx+" "+ vy

      return(
        <path d={str} key={idx} stroke="red" strokeWidth="3" fill="none" />
      )
    });

    return (
      <div id="Editor" className="App" onClick={this.handleClick.bind(this)}>
      
      <EventListener target={document} onMouseMoveCapture={this.handleMouseMove} />
      <EventListener target={document} onMouseUpCapture={this.handleMouseUp} />
      <EventListener target={document} onMouseOverCapture={this.handleMouseOver} />
      <EventListener target={document} onMouseOutCapture={this.handleMouseOut}/> 

        <Navbar id="topNav">
          <Navbar.Header>
            <Navbar.Text style={{margin: 0, padding: "6px 0"}}>
            <img src="./backbutton.svg" height={"40px"} width={"40px"} style={{marginLeft:-100}}/>
            </Navbar.Text>
            <Navbar.Brand>
              <input key="projectTitle" style={[titleStyle.base]} id="projectTitle" type="text" value="My Project"/>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <Navbar.Text>
              Author: 
            </Navbar.Text>
            <Navbar.Text>
              <input key="projectAuthor" style={[authorStyle.base]} id="projectAuthor" type="text" value="John Huff"/>
            </Navbar.Text>
          </Nav>
        </Navbar>

        <div className="page-center" onContextMenu={this.contextMenu.bind(this)}>
          
          <svg id="activeStroke" height='20000' width='20000' style={{position:'fixed', top:'0', left:'0'}}>
            {link_lines}
          </svg>

          {nodes}

          <CreateNodeMenu
          opened={this.state.createNodeMenu.opened}
          x={this.state.createNodeMenu.x}
          y={this.state.createNodeMenu.y}
          closeCallback = {this.closeCreateNodeMenu}
          submitCallback = {this.createNodeSubmit}
          helpMessages={this.state.createNodeHelpMessages}/>

          <ContextMenu opened={this.state.contextMenu.opened} x={this.state.contextMenu.x} y={this.state.contextMenu.y} parentCallback={this.handleContextMenuSelect}/> 

          <svg id="activeStroke" height='20000' width='20000' style={{position:'fixed', top:'0', left:'0'}}>
          <path d={this.state.activeStroke} stroke="blue" strokeWidth="3" fill="none" />
          </svg>
          
        </div>
        <div className="page-left"></div>
        <div className="page-right">

          <Panel id="ProjectInfo" defaultExpanded>
          <Panel.Heading >
            <Panel.Title toggle componentClass="h3">Project</Panel.Title>
          </Panel.Heading>
          
          </Panel>

          <Panel id="nodeEditor" defaultExpanded>
          <Panel.Heading >
            <Panel.Title toggle componentClass="h3">Edit Node</Panel.Title>
          </Panel.Heading>
            <NodeEditor 
            nodeData={this.state.nodeEditor.nodeData}
            helpMessages={this.state.nodeEditHelpMessages}
            inputChangeCallback={this.handleNodeEdit}/>
          </Panel>
          
        </div>

      </div>
    );
  }
}

Editor = Radium(Editor)
export default Editor;
