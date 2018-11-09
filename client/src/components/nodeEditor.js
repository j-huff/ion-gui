import React, { Component } from 'react';
import {Panel,Button,PanelGroup,Form,Col, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'


import './nodeEditor.css';

class NodeEditor extends Component {
  // constructor() {
  //   console.log("Creating node")
  //   super();
  // }


  componentDidMount() {
    console.log(this.props.data)
    this.setState(this.props.data);
  }

  handleInputChange(e){
    var label = e.target.attributes.getNamedItem('label').value
    var value = e.target.value
    console.log(value)
    this.setState({
        [label]:value
      },
      
    )
    this.state[label]=value
    var res = this.props.dataChangeCallback(this.state)
    this.setState(res)
  }

  render() {
    if(this.state == null){
      return (<div></div>);
    }
    return (


          <Panel.Body collapsible >
            <Form horizontal>
              <FormGroup controlId="formHorizontalEmail">
                <Col componentClass={ControlLabel} sm={2}>
                  Name
                </Col>
                <Col sm={10}>
                  <FormControl onChange={this.handleInputChange.bind(this)} label="name" type="text" value={this.state.name} />
                </Col>
                <HelpBlock>{this.state.nameHelp}</HelpBlock>
              </FormGroup>
              <FormGroup controlId="formHorizontalEmail">
                <Col componentClass={ControlLabel} sm={2}>
                  IPN
                </Col>
                <Col sm={10}>
                  <FormControl onChange={this.handleInputChange.bind(this)} label="ipn" type="number" value={this.state.ipn} />
                </Col>
                <HelpBlock>{this.state.ipnHelp}</HelpBlock>
              </FormGroup>
            </Form>


          </Panel.Body>

    );
  }
}

export default NodeEditor;
