import React, { Component } from 'react';
// import {ListGroup, ListGroupItem} from 'react-bootstrap'


// import './contextMenu.css';
import LinkNode from './linkNode';


class Links extends Component {



  render() {
    if(!this.props.links){
    	return(<div></div>);
    }

  	

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

    Object.values(this.props.contacts).forEach(function(contact){
      if(!multiLinks[contact.uuid]){
        multiLinks[contact.uuid] = {
          node1: props.nodes[contact.node1_uuid],
          node2: props.nodes[contact.node2_uuid],
          links: []
        }
      }
    })
    
    var link_lines = Object.values(multiLinks).map((l,idx) => {

      var node1 = this.props.nodes[l.node1.uuid]
      var node2 = this.props.nodes[l.node2.uuid]

      var x1 = node1.x + 100
      var y1 = node1.y + 70
      var x2 = node2.x + 100
      var y2 = node2.y + 70

      return(
        <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="red" strokeWidth="3" />
      )
    });

    var link_nodes = Object.keys(multiLinks).map((key,idx) => {
      var multiLink = multiLinks[key]
      var contact = this.props.contacts[key]
      return(

        <LinkNode key={idx} links={multiLink.links} contact={contact} node1={multiLink.node1} node2={multiLink.node2} clickCallback={this.props.clickCallback}/>
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
