import React, { Component } from 'react';
import './Home.css';

import Header from './Header';
import HomeScene from './HomeScene';
import LoadingScene from './LoadingScene';
import About from './About';

class Home extends Component{
  constructor(){
    super();
    this.state = {
      loaded:false,
      cameraPos:[],
      isAbout:false,
    }
  }
  
  
  handleLoading = (v)=>{
    this.setState({loaded:v});
  }
  handleAbout = (e) =>{
    var camPos = [-721,-700,36];
    if(!this.state.isAbout){
      this.setState(prevState =>({ cameraPos: camPos,isAbout:!prevState.isAbout,}));
    }
    else{
      this.setState(prevState =>({ cameraPos:[],isAbout:!prevState.isAbout,}));
    }
  }

  render(){
    const {cameraPos, isAbout} = this.state;
    return(
      <div className="Home">
        <Header handleAbout = {this.handleAbout} isAbout = {isAbout}/>
        <div className="outer-wrapper">
            <LoadingScene/>
            <HomeScene cameraPos={cameraPos}/>
            {isAbout? <About /> : null}    
        </div>
        
      </div>
    )
  }
}

export default Home;
