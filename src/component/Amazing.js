import React, { Component } from "react";
import * as THREE from "three";

import * as TWEEN from 'tween';

import { PointerLockControls } from '../../node_modules/three/examples/jsm/controls/PointerLockControls.js';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';

class Amazing extends Component {
  constructor(props){
    super(props);
    this.state = {score:0,
                  dir:Math.floor(Math.random()*2)
                  };
    this.initScene=this.initScene.bind(this);
    this.addMaze=this.addMaze.bind(this);
    this.addSphere=this.addSphere.bind(this);
    this.animate=this.animate.bind(this);
    this.onMouseDown=this.onMouseDown.bind(this);
    this.cameraWalking=this.cameraWalking.bind(this);
    this.collisionCheck=this.collisionCheck.bind(this);
    this.cameraRotate=this.cameraRotate.bind(this);
  };
  componentDidMount() {
    this.initScene();
    this.addMaze();
    this.addSphere();
    this.animate();
    
  }

  initScene(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 50000 );
    
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.controls = new OrbitControls(this.camera,this.renderer.domElement);
    var axesHelper = new THREE.AxesHelper( 5 );
    this.scene.add( axesHelper );

    this.mount.appendChild(this.renderer.domElement );

    //Lighting
    var ambient = new THREE.AmbientLight(0xdddddd,0.5);
    this.scene.add(ambient);
    var domeLight = new THREE.HemisphereLight( 0xeeeeff, 0x777700, 1 );
    domeLight.position.set( 0, 40, 0 );
    this.scene.add( domeLight );
    this.mouse = new THREE.Vector2();
    this.rayCaster = new THREE.Raycaster();
    this.selected=null;

    //window.addEventListener('mousemove',this.onMouseMove, false);
    window.addEventListener('mousedown',this.onMouseDown, false);
  }

  onMouseDown(event){
    event.preventDefault();    
    if(event.clientX<=window.innerWidth/2){
      this.setState({dir:'left'});
      var l = 0;
      var speed = Math.PI/16;
          while(l<Math.PI/2){
            this.camera.rotateOnWorldAxis(this.camera.up,speed);
            l+=speed;
            this.camera.updateProjectionMatrix();
          }
      
    }
    else if(event.clientX>window.innerWidth/2){
      this.setState({dir:'right'});
      this.camera.rotateOnWorldAxis(this.camera.up,-Math.PI/2);
    }
  }

  collisionCheck(){
    var direction = this.camera.getWorldDirection(new THREE.Vector3());
    this.rayCaster.setFromCamera(direction,this.camera);
    var intersect = this.rayCaster.intersectObjects(this.scene.children,true)[0];
    if(intersect){            
      if(intersect.distance<2){
        if(intersect.object.geometry.type==='BoxBufferGeometry'){
          return true;
        }
        else if(intersect.object.geometry.type==='PlaneBufferGeometry'){
          console.log('game over')
        }
        else if(intersect.object.geometry.type==='SphereBufferGeometry'){
          console.log('balls')
          this.setState((state, props) => ({
            score: state.score + 1
          }));
          intersect.object.geometry.dispose();
          intersect.object.material.dispose();
          this.scene.remove( intersect.object );
          this.addSphere();
        }
      }      
    }
    return false;
  }
  cameraRotate(){
    var sw=this.collisionCheck();
    if(sw){
      
      this.tween = new TWEEN.Tween(this.camera.rotation) // Create a new tween that modifies 'coords'.
      .to({ y: "-" + Math.PI}, 500)
      .to({ z: "-" + Math.PI}, 500) // Move to (300, 200) in 1 second.
      .onComplete(function(){
        console.log('done')
      })
      .start();  
    }
  }

  addMaze(){
    //paras
    this.cellSize = 10;
    this.gridSize = 6;
    this.wallHeight = 5;
    this.wallThickness=this.cellSize*0.01;
    //ground and ceiling plane
    this.boxArr=[];
    for(var c=0;c<2;c++){
      var geometry = new THREE.PlaneBufferGeometry(this.cellSize*this.gridSize,this.cellSize*this.gridSize, 32 );
      geometry.rotateX((c-1/2)* Math.PI);
      var material = new THREE.MeshStandardMaterial({roughness:0.07,metalness:0.5,color:0x00ffff});
      var plane = new THREE.Mesh( geometry, material );
      plane.translateY(this.wallHeight*(c-1/2));
      this.scene.add( plane );

    }
    //wall plane    
    for(var w = 0;w<4;w++){
      var wallGeo = new THREE.PlaneBufferGeometry(this.cellSize*this.gridSize,this.wallHeight);
      var wallMtl = new THREE.MeshStandardMaterial({roughness:0.07,metalness:0.5});    
      var wall = new THREE.Mesh( wallGeo,wallMtl);
      wall.translateX(-this.cellSize*this.gridSize/2*Math.sin(Math.PI*w/2));
      wall.translateZ(this.cellSize*this.gridSize/2*Math.cos(Math.PI*w/2));
      wall.rotateY(Math.PI*(1-w/2));
      wall.material.color= new THREE.Color(0x330000*Math.random()*0.25);
      this.scene.add(wall);
    }
    //cubes 
    for(var i=0;i<this.gridSize;i++){
      for(var j=0;j<this.gridSize;j++){
        var boxMaterial = new THREE.MeshStandardMaterial({
                                                          transparent:true,
                                                          opacity:1,
                                                          roughness:0.07,
                                                          metalness:0.1,                                                          
                                                          });
        var boxGeometry = new THREE.BoxBufferGeometry(this.cellSize,this.wallHeight,this.wallThickness);  
        boxGeometry.rotateY(-Math.PI/2*Math.round(Math.random()));
        boxMaterial.color= new THREE.Color(0x66ffff*0.75);      
        var box = new THREE.Mesh(boxGeometry,boxMaterial);
        box.position.x = -this.cellSize*(this.gridSize/2-j-0.5);
        
        box.position.z = -this.cellSize*(this.gridSize/2-i-0.5);
        this.scene.add(box);
        this.boxArr.push(box);
      }
      this.camera.position.x=(Math.floor((Math.random()-0.5)*this.gridSize)+0.5)*this.cellSize;
      //this.camera.position.y= this.wallHeight/2;
      this.camera.position.z=(Math.floor((Math.random()-0.5)*this.gridSize)+0.5)*this.cellSize;
    }    
    this.camera.up.set(0,1,0);
    
  }
  addSphere(){
    //sphere
    var sphereGeometry = new THREE.SphereBufferGeometry(0.5,64,64);
    var sphereMaterial = new THREE.MeshStandardMaterial({
                                                        roughness:0.07,
                                                        metalness:0.5,
                                                        color:0xffff00});
    var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
    this.scene.add(sphere);
    sphere.position.x=(Math.round((Math.random()-0.5)*this.gridSize))*this.cellSize;
    sphere.position.z=(Math.round((Math.random()-0.5)*this.gridSize))*this.cellSize;
    //sphere.addEventListener('mousemove',this.onMouseMove, false)
    console.log('add ball')
  }
  
  cameraWalking(){   
    this.camera.position.addScaledVector(this.camera.getWorldDirection(new THREE.Vector3()),0.02);
  }
  
  animate() {
    this.cameraWalking();
    this.cameraRotate();
    TWEEN.default.update(); 
    this.renderer.render(this.scene,this.camera);
    this.requestID = window.requestAnimationFrame(this.animate);
  }

  render(){
    return (
      <div>
        <div>{this.state.score}</div>
        <div ref={ref => (this.mount = ref)} />
      </div>
    )
  }
}
export default Amazing;


