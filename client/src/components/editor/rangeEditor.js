import React, { Component } from 'react';
import {Panel,Button,PanelGroup,Form,Col, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'

import ScrollEditBox from './scrollEditBox';

const RangeEditor = (actionHandler, state) => {
	var ScrollEditBoxConfig = {
	"data":null,
	"name":"ranges",
	"parent":"links",
	"updateActionType":"updateRanges",
	"newActionType":"createRange",
	"deleteActionType":"deleteRange",
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
        "label": "One-Way Light Time",
        "name": "owlt",
        "type": "Text", 
      },
    ],
	"previewProps": [{name:"name",width:12}],
  }

  if(state.editingLink){
	ScrollEditBoxConfig["data"] = state.links[state.editingLink].ranges
  }
  return (
	<Panel id="RangeEditor" defaultExpanded>
	  <Panel.Heading >
		<Panel.Title toggle componentClass="h3">Ranges</Panel.Title>
	  </Panel.Heading>
	  <Panel.Body collapsible >
		{ScrollEditBox(actionHandler,state,ScrollEditBoxConfig)}
	  </Panel.Body>
	</Panel>
  );

}

export default RangeEditor;
