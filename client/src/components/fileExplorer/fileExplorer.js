import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {Panel,Row,Col, ListGroup, ListGroupItem, Button} from 'react-bootstrap'
import Radium from 'radium';
import './fileExplorer.css';

var remoteURL = 'localhost:5000'

class FileExplorer extends Component {

	componentDidMount(){
		fetch('/api/projectFiles').then(res => res.json())
		.then(res => {
			this.setState({
				files:res
			})
		})
	}

  render() {
  	if(!this.state){
  		return(<div></div>)
  	}
  	const listItems = this.state.files.map((f,idx) =>
  		<ListGroupItem key={idx} className="fileListItem" style={{padding:0}}>
		  <Link  to={"/editor/"+f.meta.id} key={idx} className="fileListLink">
		   	<div className="fileListText"> {f.meta.projectTitle}</div>
		   </Link>
			</ListGroupItem>
		);
    return (
      <div id="FileExplorer" className="App">
        
        <Panel style={{width:"500px", textAlign:"left"}}>
        <Panel.Heading>
        	<Row>
        		<Col xs={12} md={8}>
        			<Panel.Title>
        				<h4 style={{padding:0,margin:0,marginTop:"10px"}}>Projects</h4>
        			</Panel.Title>
        		</Col>
        		<Col xs={6} md={4}>
        			<Link to={"/editor/new"}> 
        			<Button bsStyle="primary" style={{float:"right"}}>New</Button>
        			</Link>
        		</Col>
        	</Row>
        </Panel.Heading>
        <Panel.Body>
        	<ListGroup>
        		{listItems}
        	</ListGroup>
          
        </Panel.Body>
        <Panel.Footer className="nodePanelFooter">
       		
        </Panel.Footer>

      </Panel>
      </div>
    );
  }
}
// FileExplorer = Radium(FileExplorer)
export default FileExplorer;
