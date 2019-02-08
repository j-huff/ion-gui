import React, { Component } from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap'


import './contextMenu.css';



// function getEditConnectionsSubmenu(links){
//   var items = []
//   for(let link of links){
//     items.push({text:link.name,action:"editLink",})
//   }
// }

const ContextMenu = (actionHandler, state) => {

  var type = state.contextMenu.type
  var menuData = null

  switch(type){
    case "background":
      menuData = [
        {text:"Create Node",action:{type:"createNode",data:null}}
      ]
    break;
    case "edge":
      menuData = [
        {text:"Edit Link",action:{type:"editLink",data:state.contextMenu.data}},
        {text:"Edit Connections",action:{type:"editConnections",data:state.contextMenu.data}},
        {text:"Create Connection",action:{type:"createConnections",data:state.contextMenu.data}}
      ]
    break;
    default:
      menuData = []
  }


  var display = "none"
  if(state.contextMenu.opened){
    display = "block"
  }
  var data = state.contextMenu.data
  var menuItems = menuData.map((m,idx) =>

    <ListGroupItem key={idx} onClick={() => actionHandler(m.action)}>
      {m.text}
    </ListGroupItem>
  )

  return (
    <ListGroup id="contextMenu" style={{left:state.contextMenu.x, top:state.contextMenu.y, display:display}}>
      {menuItems}
    </ListGroup>
  );
}

export default ContextMenu;
