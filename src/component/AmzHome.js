import React from 'react';
import {Row, Col} from 'reactstrap';

import './ProjectHome.css'

function AmzHome(){
	return(
		<Row>
			<Col>
				<div id="projectName">A-mazing</div>
				<p id="projectBrief">An small 3D shooting game</p>
			</Col>
			<Col className="projectImg" id="amz"></Col>
		</Row>
	)
}

export default AmzHome;