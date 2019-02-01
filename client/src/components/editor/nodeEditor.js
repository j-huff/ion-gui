import React, { Component } from 'react';
import {Panel,Button,PanelGroup,Form,Col, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'
import Select from 'react-select'


import './nodeEditor.css';
import './editor.css'

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
    this.props.inputChangeCallback(data)
  }

  handleSelect = (obj) =>{
    this.handleInputChange({target:{name:"machine",value:obj.value}})
  }

  renderControls(){
    var nodeData = this.props.nodeData
    var helpMessages = this.props.helpMessages

    

    if (nodeData){
      var options = []
      for(let m of Object.values(this.props.machineList)) {
        options.push({label:m.name,value: m.uuid})     
      }

      // if(!nodeData.machine){
      //   options.unshift({value: "select",label:"select"})
      // }

      var mach = this.props.machineList[nodeData.machine]
      var placeholder="select"
      if(mach){
        placeholder=mach.name
      }
      const machineSelect = <Select
          options={options}
          placeholder={placeholder}
          onChange={this.handleSelect.bind(this)}
          clearable={false}/>

      
      return (
        <Form horizontal>

          <FormGroup controlId="formHorizontalEmail">
            <Col componentClass={ControlLabel} sm={3}>
              Machine
            </Col>
            <Col sm={9}>
              {machineSelect}
            </Col>
            <HelpBlock>{helpMessages.ipn}</HelpBlock>
          </FormGroup>

          {this.NodeProp("name","Name","text")}
          {this.NodeProp("ipn","IPN","text")}

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

        <Panel id="nodeEditor" defaultExpanded>
            <Panel.Heading >
              <Panel.Title toggle componentClass="h3">Edit Node</Panel.Title>
            </Panel.Heading>
          <Panel.Body collapsible >
            
            {this.renderControls()}

          </Panel.Body>
        </Panel>

    );
  }
}

export default NodeEditor;
