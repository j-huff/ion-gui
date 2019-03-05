import React, { Component } from 'react';
import {Panel,Button,PanelGroup,Form,Col, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'

const ConnectionEditor = (actionHandler, state) => {

	


	var config = {
      "protocols":{
        "tcp":{
          "name":"TCP",
          "props":[
            {
            "label": "Port 1",
            "name": "port1",
            "type": "Text", 
            },
            {
            "label": "Port 2",
            "name": "port2",
            "type": "Text", 
            }
            
              ],

        },
        "udp":{
          "name":"UDP",
          "props":[
            {
            "label": "Port 1",
            "name": "port1",
            "type": "Text", 
            },
            {
            "label": "Port 2",
            "name": "port2",
            "type": "Text", 
            }
            
            ],
        }
      }
    }




	

	if(!state.editingLink){
		return (
		<Panel id="ConnectionEditor" defaultExpanded>
			<Panel.Heading >
				<Panel.Title toggle componentClass="h3">Protocol</Panel.Title>
			</Panel.Heading>
			<Panel.Body collapsible >
				<FormGroup>
				<select class="form-control" value="None">
				</select>
				</FormGroup>
			</Panel.Body>
		</Panel>
		);
	}

	var options = []

	for (var key in config.protocols){
		var name = config.protocols[key].name
		options.push({label:name,value: name})
	}



	var options = Object.values(config.protocols).map((m,idx) =>{
		var selected = "";
		if(m.name == state.links[state.editingLink].protocol){
			selected="selected"
		}
		return(
          <option key={idx} value={m.name} selected={selected}>{m.name}</option>
        )
		}
      );

	var placeholder = "None"

	var forms = Object.values(config.protocols).map((protocol,idx) =>{
	  if(protocol.name != state.links[state.editingLink].protocol){
	  	return(<div></div>)
	  }

      var formGroups = Object.values(protocol.props).map((m,idx) => {
        return(
        <FormGroup key={idx} controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              {m.label}
            </Col>
            <Col sm={9}>
              <FormControl 
              onChange={(e) => actionHandler({type:"updateLinkProtocolSettings",data:{link:state.editingLink,protocol:protocol.name,name:m.name,value:e.target.value}})} 
              name={m.name} 
              type={m.type} 
              value={state.links[state.editingLink].protocolSettings[protocol.name][m.name]} />
            </Col>
            <HelpBlock></HelpBlock>
          </FormGroup>
          )
      })

      return(
        <Form horizontal key={idx}>
        {formGroups}
        </Form>
      )
    })

	return (
	<Panel id="ConnectionEditor" defaultExpanded>
		<Panel.Heading >
			<Panel.Title toggle componentClass="h3">Protocol</Panel.Title>
		</Panel.Heading>
		<Panel.Body collapsible >
			<Form>
			<FormGroup>
			<select class="form-control"
			onChange={(e)=>actionHandler({type:"changeLinkProtocol",data:{link:state.editingLink,protocol:e.target.value}})}
			>
			  {options}
			</select>
			</FormGroup>

			</Form>

			{forms}
		</Panel.Body>
	</Panel>
	);

}

export default ConnectionEditor;
