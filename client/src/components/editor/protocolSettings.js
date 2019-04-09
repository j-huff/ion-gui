import React, { Component } from 'react';
import {Nav,NavItem,NavLink,ListGroup,FormCheck, ListGroupItem, Panel,Button,PanelGroup,Form,Col, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'

import './protocolSettings.css'

const ProtocolSettings = (actionHandler, state, config) => {
	
    var config = {
      "protocols":{
        "tcp":{
          "name":"TCP",
          "props":[
            {
            "label": "Payload bytes per frame",
            "name": "payloadBytesPerFrame",
            "type": "Text", 
            },
            {
            "label": "Overhead bytes per frame",
            "name": "overheadBytesPerFrame",
            "type": "Text", 
            },
            {
            "label": "Nominal data rate (btyes/sec)",
            "name": "nominalDataRate",
            "type": "Text", 
            },
              ],

        },
        "udp":{
          "name":"UDP",
          "props":[
            {
            "label": "Payload bytes per frame",
            "name": "payloadBytesPerFrame",
            "type": "Text", 
            },
            {
            "label": "Overhead bytes per frame",
            "name": "overheadBytesPerFrame",
            "type": "Text", 
            },
            {
            "label": "Nominal data rate (btyes/sec)",
            "name": "nominalDataRate",
            "type": "Text", 
            },
              ],
        }
      }
    }
    console.log(this.state)
    var editingNode = state.nodeEditor["node_uuid"];

    var node = state.nodes[editingNode]

    var forms = Object.values(config.protocols).map((protocol,idx) =>{
      if(protocol.name != state.nodeEditor.editingProtocol){
        return(<div></div>)
      }

      var formGroups = Object.values(protocol.props).map((m,idx) => {
        return(
        <FormGroup key={idx} controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={5}>
              {m.label}
            </Col>
            <Col sm={7}>
              <FormControl 
              onChange={(e) => actionHandler({type:"updateNodeProtocolSettings",data:{node:editingNode,protocol:protocol.name,name:m.name,value:e.target.value}})} 
              name={m.name} 
              type={m.type} 
              value={node.protocolSettings[protocol.name][m.name]} />
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

    var navItems = Object.values(config.protocols).map((m,idx) => {
        console.log(m.name)
        console.log(state.nodeEditor.editingProtocol)
        return(
        <NavItem  eventKey={m.name} onClick={(e) => actionHandler({type:"updateProtocolSettingsNav",data:m.name})} >
          {m.name}
        </NavItem>
  
          )
      })
    console.log(state.nodeEditor)
    return(
    <div >  
      <h5>Edit protocol settings</h5>


      <div id = "protocolNav">
        <Nav activeKey={ state.nodeEditor.editingProtocol}  variant="pills" className="flex-column" >
          {navItems}

        </Nav>
        <Form>
          <FormGroup>
            <div className="form-check">
              <input onChange={(e)=>actionHandler({type:"toggleShowUnusedProtocols"})} type="checkbox" id='showProtocolsCheckbox' className='form-check-input' checked={!!state.nodeEditor.showUnusedProtocols}/>
              <label title type="checkbox" for="showProtocolsCheckbox" class="form-check-label">
              Show unused protocols
              </label>
            </div>
          </FormGroup>
        </Form>
        
      </div>
      {forms}
    </div>
    );
	
}

export default ProtocolSettings;
