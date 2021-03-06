import React, { Component } from 'react';
import backbutton from "./backbutton.svg" ;
import './App.css';
import ContextMenu from './components/editor/contextMenu';
import CreateNodeMenu from './components/editor/createNodeMenu';
import Node from './components/editor/node';
import Links from './components/editor/links';
import LinkLines from './components/editor/linkLines';

import NodeEditor from './components/editor/nodeEditor';
import MachineEditor from './components/editor/machineEditor';
import {Panel, Navbar, Nav, Button} from 'react-bootstrap'
import Radium from 'radium';
import EventListener from 'react-event-listener';
import { Redirect, Link } from 'react-router-dom'
import BottomToolbar from './components/editor/bottomToolbar';
import LinkEditor from './components/editor/linkEditor';

var fileDownload = require('js-file-download');


function portListFromString(str){
  var patt = /^\s*([0-9]{1,5}|[0-9]{1,5}\s*-\s*[0-9]{1,5})(\s*,\s*([0-9]{1,5}|[0-9]{1,5}\s*-\s*[0-9]{1,5}))*\s*$/
  if(!patt.exec(str)){
    return null
  }

  var portlist = []
  var start
  var end
  for(let ports of str.split(",")){
    var split = ports.split("-")
    if(split.length === 2){
      
      start = Number(split[0])
      end = Number(split[1])
      console.log(end)
      console.log(start)
      console.log(end < start)
      if(end < start || end <= 0 || start <= 0 || end > 65535 || start > 65535){
        console.log(end < start)
        return null
      }
      for(let prev of portlist){
        if((start >= prev[0] && start <= prev[1])
          || (end >= prev[0] && end <= prev[1])
          || (start < prev[0] && end > prev[1])){
          return null
        }
      }
      portlist.push([start,end])
    }else{
      for(let prev of portlist){
        start = Number(ports)
        if(start <= 0 || start > 65535){
          return null
        }
        if(start >= prev[0] && start <= prev[1]){
          return null
        }
      }
      portlist.push([Number(ports),Number(ports)])
    }
  }
  return portlist

}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const contactDefault = {
  from: 0,
  until: 0,
}

const linkDefault = {
  contacts: {},
  ranges: {},
  connections: {},
  protocol:"TCP",
  protocolSettings:{
    "TCP":{
      "port1":1,
      "port2":2,
    },
    "UDP":{
      "port1":1,
      "port2":2,
    },
  }
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
      machineEditHelpMessages: {},

      helpMessages: {},
      editingLink: null,
      nodeEditor: {
        showUnusedProtocols: true,
        editingProtocol: null,
      },
      links: {},
      contacts: {},
      meta: {
        author: "No Author",
        projectTitle: "Untitled Project"
      },
      machines: {},
      redirect: false,
      editingMachine: null,
      contactEditor:{
        contactData: null
      },
      linkEditor: {
        currentLink: null,
      },
      bottomToolbar:{
        pose: 'closed'
      },
      pageRightActive:'Nodes',
      scrollEditBoxes:{},
    },

    this.pageid = "none"
    this.draggingNode = false
    this.linkingNode = false
    this.hoveringNode = false
    this.mouseDown = false
    this.createNodeMenu = React.createRef();
    this.nodeEditorRef = React.createRef();
  }

  componentDidMount(){
    var params = this.props.match.params
    this.pageid = params.id
    if(params.id === undefined || params.id == "new"){
      console.log("Creating new page")
      this.loading = "loading"
      fetch('/api/newProjectId').then(res => res.json())
      .then(res => {
        console.log(res)
        this.pageid = res.id
        var meta = this.state.meta
        meta["read_id"] = res.read_id
        this.setState({meta:meta,redirect:true})
      })
      
    }
    if(this.loading != "loading"){
      console.log("Loading Project")
      fetch("/api/loadProject", {
        method: "POST",
        body: JSON.stringify({id: params.id}),
        headers: { "Content-Type": "application/json" }
      })
      .then(res => {
        console.log(res)
        if(res.ok){
          res.json().then(res =>{
            console.log(res)
            this.pageid = params.id
            this.setState({...this.state,...JSON.parse(res)})
            this.setState({redirect:true})
          })
        }else if(res.status == 404){          
          console.log("Project ID not found")
          this.setState({redirect_404:true})
        }
      })


    }
    if(this.state.redirect == true){
      this.setState({redirect:false})
    }
  }
  componentDidUpdate(){
    if(this.state.redirect == true){
      this.setState({redirect:false})
    }
  }

  save = (e) => {
    console.log("Attempting save")

    console.log("Saving project")
    fetch("/api/saveProject", {
      method: "POST",
      body: JSON.stringify({id: this.pageid,state:this.state}),
      headers: { "Content-Type": "application/json" }
    }).then(function(res) {
      
      console.log("Project saved")
    }, function(error) {
      console.log(error.message) //=> String
    })
  }

  download = (e) => {
    console.log("Attempting download")

    console.log("Saving project")
    fetch("/api/export", {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: { "Content-Type": "application/json" }
    }).then(function(res) {
      console.log(res)

      var data = res.blob().then(function(e){
        console.log(e)
          fileDownload(e, 'myFile.zip');
        })

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

  createContact = (node1_uuid, node2_uuid) =>{
    if(node1_uuid > node2_uuid){
      var tmp = node1_uuid
      node1_uuid = node2_uuid
      node2_uuid = tmp
    }
    var uuid = node1_uuid+node2_uuid
    if(this.state.contacts[uuid]){
      return uuid
    }

    var contacts = this.state.contacts
    contacts[uuid] = {
      ...contactDefault,
      node1_uuid: node1_uuid,
      node2_uuid: node2_uuid,
      uuid:uuid
    }
    this.setState({
      contacts:contacts,
      contactEditor:{
        ...this.state.contactEditor,
        contact_uuid: uuid
      },
      bottomToolbar:{
        ...this.state.bottomToolbar,
        pose:'opened'
      }

    })
      
  }



  createLink = (node1_uuid, node2_uuid) => {

    if(node1_uuid > node2_uuid){
      var tmp = node1_uuid
      node1_uuid = node2_uuid
      node2_uuid = tmp
    }
    var uuid = node1_uuid+node2_uuid
    if(this.state.contacts[uuid]){
      return uuid
    }

    var links = this.state.links
    links[uuid] = {
      ...linkDefault,
      

      node1_uuid: node1_uuid,
      node2_uuid: node2_uuid,
      uuid:uuid,
      
    }
    this.setState({
      links:links,
    })
      
  }
  
  openContextMenu = (e,type,data) => {
    console.log("Opening context menu")
    console.log(data)
    this.setState({
      contextMenu:{
        opened: true,
        data:data,
        type: type,
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
    var nodeDefault = {
      wmKey: 65280,
      sdrName: "ion",
      wmSize: 5000000,
      heapWords: 5000000,
      endpoints:""
    }

    Object.assign(node, nodeDefault)

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
      pageRightActive:'Nodes',
      nodeEditor:nodeEditor
    })
  }

  checkMachineConflicts(data){

    var fail = false
    var helpMessages = {}

    if(data.name.trim().length < 1){
      fail = true
      helpMessages["name"]= "Name cannot be empty"
    };

    if(data.address.trim().length < 1){
      fail = true
      helpMessages["address"]= "Address cannot be empty"
    };

    var portlist = portListFromString(data.ports)
    if(portlist === null){
      helpMessages["ports"]="Port list invalid"
    }



    for (let val of Object.values(this.state.machines)){
      if(val.uuid == data.uuid){
        continue
      }
      if(val.name.trim() == data.name.trim()){
        fail = true
        helpMessages["name"] = "Name must be unique"
      }
      if(val.address.trim() == data.address.trim()){
        fail = true
        helpMessages["address"] = "Address must be unique"
      }

    }
    
    return {fail:fail,helpMessages:helpMessages}
  }

  handleContextMenuSelect = (command,data) =>{

    switch(command){
      case "createNode":
        console.log("creating node")
        var menu = this.state.createNodeMenu
        menu["opened"] = true
        menu["x"] = this.state.contextMenu.x
        menu["y"] = this.state.contextMenu.y

        this.setState({
          createNodeMenu:menu
        })
        return
      case "editContact":
        console.log("editing contact")
        console.log(data)
        // this.setState(
        //   editingLink:
        // )
        return
      case "createConnection":
        var link = data
        console.log("creating connection")
        this.createConnection(link)
        return
      case "editConnections":
        console.log(data)
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

  openAddMachine = () => {
    console.log("Opening add machine window")
  }

  editMachine = (uuid) =>{
    this.setState({editingMachine: uuid})
  }

  createMachine = () =>{
    console.log("creating machine")
    var uuid = uuidv4()
    var machines = this.state.machines
    machines[uuid] = {
      name: "",
      address: "",
      uuid:uuid
    }
    this.setState({editingMachine: uuid,machines:machines})
  }

  deleteMachine = (uuid) =>{
    console.log("deleting machine")
    var machines = this.state.machines
    delete machines[uuid]
    this.setState({machines:machines})
  }

  doneEditingMachine = () => {
    this.setState({editingMachine: null})
  }

  handleMachineEdit = (data) =>{
    var res = this.checkMachineConflicts(data)
    this.setState({
      machineEditHelpMessages:res.helpMessages
    })
    if(res.fail){
      return
    }

    var machines = this.state.machines
    var machine = machines[data.uuid]
    machine = data
    machines[data.uuid] = machine
    this.setState(machines:machines)
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

  copyReadLink = () => {
    var textField = document.createElement('textarea')
    var url = window.location.href
    var splits = url.split("/")
    splits.pop()
    url = splits.join("/")
    textField.innerText = url + "/" + this.state.meta.read_id
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
    console.log("Copied to clipboard")
  }

  selectAll = (e) =>{
    e.target.select();
  }


  renderRedirect(){
    var nodeData = this.state
    if(this.state.redirect_404){
      return(<Redirect to={'/404'} />)
    }
    else if(this.state.redirect){
      return(<Redirect to={'/editor/'+this.pageid} />)
    }
    else{
      return("")
    }
    // if (this.state && this.state.meta.id != "new"){
    //   return (
    //     <Redirect to={'/editor/'+this.state.meta.id} />
    //   );
    // }else{
    //   return ("");
    // }
  }

  actionHandler = (action) =>{
    if(!action){
      console.log("No action inputted to action handler")
    }
    console.log(action)
    console.log
    switch (action.type) {
      case 'toggle_bottom_toolbar':
        var pose = 'closed'
        if (this.state.bottomToolbar.pose === 'closed'){
          pose = 'opened'
        }
        this.setState({
          bottomToolbar:{
            ...this.state.bottomToolbar,
            pose: pose
          }
        })
      break;
      case 'openContextMenu':
        var data = action.data;
        this.openContextMenu(data.e,data.type,data.data);
      break;
      case "createNode":
        console.log("creating node")
        var menu = this.state.createNodeMenu
        menu["opened"] = true
        menu["x"] = this.state.contextMenu.x
        menu["y"] = this.state.contextMenu.y
        this.setState({
          createNodeMenu:menu
        })
      break;
      case "editLink":
        this.setState({
          pageRightActive:'Link',
          editingLink:action.data.link.uuid,
        })
      break;
      case "createContact":
        if(!this.state.editingLink){break}
        console.log(this.state.links)
        var uuid = uuidv4()
        var links = this.state.links
        var link = this.state.links[this.state.editingLink]
        console.log(link)
        link.contacts[uuid]={
          "uuid":uuid,
          "name": "New Contact",
          "duration": "1000"
        }
        links[this.state.editingLink] = link
        this.setState({
          links:links
        },function(){

          this.actionHandler({
            type: "editScrollItem",
            data: {
              name:"contacts",
              uuid:uuid
            }
          })
        })
      break;
      case "createRange":
        if(!this.state.editingLink){break}
        console.log(this.state.links)
        var uuid = uuidv4()
        var links = this.state.links
        var link = this.state.links[this.state.editingLink]
        console.log(link)
        link.ranges[uuid]={
          "uuid":uuid,
          "name": "New Range",
          "distance": "10"
        }
        links[this.state.editingLink] = link
        this.setState({
          links:links
        },function(){

          this.actionHandler({
            type: "editScrollItem",
            data: {
              name:"ranges",
              uuid:uuid
            }
          })
        })
      break;
      case "createConnection":
        if(!this.state.editingLink){break}
        console.log(this.state.links)
        var uuid = uuidv4()
        var links = this.state.links
        var link = this.state.links[this.state.editingLink]
        console.log(link)
        link.connections[uuid]={
          "uuid":uuid,
          "name": "New Connection",
          "protocol": "TCP"
        }
        links[this.state.editingLink] = link
        this.setState({
          links:links
        },function(){
          this.actionHandler({
            type: "editScrollItem",
            data: {
              name:"connections",
              uuid:uuid
            }
          })
        })
      break;
      case "editConnections":
        if(!this.state.editingLink){break}
        console.log(data)
      break
      case "editScrollItem":
        console.log("editScrollItem")
        console.log(data)
        var name = action.data.name
        var scrollEditBoxes = this.state.scrollEditBoxes
        var editBox = {uuid:action.data.uuid}
        scrollEditBoxes[name] = editBox
        this.setState({
          scrollEditBoxes: scrollEditBoxes
        })
      break;
      case "scrollItemInputChange":
        var data = action.data
        if(data.parent == "links"){
          console.log("editing link data")
          var links = this.state.links
          var link = this.state.links[this.state.editingLink]
          var prop = link[data.id]
          var elem = prop[data.uuid]
          elem[data.name] = data.value
          prop[data.uuid] = elem
          link[data.id] = prop
          links[this.state.editingLink] = link
          this.setState({links:links})
        }
      break;
      case "doneEditingScrollItem":
        console.log("doneEditingScrollItem")
        console.log(action.data)
        console.log()
        var name = action.data
        var scrollEditBoxes = this.state.scrollEditBoxes
        var editBox = {uuid:null}
        scrollEditBoxes[name] = editBox
        this.setState({
          scrollEditBoxes: scrollEditBoxes
        })
      break;
      case "toggleShowUnusedProtocols":
        console.log("toggleShowUnusedProtocols")
        this.setState({
          nodeEditor:{
            ...this.state.nodeEditor,
            showUnusedProtocols: !this.state.nodeEditor.showUnusedProtocols
          }
        })
      break;
      case "updateProtocolSettingsNav":
        console.log("updateProtocolSettingsNav")
        this.setState({
          nodeEditor:{
            ...this.state.nodeEditor,
            editingProtocol: action.data
          }
        })
      break;
      case "changeLinkProtocol":
        var data=action.data
        console.log("changeLinkProtocol")
        var newstate = this.state
        newstate.links[data.link] = {
          ...this.state.links[data.link],
          protocol:data.protocol
        }
        this.setState(newstate)
        console.log(this.state.links[data.link])
      break;
      case "updateLinkProtocolSettings":
        var data=action.data
        var newstate = this.state
        newstate.links[data.link].protocolSettings[data.protocol][data.name] = [data.value]
        this.setState(newstate)
      break;
      case "updateNodeProtocolSettings":

      var data=action.data
      var newstate = this.state
      
      newstate.nodes[data.node].protocolSettings[data.protocol][data.name] = [data.value]
      this.setState(newstate)
      
      break
      case "deleteNode":
        var uuid = action.data
        var nodes = this.state.nodes;
        delete nodes[uuid]
        
        var links = this.state.links;
        for (var key in this.state.links){
          var link = this.state.links[key]
          if(link.node1_uuid == uuid || link.node2_uuid == uuid){
            delete links[key]
          }
        }

        this.setState({nodes:nodes,links:links})

      default:
        console.log("Action not implemented: "+action.type);
      

    }
  }

  renderPageRight(){
    var navOptions = ['Nodes','Link','Hide']

    const navItems = navOptions.map((d) =>
      <li onClick={(e) => this.pageRightNavChange(e,d)} class={d == this.state.pageRightActive ? 'active' : ''}><a href="#">{d}</a></li>
    )

    const nav = (
      <ul id="page-right-nav" class="nav nav-tabs">
      {navItems}
      </ul>
    )
    switch(this.state.pageRightActive){
      case 'Nodes':
        return(
          <div id="page-right-inner">
          {nav}
          <div class='page-right-menu-page'>


            <MachineEditor
            addMachineCallback={this.openAddMachine}
            machineData={this.state.machines[this.state.editingMachine]} 
            machines={this.state.machines}
            editMachineCallback={this.editMachine}
            doneEditingCallback={this.doneEditingMachine}
            inputChangeCallback={this.handleMachineEdit}
            createMachineCallback={this.createMachine}
            deleteMachineCallback={this.deleteMachine}
            helpMessages={this.state.machineEditHelpMessages}/>

        
            <NodeEditor
            state={this.state.nodeEditor}
            nodeData={this.state.nodeEditor.nodeData}
            helpMessages={this.state.nodeEditHelpMessages}
            machineList={this.state.machines}
            inputChangeCallback={this.handleNodeEdit}
            deleteNodeCallback={this.deleteNode}
            actionHandler={this.actionHandler}
            state={this.state}
            />
          </div>
          </div>)
      break;
      case 'Link':
        return(
          <div id="page-right-inner">
            {nav}
            {LinkEditor(this.actionHandler,this.state)}
          </div>
        )
      break;
      case 'Hide':
      default:
        return(
          <div id="page-right-inner">
            {nav}
          </div>
        )
      break;
    }
  }

  pageRightNavChange = (e,newPage) =>
  { 
    e.preventDefault();
    this.setState({
      pageRightActive: newPage
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

    var read_url = window.location.href
    var splits = read_url.split("/")
    splits.pop()
    read_url = splits.join("/")
    read_url = read_url + "/" + this.state.meta.read_id

    var nodes = Object.keys(this.state.nodes).map((key,idx) => {
      var n = this.state.nodes[key]

      return <Node 
      key={n.uuid}
      data={n}
      dragCallback={this.nodeDrag}
      linkCallback={this.nodeLinkBegin}
      mouseOverCallback={this.nodeMouseOver}
      mouseOutCallback={this.nodeMouseOut}
      editNodeCallback={this.editNode}
      machine={this.state.machines[n.machine]}/> 
    });


    return (
      <div id="Editor" className="App" onClick={this.handleClick}>
      
      {this.renderRedirect()}

      <EventListener target={document} onMouseMoveCapture={this.handleMouseMove} />
      <EventListener target={document} onMouseUpCapture={this.handleMouseUp} />
      <EventListener target={document} onMouseOverCapture={this.handleMouseOver} />
      <EventListener target={document} onMouseOutCapture={this.handleMouseOut}/> 

      
        <Navbar id="topNav" expand="lg">
          <Navbar.Header>
            <Navbar.Text style={{margin: 0, padding: "6px 0px"}}>
              <Link to="/">
              <img src={backbutton} height={"38px"} width={"38px"} style={{marginLeft:0,opacity: .4}}/>
              </Link>
            </Navbar.Text>
            <Navbar.Text style={{margin: 0, padding: "10px 20px", paddingRight:"0px"}}>
              <Button onClick={this.save}>
                Save
              </Button>
            </Navbar.Text>
            <Navbar.Text style={{margin: 0, padding: "10px 20px",paddingLeft:"10px"}}>
                <Button onClick={this.download}>
                  Download
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
          <Nav id="readLinkNav">
            <div id="readLinkWrapper">
              <label> Read-only link </label>
              <input id="readLinkInput" name="readLink" type="text" value={read_url}/>
              <input type="submit" id="readLinkCopyButton" value="copy" onClick={(e) => this.copyReadLink()}/>
            </div>
          </Nav>
        </Navbar>


        <div className="page-center" onContextMenu={(e) => this.openContextMenu(e,"background")}>
        </div>
        
        {LinkLines(this.actionHandler,this.state)}
        {nodes}

        <CreateNodeMenu
        opened={this.state.createNodeMenu.opened}
        x={this.state.createNodeMenu.x}
        y={this.state.createNodeMenu.y}
        closeCallback = {this.closeCreateNodeMenu}
        submitCallback = {this.createNodeSubmit}
        helpMessages={this.state.createNodeHelpMessages}/>

        {ContextMenu(this.actionHandler, this.state)}
        <svg id="activeStroke" height='20000' width='20000' style={{position:'fixed', top:'0', left:'0'}}>
        <path d={this.state.activeStroke} stroke="blue" strokeWidth="3" fill="none" />
        </svg>

        <div className="page-left"></div>
        <div className="page-right">
          
          {this.renderPageRight()}
      
          
          
        </div>

      </div>
    );
  }
}

Editor = Radium(Editor)
export default Editor;
