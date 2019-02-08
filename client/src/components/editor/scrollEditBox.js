import React, { Component } from 'react';
import {ListGroup, ListGroupItem, Panel,Button,PanelGroup,Form,Col, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap'
import EditIcon from "./edit.svg" ;

import './scrollEditBox.css';
import './editor.css'

  // var ScrollEditBoxConfig = {
  //   "data":state.links[state.editingLink]["contacts"]
  //   "name":contacts,
  //   "updateAction":"updateContacts",
  //   "newAction":"createContact",
  //   "deleteAction":"deleteContact",
  //   "props": {
  //     "name": "ID",
  //     "type": "Text", 
  //   },
  //   "previewProps": ["name"]
  // }


const ScrollEditBox = (actionHandler, state, config) => {
	var ListItem = (item,idx) => {
		var cols = Object.values(config.previewProps).map((prop,idx) =>
			<Col key={idx} className="SEBListInner" sm={prop.width}>
				{item[prop.name]}
			</Col>
	      );
		return(
			<ListGroupItem key={idx} className="SEBListItem" style={{padding:0,height:"40px"}}>
				{cols}
	          <Col sm={2}>
	          <Button className="SEBEditButton" onClick={()=>actionHandler({
	            type: "editScrollItem",
	            data: {
	              name:config.name,
	              uuid:item.uuid
	            }
	          })}>
	            <img src={EditIcon} height={"20px"} width={"20px"} style={{marginLeft:0,opacity: .4}}/>
	          </Button>
	          </Col>
	        </ListGroupItem>
        )
	}
	var List = (
      <div></div>
    )
    if(config.data && Object.values(config.data).length > 0){
      var ListItems = Object.values(config.data).map((m,idx) =>
        <div>
        	{ListItem(m,idx)}
        </div>
      );
      List = (
      	<ListGroup className="SEBListGroup">
      	{ListItems}
      	</ListGroup>
      )
    }
    var createNewAction = {
    	type: config.newActionType,
    	data:null
    }
    if(state.scrollEditBoxes[config.name] && state.scrollEditBoxes[config.name].uuid !== null){
    	var editBox = state.scrollEditBoxes[config.name]
    	var formGroups = Object.values(config.props).map((m,idx) => {
    		return(
    		<FormGroup key={idx} controlId="formHorizontalEmail">
		        <Col componentClass={ControlLabel} sm={3}>
		          {m.label}
		        </Col>
		        <Col sm={9}>
		          <FormControl onChange={() => actionHandler()} name={m.name} type={m.type} value={config.data[editBox.uuid][m.name]} />
		        </Col>
		        <HelpBlock></HelpBlock>
		      </FormGroup>
		      )
    	})

    	return(
        <div>
        <Form horizontal>
			{formGroups}          
          <Button bsStyle="primary" type="submit" className="SEBDoneButton" onClick={(e) => {e.preventDefault(); actionHandler({type:"doneEditingScrollItem",data:config.name})}} >
            Done
          </Button>
          <Button onClick={""} bsStyle="danger" style={{float:"right"}} className="SEBDeleteButton" onClick={() => this.props.deleteMachineCallback(this.props.machineData.uuid)}>Delete</Button>
        </Form>
        
        </div>
        )
    }
    else{
	    return(
	      <div>  
	       {List}
	      <Button onClick={() => actionHandler(createNewAction)} bsStyle="primary" style={{float:"right"}}>New</Button>
	      </div>
	    );
	}
}

export default ScrollEditBox;
