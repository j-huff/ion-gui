import React, { Component } from 'react';
// import {ListGroup, ListGroupItem} from 'react-bootstrap'


// import './contextMenu.css';
import LinkNode from './linkNode';

const LinkLines = (actionHandler, state) => {


  var link_lines = Object.values(state.links).map((l,idx) => {

      var node1 = state.nodes[l.node1_uuid]
      var node2 = state.nodes[l.node2_uuid]

      var x1 = node1.x + 100
      var y1 = node1.y + 70
      var x2 = node2.x + 100
      var y2 = node2.y + 70

      return(
        <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="red" strokeWidth="3" />
      )
    });

  var link_nodes = Object.values(state.links).map((l,idx) => {
      return(
        <div>
          {LinkNode(actionHandler, state, l)}
        </div>
      )
    });

  return (
    <div className="links">
        <svg id="activeStroke" height='20000' width='20000' style={{position:'fixed', top:'0', left:'0'}}>
            {link_lines}
          </svg>
          {link_nodes}
      </div>
  );

}

export default LinkLines;
