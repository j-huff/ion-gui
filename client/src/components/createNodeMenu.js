import React, { Component } from 'react';
import {Panel,Button, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'


import './createNodeMenu.css';

class CreateNodeMenu extends Component {
  constructor() {
    console.log("Creating node")
    super();
    this.state = {
      "name": null,
      "ipn":null
    }
  }


  componentDidMount() {

  }
  openNewNodeMenu(){
    console.log("New node menu")
  }

  handleClick(e) {
    console.log('The link was clicked.');
  }

  selectItem(command){
    this.props.parentCallback("CreateNode",this.props.x,this.props.y)
  }

  handleInputChange(e){
    var label = e.target.attributes.getNamedItem('label').value
    var value = e.target.value
    console.log(label)
    this.setState({
      [label]:value
    })
    console.log(this.state)
  }

  handleSubmit(){
    console.log("Submitting node creation")
    // this.setState({
    //   "x":this.props.x,
    //   "y":this.props.y
    // })
    var fail = false
    if(this.state.name == null || this.state.name.length < 1){
      this.setState({nameHelp:"Name required"})
      fail = true
    }else{
      this.setState({nameHelp:null})
    }

    if(this.state.ipn == null || parseInt(this.state.ipn) < 1){
      this.setState({ipnHelp:"number must be greater than 0"})
      fail = true
    }else{
      this.setState({ipnHelp:null})
    }


    if(fail){return}


    var node = {
      "name":this.state.name,
      "ipn":this.state.ipn,
      "x":this.props.x,
      "y":this.props.y,
    }
    this.props.parentSubmitCallback(node)
  }

  handleClose(){
    console.log("Closing create node menu")
    this.props.parentCloseCallback("a")
  }

  submissionResponse(res){
    console.log(res)
  }

  render() {
    return (
      <Panel id="createNodePanel" style={{left:this.props.x, top:this.props.y}}>
        <Panel.Heading >
          <Panel.Title componentClass="h3">Create Node</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <form>

            <FormGroup controlId="NameGroup">
              <ControlLabel>Name</ControlLabel>
              <FormControl onChange={this.handleInputChange.bind(this)} type="text" label="name" placeholder="Enter name"/>
              <HelpBlock>{this.state.nameHelp}</HelpBlock>
            </FormGroup>
            <FormGroup controlId="IpnGroup">
              <ControlLabel>IPN (ipn:x.0)</ControlLabel>
              <FormControl onChange={this.handleInputChange.bind(this)} type="number" label="ipn" placeholder="Enter number"/>
              <HelpBlock>{this.state.ipnHelp}</HelpBlock>
            </FormGroup>
            <div className="pull-right">
            <Button onClick={()=>this.handleClose()}>Close</Button><Button onClick={() => this.handleSubmit()} bsStyle="primary">Submit</Button>
            </div>
          </form>
        </Panel.Body>

      </Panel>
    );
  }
}

export default CreateNodeMenu;
