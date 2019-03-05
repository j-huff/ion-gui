import React, { Component } from 'react';
// import {ListGroup, ListGroupItem} from 'react-bootstrap'

import Radium from 'radium';

import './linkNode.css';


// class LinkNode extends Component {


//   render() {
//     var node1 = this.props.node1
//     var node2 = this.props.node2
//     var x1 = node1.x + 100
//     var y1 = node1.y + 70
//     var x2 = node2.x + 100
//     var y2 = node2.y + 70
//     var x = (x1+x2)/2
//     var y = (y1+y2)/2
//     return (
//       <div className="linkNode"
//       style={{top:y,left:x,backgroundColor:"white"}}
//       onContextMenu={(e) => this.props.clickCallback(e,"edge",{contact:this.props.contact,links:this.props.links})}>
//         <div className="linkNodeText">
//           {this.props.links.length}
//         </div>
//       </div>
//     );
//   }
// }


// onContextMenu={(e) => this.props.clickCallback(e,"edge",{contact:this.props.contact,links:this.props.links})}>

const LinkNode = (actionHandler, state, link) => {
   var node1 = state.nodes[link.node1_uuid]
    var node2 = state.nodes[link.node2_uuid]
    var x1 = node1.x + 100
    var y1 = node1.y + 70
    var x2 = node2.x + 100
    var y2 = node2.y + 70
    var x = (x1+x2)/2
    var y = (y1+y2)/2

    // var contextMenuAction =  {
    //   action: 'openContextMenu',
    //   data: {
    //     type: "edge",
    //     data: {link: link}
    //   }
    // }

    //To get number of connections (deprecated)
    //{Object.keys(link.connections).length}
    return (
      <div className="linkNode"
      style={{top:y,left:x,backgroundColor:"white"}}
      onContextMenu={(e) => actionHandler( 
        {     
          type: 'openContextMenu',
          data: {
            e: e,
            type: "edge",
            data: {link: link}
          }
        }
      )}
      >
        <div className="linkNodeText">
          {link.protocol}
        </div>
      </div>
    );

}

export default LinkNode;
