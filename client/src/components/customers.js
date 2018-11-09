import React, { Component } from 'react';

import './customers.css';

class Customers extends Component {
  constructor() {
    super();
    this.state = {
      customers: []
    };
    this.handleNVFocus = this.handleNVFocus.bind(this);
  }


  handleNVFocus = event => {
      console.log('Focused: ' + this.props.menuItem.caption.toUpperCase());
  }

  componentDidMount() {
    fetch('/api/customers')
      .then(res => res.json())
      .then(customers => this.setState({customers}, () => console.log('Customers fetched...', customers)));
  
  }

  handleClick(e) {
    console.log('The link was clicked.');
  }

  render() {
    return (
      <div>
        <h2>Customers 1</h2>
        <ul>
        {this.state.customers.map(customer => 
          <li key={customer.id}>{customer.firstName} {customer.lastName}</li>
        )}
        </ul>
        <button onMouseMove={this.handleClick.bind(this)} value="Click me" />
      </div >
    );
  }
}

export default Customers;
