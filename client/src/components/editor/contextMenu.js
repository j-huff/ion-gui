import React, { Component } from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap'


import './contextMenu.css';



// function getEditConnectionsSubmenu(links){
//   var items = []
//   for(let link of links){
//     items.push({text:link.name,action:"editLink",})
//   }
// }

class ContextMenu extends Component {

  selectItem(command,data){
    this.props.parentCallback(command,data)
  }

  getMenuData(){
    var type = this.props.data.type

    switch(type){
      case "background":
        return [
          {text:"Create Node",action:"CreateNode"}
        ]
      case "edge":
        return [
          {text:"Edit Contact",action:"editContact",data:this.props.data.data.contact},
          {text:"Edit Connections",action:"editConnections",data:this.props.data.data.links},
          {text:"Create Connection",action:"createConnection", data:this.props.data.data.contact}
        ]
      default:
        return []
    }
  }

  render() {
    var display = "none"
    if(this.props.data.opened){
      display = "block"
    }
    var data = this.props.data
    var menuData = this.getMenuData()
    var menuItems = menuData.map((m,idx) =>

      <ListGroupItem key={idx} onClick={() => this.selectItem(m.action,m.data)}>
        {m.text}
      </ListGroupItem>
    )
    return (
      <ListGroup id="contextMenu" style={{left:data.x, top:data.y, display:display}}>
        {menuItems}
      </ListGroup>
    );
  }
}

export default ContextMenu;
