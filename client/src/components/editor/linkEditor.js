import React, { Component } from 'react';
import {Panel,Button,PanelGroup,Form,Col, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'

import './bottomToolbar.css';
import './pageRight.css'
import ContactEditor from './contactEditor';
import RangeEditor from './rangeEditor';
import ConnectionEditor from './connectionEditor';


const LinkEditor = (actionHandler,state) => {

  var header = () => {
    return(
    <Panel>
    <div class="page-right-header">
    <h4>Select link to edit</h4>
    </div>
    </Panel>
    )
  }
  if(state.editingLink){
    header = () =>(
      <div></div>
    )
  }

  return (
    <div class='page-right-menu-page'>
      
      {header()}
      
    {ContactEditor(actionHandler,state)}
    {RangeEditor(actionHandler,state)}
    {ConnectionEditor(actionHandler,state)}
    </div>
  );

}

export default LinkEditor;
