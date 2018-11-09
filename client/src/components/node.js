import React, { Component } from 'react';
import EventListener from 'react-event-listener';
import {Panel, Row, Col,Button, Grid} from 'react-bootstrap'


import './node.css';


class Node extends Component {
  constructor(props) {
    console.log("Creating node")
    super(props);
  }


  componentDidMount() {
    this.setState(this.props.data);
    this.setState({"mousedown":false,mouseMoveListener:null,mouseUpListener:null})
  }

  handleHeadingMouseDown = (e) =>{
    console.log("heading clicked")
    this.setState({"mousedown":{x:e.clientX,y:e.clientY}})
    this.setState({
      mouseMoveListener: <EventListener target={document} onMouseMoveCapture={this.handleMouseMove} />,
      mouseUpListener: <EventListener target={document} onMouseUpCapture={this.handleMouseUp} />
    })
  }

  handleFooterMouseDown = (e) =>{

    // document.body.style.userSelect = "none"
    document.getElementById("root").style.userSelect = "none";


    this.setState({"mousedown":{x:e.clientX,y:e.clientY}})
    this.setState({
      mouseMoveListener: <EventListener target={document} onMouseMoveCapture={this.handleMouseMoveFooter} />,
      mouseUpListener: <EventListener target={document} onMouseUpCapture={this.handleMouseUpFooter} />,
      mouseOverListener: <EventListener target={document} onMouseOverCapture={this.handleMouseOverFooter} />,
      mouseOutListener: <EventListener target={document} onMouseOutCapture={this.handleMouseOutFooter}/> ,
    })
  }

  handleMouseMove = (e) =>{
    var newX = this.state.x + e.movementX
    var newY = this.state.y + e.movementY
    this.setState({
      x: newX,
      y:newY
    })

  }
  handleMouseUp = (e) =>{
    this.setState({
      mouseMoveListener: null,
      mouseUpListener: null
    })
  }

  handleMouseMoveFooter = (e) =>{
    var data = {
      mousedown: this.state.mousedown,
      x: e.clientX,
      y: e.clientY,
    }
    this.props.drawActiveStrokeCallback(data)
  }

  handleMouseUpFooter = (e) =>{

    var data = {
      mousedown: {x:-100,y:-100},
      x: 0,
      y: 0,
    }
    this.props.drawActiveStrokeCallback(data)

    this.setState({
      mouseMoveListener: null,
      mouseUpListener: null,
      mouseOverListener: null,
      mouseOutListener: null
    })

    if(e.target.classList.contains("nodePanelFooterSelect")){
      console.log(e.target)
      console.log(e.target.parentNode)
      e.target.style.backgroundColor="#007bff"
    }
  }

  handleMouseOverFooter = (e) =>{

    if(e.target.classList.contains("nodePanelFooterSelect")){
      console.log(e.target)
      console.log(e.target.parentNode)
      e.target.style.backgroundColor="#28a745"
    }

  }

  handleMouseOutFooter = (e) =>{
    if(e.target.classList.contains("nodePanelFooterSelect")){
      console.log(e.target)
      console.log(e.target.parentNode)
      e.target.style.backgroundColor="#007bff"
    }

  }

  render() {
    if(this.state == null){
      return (<div></div>);
    }
    return (
      <div>
      {this.state.mouseMoveListener}
      {this.state.mouseUpListener}
      {this.state.mouseOverListener}
      {this.state.mouseOutListener}
      <Panel dictkey={this.state.dictkey} className="nodePanel" style={{left:this.state.x, top:this.state.y}}>
        <Panel.Heading onMouseDown={this.handleHeadingMouseDown.bind(this)}>
          <Panel.Title componentClass="h6">{this.state.name}</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          ipn:{this.state.ipn}.0
        </Panel.Body>
        <Panel.Footer className="nodePanelFooter">
          <Row>
            <Col onMouseDown={this.handleFooterMouseDown.bind(this)}  className="nodePanelFooterSelect bg-primary"> &#10231;</Col>
            <Col>
              <Button className="nodeEditButton">
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

export default Node;
