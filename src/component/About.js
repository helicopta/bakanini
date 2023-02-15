import React from 'react';
import {Col, Row } from 'reactstrap'
import {Link} from 'react-router-dom'

import './About.css'
function About (){
    return(
        <div id ='self-intro'>
            <p id ='self-text'>Hi I'm Danni, a developer/designer.<br></br>
             I enjoy bringing 3D experience to web.</p>
             <Row className = 'link-icon'>
                <Col sm = {{size: '2', offset:4}} className = 'icon-container'><a href='https://github.com/bakanini'><img alt ='' src ={require('../assets/images/GitHub-Mark-Light-64px.png')}/></a></Col>
                <Col sm = {{size: '2'}} className = 'icon-container'><a href='https://www.linkedin.com/in/danni-wang-626b73111'><img alt ='' src ={require('../assets/images/Linkedin-Mark-Light-64px.png')}/></a></Col>
             </Row>
        </div>
        
    )
}

export default About;