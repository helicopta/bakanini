import React from 'react';
import './Header.css';
import {Row, Col } from 'reactstrap';
import {Link } from 'react-router-dom';
function Header(props) {
  return (    
    <Row className="header page">
    	<Col id="left"><img alt='' id="symbol" src={require('../assets/images/icon_i.png')}/><Link to = '/'></Link></Col>
      {props.isAbout ? 
        <Col id="right" onClick = {props.handleAbout}>Close</Col> : 
        <Col id="right" onClick = {props.handleAbout}>About</Col>}
    </Row>
        
  );
}

export default Header;