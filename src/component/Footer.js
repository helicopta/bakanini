import React from 'react';
import {Row, Col } from 'reactstrap';
import './Header.css'

function Footer() {
  return (    
    <Row className="footer page">
    	<Col id="left">LinkedIn</Col>
      <Col id="right">Page</Col>
    </Row>
        
  );
}

export default Footer;