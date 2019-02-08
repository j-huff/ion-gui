import React, { Component } from 'react';
import {Panel,Button,PanelGroup,Form,Col, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'

import './bottomToolbar.css';


const LinkEditor = (state,actionHandler) => {

  const header = () =>(
      <p>NONE</p>
    )

  return (
    <div class='page-right-menu-page'>
    {header}
    <Panel id="ContactEditor" defaultExpanded>
      <Panel.Heading >
        <Panel.Title toggle componentClass="h3">Contacts</Panel.Title>
      </Panel.Heading>
      <Panel.Body collapsible >
        
      </Panel.Body>
    </Panel>
    <Panel id="LinkEditor" defaultExpanded>
      <Panel.Heading >
        <Panel.Title toggle componentClass="h3">Connections</Panel.Title>
      </Panel.Heading>
      <Panel.Body collapsible >
        
      </Panel.Body>
    </Panel>
    </div>
  );

}

export default LinkEditor;
