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
    <h4 class="warn">Select link to edit</h4>
    </div>
    </Panel>
    )
  }
  if(state.editingLink){
    var link = state.links[state.editingLink]
    var node1 = state.nodes[link.node1_uuid]
    var node2 = state.nodes[link.node2_uuid]
    header = () =>{
      return(
      <Panel>
      <div class="page-right-header">
      <h4 >Editing link between {node1.name} and {node2.name}</h4>
      </div>
      </Panel>
      )
    }
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
