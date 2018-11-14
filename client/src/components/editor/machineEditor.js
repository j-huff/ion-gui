import React, { Component } from 'react';
import {ListGroup, ListGroupItem, Panel,Button,PanelGroup,Form,Col, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'

import EditIcon from "./edit.svg" ;

// class NodeProp extends Component{
//   render(){
//     return(
      

//     )
//   }
// }

import './machineEditor.css';


class MachineEditor extends Component {

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

    if (true){
      return (
        <div>
          Hello
        </div>
      );
    }else{
      return ("");
    }
  }

  createNew(){

  }

  render() {
    
    const machineList = Object.values(this.props.machines).map((m,idx) =>
      <ListGroupItem className="machineListItem" style={{padding:0,height:"40px"}}>
        {m.name}
        <Button className="machineEditButton" onClick={() => this.createNew()} >
          <img src={EditIcon} height={"20px"} width={"20px"} style={{marginLeft:0,opacity: .4}}/>

        </Button>

      </ListGroupItem>
    );

    return (
      <Panel id="ProjectInfo" defaultExpanded>
        <Panel.Heading >
          <Panel.Title toggle componentClass="h3">Machines</Panel.Title>
        </Panel.Heading>
        <Panel.Body collapsible >
          <ListGroup className="machineListGroup">
            {machineList}
          </ListGroup>
          <Button onClick={() => this.createNew()} bsStyle="primary" style={{float:"right"}}>New</Button>

        </Panel.Body>
      </Panel>
    );
  }
}

export default MachineEditor;
