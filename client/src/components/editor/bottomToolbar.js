import React, { Component } from 'react';
import {Panel,Button,PanelGroup,Form,Col, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'
import Select from 'react-select'
import posed from 'react-pose';


import './bottomToolbar.css';

// class NodeProp extends Component{
//   render(){
//     return(
      

//     )
//   }
// }

const Box = posed.div({
  closed: { height: "15px" },
  opened: { height: "300px" }
})

const ContactEditor = (actionHandler, contactEditor,nodes,contacts) => {
  if(!contactEditor.contact_uuid){
    return
  }
  var contact = contacts[contactEditor.contact_uuid]
  return(
    <div>
      Contact between {nodes[contact.node1_uuid].name} and {nodes[contact.node2_uuid].name} <br/>
      From: {contact.from} <br/>
      Until: {contact.until}
    </div>
  );
}

const BottomToolbar = (actionHandler, state, contactEditor,nodes,contacts) => {

  return (

    <Box className="bottomToolbarWrapper" pose={state.pose} style={{overflow:"hidden"}}>
    <Panel className="bottomToolbar" >
      <Panel.Heading onClick={()=>actionHandler({type:"toggle_bottom_toolbar"})}>
      </Panel.Heading>

      <Panel.Body>
        {ContactEditor(actionHandler, contactEditor,nodes,contacts)}
      </Panel.Body>

    </Panel>
    </Box>

  );

}

export default BottomToolbar;
