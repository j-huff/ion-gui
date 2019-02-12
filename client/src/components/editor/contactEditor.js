import React, { Component } from 'react';
import {Panel,Button,PanelGroup,Form,Col, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'

import ScrollEditBox from './scrollEditBox';


const ContactEditor = (actionHandler, state) => {

  var ScrollEditBoxConfig = {
    "data":null,
    "name":"contacts",
    "parent":"links",
    "updateActionType":"updateContacts",
    "newActionType":"createContact",
    "deleteActionType":"deleteContact",
    "props": [
      {
        "label": "Name",
        "name": "name",
        "type": "Text", 
      },
      {
        "label": "From time",
        "name": "fromTime",
        "type": "Text", 
      },
      {
        "label": "Until time",
        "name": "untilTime",
        "type": "Text", 
      },
      {
        "label": "Transmit Rate (bps)",
        "name": "rate",
        "type": "Text", 
      },
      {
        "label": "Confidence",
        "name": "confidence",
        "type": "Text", 
      },
    ],
    "previewProps": [{name:"name",width:12}],
  }

  if(state.editingLink){
    ScrollEditBoxConfig["data"] = state.links[state.editingLink].contacts
  }

  return (
    <Panel id="ContactEditor" defaultExpanded>
      <Panel.Heading >
        <Panel.Title toggle componentClass="h3">Contacts</Panel.Title>
      </Panel.Heading>
      <Panel.Body collapsible >
        {ScrollEditBox(actionHandler,state,ScrollEditBoxConfig)}
      </Panel.Body>
    </Panel>
  );


}

export default ContactEditor;
