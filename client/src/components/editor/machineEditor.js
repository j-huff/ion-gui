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
import './editor.css'


class MachineEditor extends Component {

  MachineProp(name,label,type){
    if(!type){
      type = 'text'
    }
    return(
      <FormGroup controlId="formHorizontalEmail">
        <Col componentClass={ControlLabel} sm={3}>
          {label}
        </Col>
        <Col sm={9}>
          <FormControl onChange={this.handleInputChange.bind(this)} name={name} type={type} value={this.props.machineData[name]} />
        </Col>
        <HelpBlock>{this.props.helpMessages[name]}</HelpBlock>
      </FormGroup>
    )
  }

  handleInputChange = (e) =>{
    var name = e.target.name
    var value = e.target.value
    var data = this.props.machineData
    data[name] = value
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
    this.props.createMachineCallback()
  }

  renderBody(){
    if(this.props.machineData){
      return(
        <div>
        <Form horizontal>
          {this.MachineProp("name","Name","text")}
          {this.MachineProp("address","Address","text")}
          {this.MachineProp("ports","Ports","text")}
          
          <Button bsStyle="primary" type="submit" className="machineDoneButton" onClick={() => this.props.doneEditingCallback()} >
            Done
          </Button>
          <Button onClick={""} bsStyle="danger" style={{float:"right"}} className="machineDeleteButton" onClick={() => this.props.deleteMachineCallback(this.props.machineData.uuid)}>Delete</Button>
        </Form>
        
        </div>
        )
    }
    var machineList = (
      <div>NONE</div>
    )
    if(Object.values(this.props.machines).length > 0){
      machineList = Object.values(this.props.machines).map((m,idx) =>
        <ListGroupItem key={idx} className="machineListItem" style={{padding:0,height:"40px"}}>
          <Col className="machineListInner" sm={6}>
            {m.name}
          </Col>
          <Col className="machineListInner" sm={4}>
            {m.address}
          </Col>
          <Col sm={2}>
          <Button className="machineEditButton" onClick={() => this.props.editMachineCallback(m.uuid)} >
            <img src={EditIcon} height={"20px"} width={"20px"} style={{marginLeft:0,opacity: .4}}/>

          </Button>
          </Col>

        </ListGroupItem>
      );
    }
    

    return(
      <div>
      <ListGroup className="machineListGroup">
        {machineList}
      </ListGroup>
      <Button onClick={() => this.createNew()} bsStyle="primary" style={{float:"right"}}>New</Button>
      </div>
    );
  }

  render() {

    return (
      <Panel id="ProjectInfo" defaultExpanded>
        <Panel.Heading >
          <Panel.Title toggle componentClass="h3">Machines</Panel.Title>
        </Panel.Heading>
        <Panel.Body collapsible >
          {this.renderBody()}
          
        </Panel.Body>
      </Panel>
    );
  }
}

export default MachineEditor;
