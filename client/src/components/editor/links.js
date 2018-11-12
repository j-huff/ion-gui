import React, { Component } from 'react';
// import {ListGroup, ListGroupItem} from 'react-bootstrap'


// import './contextMenu.css';
import LinkNode from './linkNode';


class Links extends Component {



  render() {
    if(!this.props.links){
    	return(<div></div>);
    }
  	var link_lines = Object.keys(this.props.links).map((key,idx) => {
      var l = this.props.links[key]
      var node1 = this.props.nodes[l.node1_uuid]
      var node2 = this.props.nodes[l.node2_uuid]

      var x1 = node1.x + 100
      var y1 = node1.y + 60
      var x2 = node2.x + 100
      var y2 = node2.y + 60

      return(
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="red" strokeWidth="3" />
      )
    });

    var multiLinks = {}
    var props = this.props
    Object.values(this.props.links).forEach(function(l){
    	var node1 = l.node1_uuid
    	var node2 = l.node2_uuid
    	if(node1 > node2){
    		var tmp = node1
    		node1 = node2
    		node2 = tmp
    	}
    	var combined = node1+node2
    	if(!multiLinks[combined]){
    		multiLinks[combined] = {
    			node1: props.nodes[l.node1_uuid],
    			node2: props.nodes[l.node2_uuid],
    			links: []
    		}
    	}
    	multiLinks[combined].links.push(l)
    })

    var link_nodes = Object.values(multiLinks).map((multiLink,idx) => {
      return(
        <LinkNode links={multiLink.links} node1={multiLink.node1} node2={multiLink.node2} />
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
}

export default Links;
