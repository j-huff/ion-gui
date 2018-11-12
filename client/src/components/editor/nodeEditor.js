import React, { Component } from 'react';
import {Panel,Button,PanelGroup,Form,Col, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'


import './nodeEditor.css';

class NodeEditor extends Component {

  handleInputChange(e){
    var name = e.target.name
    var value = e.target.value
    var data = this.props.nodeData
    data[name] = value
    this.props.inputChangeCallback(data)
  }

  renderControls(){
    var nodeData = this.props.nodeData
    var helpMessages = this.props.helpMessages
    if (nodeData){
      return (
        <Form horizontal>
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={2}>
              Name
            </Col>
            <Col sm={10}>
              <FormControl onChange={this.handleInputChange.bind(this)} name="name" type="text" value={nodeData.name} />
            </Col>
            <HelpBlock>{helpMessages.name}</HelpBlock>
          </FormGroup>
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={2}>
              IPN
            </Col>
            <Col sm={10}>
              <FormControl onChange={this.handleInputChange.bind(this)} name="ipn" type="number" value={nodeData.ipn} />
            </Col>
            <HelpBlock>{helpMessages.ipn}</HelpBlock>
          </FormGroup>
          <Button onClick={() => this.props.deleteNodeCallback(nodeData.uuid)} bsStyle="danger" style={{float:"right"}}>Delete</Button>
        </Form>
      );
    }else{
      return ("");
    }
  }

  render() {
   

    return (


          <Panel.Body collapsible >
            
            {this.renderControls()}

          </Panel.Body>

    );
  }
}

export default NodeEditor;
