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



const BootomToolbar = (actionHandler, state) => {
  
  function renderControls(){
    return "";
  }

  return (

    <Box className="bottomToolbarWrapper" pose={state.pose} >
    <Panel className="bottomToolbar" >
      <Panel.Heading onClick={()=>actionHandler({type:"toggle_bottom_toolbar"})}>
      </Panel.Heading>

      {renderControls()}

    </Panel>
    </Box>

  );

}

export default BootomToolbar;
