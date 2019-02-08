import React, { Component } from 'react';
import {Panel,Button,PanelGroup,Form,Col, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'

import ScrollEditBox from './scrollEditBox';


const ConnectionEditor = (actionHandler, state) => {
	var ScrollEditBoxConfig = {
	"data":null,
	"name":"connections",
	"updateActionType":"updateConnections",
	"newActionType":"createConnection",
	"deleteActionType":"deleteConnection",
	"props": [
	  {
		"label": "Name",
		"name": "name",
		"type": "Text", 
	  },
	  {
		"label": "Protocol",
		"name": "protocol",
		"type": "Text", 
	  },
	],
	"previewProps": [{name:"name",width:12}],
  }
  if(state.editingLink){
	ScrollEditBoxConfig["data"] = state.links[state.editingLink].connections
  }
  return (
    <Panel id="ConnectionEditor" defaultExpanded>
      <Panel.Heading >
        <Panel.Title toggle componentClass="h3">Connections</Panel.Title>
      </Panel.Heading>
      <Panel.Body collapsible >
        {ScrollEditBox(actionHandler,state,ScrollEditBoxConfig)}
      </Panel.Body>
    </Panel>
  );

}

export default ConnectionEditor;
