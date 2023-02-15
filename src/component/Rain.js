import React, { Component } from "react";
import * as THREE from "three";

class Rain extends Component {
  componentDidMount() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    // scene.fog = new THREE.FogExp2(0xffffee, 0.002);
    renderer.setClearColor(0xffffff);
    this.mount.appendChild( renderer.domElement );

    //Lighting
    var ambient = new THREE.AmbientLight(0xdddddd,0.5);
    scene.add(ambient);
    var directionalLight= new THREE.DirectionalLight(0xffeedd,1);
    directionalLight.position.set(0,0,5);
    scene.add(directionalLight);
    
    //Geometry
    var rainGeo = new THREE.Geometry();
    for(var i=0;i<80;i++){
        var rainDrop = new THREE.Vector3(Math.random()*500-250,Math.random()*500-250,-Math.random()*200);
        // rainDrop.velocity = {};
        rainDrop.velocity = 0;
        rainGeo.vertices.push(rainDrop);
    }
    var rainMat = new THREE.PointsMaterial({
        color:0x00aa55,
        size:2,
        transparent:true
    })
    var rain = new THREE.Points(rainGeo,rainMat);
    scene.add( rain );
    
    //Camera
    camera.position.z = 15;

    //Animation
    var animate = function () {
      rainGeo.vertices.forEach(p=>{
        p.velocity=0.5;
        p.x+=p.velocity;
        p.y+=p.velocity*Math.sin(p.x*0.05);        
       
        if(p.x>200 || p.y>200){
    
          p.x=Math.random()*500-350;
          p.y=Math.random()*500-250;
        
        }
        
      });
      rainGeo.verticesNeedUpdate = true;
      //rain.rotation.y+=0.002;

        
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
    };
    animate();
  }
  render() {
    return (
      <div ref={ref => (this.mount = ref)} />
    )
  }
}
export default Rain;