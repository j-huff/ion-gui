import React, { Component } from 'react';
import backbutton from "./backbutton.svg" ;
import './App.css';
import ContextMenu from './components/editor/contextMenu';
import CreateNodeMenu from './components/editor/createNodeMenu';
import Node from './components/editor/node';
import Links from './components/editor/links';
import NodeEditor from './components/editor/nodeEditor';
import {Panel,FormControl, Navbar, Nav, NavItem, NavDropdown, MenuItem, Button} from 'react-bootstrap'
import Radium from 'radium';
import EventListener from 'react-event-listener';
import deepcopy from 'deepcopy';
import { Redirect, Link } from 'react-router-dom'



function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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
      meta: {
        id: "new",
        author: "No Author",
        projectTitle: "Untitled Project"
      },
    }
    this.draggingNode = false
    this.linkingNode = false
    this.hoveringNode = false
    this.mouseDown = false
    this.createNodeMenu = React.createRef();
    this.nodeEditorRef = React.createRef();
  }

  componentDidMount(){
    var params = this.props.match.params
    if(params.id === undefined || params.id == "new"){
      this.loading = "loading"
      fetch('/api/newProjectId').then(res => res.json())
      .then(res => {
        var meta = this.state.meta
        meta["id"] = res
        this.setState({meta:meta})
      })
      
    }
    if(this.loading != "loading"){
      fetch("/api/loadProject", {
        method: "POST",
        body: JSON.stringify({id: params.id}),
        headers: { "Content-Type": "application/json" }
      }).then(res => res.json())
      .then(res => {
        this.setState(JSON.parse(res))
      })
    }
  }

  save = (e) => {
    console.log("Saving project")
    console.log(this.state)
    fetch("/api/saveProject", {
      method: "POST",
      body: JSON.stringify({id: this.state.meta.id,state:this.state}),
      headers: { "Content-Type": "application/json" }
    }).then(function(res) {
      
      console.log("Project saved")
    }, function(error) {
      console.log(error.message) //=> String
    })
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

  changeMeta = (e) => {
    var name = e.target.name
    var value = e.target.value
    var meta = this.state.meta
    meta[name] = value
    this.setState({meta:meta})
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
  
  handleMouseOver = (e) => {}
  handleMouseOut = (e) => {}

  createLink = (node1_uuid, node2_uuid) => {

    var uuid = uuidv4()
    var link = {
      uuid: uuid,
      node1_uuid: node1_uuid,
      node2_uuid: node2_uuid
    }
    var links = this.state.links
    var nodes = this.state.nodes
    var node1 = nodes[node1_uuid]
    var node2 = nodes[node2_uuid]
    if(!node1.links){
      node1.links = {}
    }
    if(!node2.links){
      node2.links = {}
    }
    node1.links[uuid] = 1
    node2.links[uuid] = 1
    nodes[node1_uuid] = node1
    nodes[node2_uuid] = node2

    links[uuid] = link
    this.setState({links:links, nodes:nodes})

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

  handleClick =(e) =>{
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
    node.links = {}

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

    for (let key of Object.keys(this.state.nodes)){
      if(key == data.uuid){
        continue
      }
      var node = this.state.nodes[key]
      if(data.ipn == node.ipn){
        fail = true
        helpMessages["ipn"]= "IPN must be unique"
      }
      if(data.name == node.name){
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

  deleteNode = (uuid) =>{
    var nodeEditor = {}
    var nodes = this.state.nodes
    var node = nodes[uuid]
    var links = this.state.links
    Object.keys(node.links).forEach(function(link_uuid){
      var link = links[link_uuid]
      var node2_uuid = link.node1_uuid
      if(uuid == node2_uuid){
        node2_uuid = link.node2_uuid
      }
      var node2 = nodes[node2_uuid]
      delete node2.links[link_uuid]
      nodes[node2_uuid] = node2
      delete links[link_uuid]
    })
    delete nodes[uuid]
    var nodeEditor = this.state.nodeEditor
    if(nodeEditor.nodeData.uuid == uuid){
      nodeEditor.nodeData = null
    }
    this.setState({nodes: nodes, links: links, nodeEditor: nodeEditor})
  }

  selectAll = (e) =>{
    e.target.select();
  }


  renderRedirect(){
    var nodeData = this.state
    if (this.state && this.state.meta.id != "new"){
      return (
        <Redirect to={'/editor/'+this.state.meta.id} />
      );
    }else{
      return ("");
    }
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


    return (
      <div id="Editor" className="App" onClick={this.handleClick}>
      
      {this.renderRedirect()}

      <EventListener target={document} onMouseMoveCapture={this.handleMouseMove} />
      <EventListener target={document} onMouseUpCapture={this.handleMouseUp} />
      <EventListener target={document} onMouseOverCapture={this.handleMouseOver} />
      <EventListener target={document} onMouseOutCapture={this.handleMouseOut}/> 

        <Navbar id="topNav">
          <Navbar.Header>
            <Navbar.Text style={{margin: 0, padding: "6px 0px"}}>
              <Link to="/">
              <img src={backbutton} height={"38px"} width={"38px"} style={{marginLeft:0,opacity: .4}}/>
              </Link>
            </Navbar.Text>
            <Navbar.Text style={{margin: 0, padding: "10px 20px"}}>
              <Button onClick={this.save}>
                Save
              </Button>
            </Navbar.Text>
            
            <Navbar.Brand>
              <input onFocus={this.selectAll}  key="projectTitle" onChange={this.changeMeta.bind(this)} style={[titleStyle.base]} id="projectTitle" name="projectTitle" type="text" value={this.state.meta.projectTitle}/>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <Navbar.Text>
              Author: 
            </Navbar.Text>
            <Navbar.Text>
              <input onFocus={this.selectAll} key="projectAuthor" onChange={this.changeMeta.bind(this)} style={[authorStyle.base]} id="projectAuthor" name="author" type="text" value={this.state.meta.author}/>
            </Navbar.Text>
            
          </Nav>
        </Navbar>

        <div className="page-center" onContextMenu={this.contextMenu.bind(this)}>
          
          
          <Links nodes={this.state.nodes} links={this.state.links} />

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
            inputChangeCallback={this.handleNodeEdit}
            deleteNodeCallback={this.deleteNode}/>
          </Panel>
          
        </div>

      </div>
    );
  }
}

Editor = Radium(Editor)
export default Editor;
