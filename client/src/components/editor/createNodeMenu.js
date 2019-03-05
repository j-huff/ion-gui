import React, { Component } from 'react';
import {Panel,Button, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'


import './createNodeMenu.css';
const nodeDefault = {
    protocolSettings:{
      TCP:{
        payloadBytesPerFrame: 1400,
        overheadBytesPerFrame: 100,
        nominalDataRate:-1
      },
      UDP:{
        payloadBytesPerFrame: 1400,
        overheadBytesPerFrame: 100,
        nominalDataRate:-1
      }
    }
  }
class CreateNodeMenu extends Component {



  componentDidMount() {

  }

  selectItem(command){
    this.props.parentCallback("CreateNode",this.props.x,this.props.y)
  }

  submit = (e) =>{
    e.preventDefault();

    var t = e.target
    
    var node = {
      ...nodeDefault,
      name: t.name.value,
      ipn: t.ipn.value,
      x: this.props.x,
      y: this.props.y
    }

    this.props.submitCallback(node)
  }

  handleClose(){
    this.props.closeCallback()
  }

  submissionResponse(res){

  }

  render() {
    var display = "none"
    if(this.props.opened){
      display = "block"
    }
    return (
      <Panel id="createNodePanel" style={{left:this.props.x, top:this.props.y, display:display}}>
        <Panel.Heading >
          <Panel.Title componentClass="h3">Create Node</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <form onSubmit={this.submit}>

            <FormGroup controlId="NameGroup">
              <ControlLabel>Name</ControlLabel>
              <FormControl autoComplete="off"  type="text" name="name" placeholder="Enter name"/>
              <HelpBlock>{this.props.helpMessages.name}</HelpBlock>
            </FormGroup>
            <FormGroup controlId="IpnGroup">
              <ControlLabel>IPN (ipn:x.0)</ControlLabel>
              <FormControl autoComplete="off"  type="number" name="ipn" placeholder="Enter number"/>
              <HelpBlock>{this.props.helpMessages.ipn}</HelpBlock>
            </FormGroup>
            <div className="pull-right">
            <Button onClick={()=>this.handleClose()}>Close</Button><Button type="submit" bsStyle="primary">Submit</Button>
            </div>
          </form>
        </Panel.Body>

      </Panel>
    );
  }
}

export default CreateNodeMenu;
