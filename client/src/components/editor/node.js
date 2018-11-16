import React, { Component } from 'react';
import EventListener from 'react-event-listener';
import {Panel, Row, Col,Button, Grid} from 'react-bootstrap'
import Radium from 'radium';


import './node.css';

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

class Node extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  handleHeadingMouseDown = (e) =>{
    this.props.dragCallback(e,this.props.data.uuid,this.props.data.x,this.props.data.y)
  }

  handleFooterMouseDown = (e) =>{
    this.props.linkCallback(e,this.props.data.uuid)
  }

  render() {

    var props = this.props.data

    var hoverStyle = {}
    if(props.hover){
      hoverStyle = {backgroundColor: "#28a745"}
    }

    const machineName = () => {
      if(!this.props.machine){return (
        <Row ><Col sm={12} style={{color:"red"}}> SELECT MACHINE</Col></Row>

      )}
      var name = this.props.machine.name

      if(name.length === 0){
        name = '\u0000'
      }
      var maxLength = 20
      if(name.length > maxLength){
        name = name.slice(0,maxLength-2)
        name = name+"..."
      }
      
      return(
        <Row ><Col sm={12}>{name} </Col></Row>
      )
    }


    return (
      <div>

      <Panel className="nodePanel" style={{left:props.x, top:props.y}} onMouseOver={()=>this.props.mouseOverCallback(props.uuid)} onMouseOut={()=>this.props.mouseOutCallback(props.uuid)}>
        <Panel.Heading className="nodeHeading" onMouseDown={this.handleHeadingMouseDown.bind(this)}>
          <Panel.Title componentClass="h6">{props.name}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Row ><Col sm={4}> ipn:{props.ipn}.0 </Col></Row>
          {machineName()}
        </Panel.Body>
        <Panel.Footer className="nodePanelFooter">
          <Row>
            <Col onMouseDown={this.handleFooterMouseDown.bind(this)} style={hoverStyle} className="nodePanelFooterSelect bg-primary"> &#10231;</Col>
            <Col>
              <Button onClick={()=>this.props.editNodeCallback(props.uuid)} className="nodeEditButton">
                Edit
              </Button>
            </Col>
          </Row>
          
        </Panel.Footer>

      </Panel>
      </div>
    );
  }
}

Node = Radium(Node)
export default Node;
