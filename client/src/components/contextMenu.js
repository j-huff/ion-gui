import React, { Component } from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap'


import './contextMenu.css';


class ContextMenu extends Component {
  // constructor() {
  //   super();
  // }


  componentDidMount() {

  }
  openNewNodeMenu(){
    console.log("New node menu")
  }

  handleClick(e) {
    console.log('The link was clicked.');
  }

  selectItem(command){
    this.props.parentCallback("CreateNode",this.props.x,this.props.y)
  }

  render() {
    return (
      <ListGroup id="contextMenu" style={{left:this.props.x, top:this.props.y}}>
        <ListGroupItem onClick={() => this.selectItem("CreateNode")}>
        Create Node
        </ListGroupItem>
      </ListGroup>
    );
  }
}

export default ContextMenu;
