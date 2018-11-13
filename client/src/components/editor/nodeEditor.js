import React, { Component } from 'react';
import {Panel,Button,PanelGroup,Form,Col, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'


import './nodeEditor.css';

// class NodeProp extends Component{
//   render(){
//     return(
      

//     )
//   }
// }



class NodeEditor extends Component {

  NodeProp(name,label,type){
    if(!type){
      type = 'text'
    }
    return(
      <FormGroup controlId="formHorizontalEmail">
        <Col componentClass={ControlLabel} sm={3}>
          {label}
        </Col>
        <Col sm={9}>
          <FormControl onChange={this.handleInputChange.bind(this)} name={name} type={type} value={this.props.nodeData[name]} />
        </Col>
        <HelpBlock>{this.props.helpMessages[name]}</HelpBlock>
      </FormGroup>
    )
  }

  handleInputChange = (e) =>{
    var name = e.target.name
    var value = e.target.value
    var data = this.props.nodeData
    data[name] = value
    console.log(data)
    this.props.inputChangeCallback(data)

  }

  renderControls(){
    var nodeData = this.props.nodeData
    var helpMessages = this.props.helpMessages
    if (nodeData){
      return (
        <Form horizontal>
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              Name
            </Col>
            <Col sm={9}>
              <FormControl onChange={this.handleInputChange.bind(this)} name="name" type="text" value={nodeData.name} />
            </Col>
            <HelpBlock>{helpMessages.name}</HelpBlock>
          </FormGroup>
          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              IPN
            </Col>
            <Col sm={9}>
              <FormControl onChange={this.handleInputChange.bind(this)} name="ipn" type="number" value={nodeData.ipn} />
            </Col>
            <HelpBlock>{helpMessages.ipn}</HelpBlock>
          </FormGroup>
          {this.NodeProp("wmKey","wmKey","number")}
          {this.NodeProp("sdrName","SDR Name","text")}
          {this.NodeProp("wmSize","wmSize","number")}
          {this.NodeProp("heapWords","heapWords","number")}
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
