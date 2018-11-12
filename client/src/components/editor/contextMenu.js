import React, { Component } from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap'


import './contextMenu.css';


class ContextMenu extends Component {

  selectItem(command){
    this.props.parentCallback("CreateNode",this.props.x,this.props.y)
  }

  render() {
    var display = "none"
    if(this.props.opened){
      display = "block"
    }
    return (
      <ListGroup id="contextMenu" style={{left:this.props.x, top:this.props.y, display:display}}>
        <ListGroupItem onClick={() => this.selectItem("CreateNode")}>
        Create Node
        </ListGroupItem>
      </ListGroup>
    );
  }
}

export default ContextMenu;
