import React, { Component } from "react";
import * as THREE from "three";


import OrbitControls from 'three-orbitcontrols';

import {EffectComposer} from '../../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from '../../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import {ClearPass} from '../../node_modules/three/examples/jsm/postprocessing/ClearPass.js';
import {ShaderPass} from '../../node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import {UnrealBloomPass} from '../../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';

import {GLTFLoader} from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';



class HomeScene extends Component {
  constructor(props){
    super(props);
    this.state = {
      cameraLookAt:[-450,-100,50],
      cameraPosition:[-780,-550,130],
      camera: new THREE.PerspectiveCamera( 30, window.innerWidth/window.innerHeight, 1, 100000 ),
    }
  }

  componentDidMount(){
    console.log('scene', this.props.cameraPos)
    this.initScene();
  }

  initScene = () =>{
    //loading screen
    var loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = function(item, loaded, total){
      document.getElementById( 'loading' ).innerHTML =  Math.trunc(loaded/total*100) +' %';
    }
    loadingManager.onLoad = function(){
      document.getElementById( 'loading' ).innerHTML= 'LOADED';
      setTimeout(function(){
        document.getElementById( 'loading-wrapper' ).remove();
      },1500);
      
    }

    //init
    var envCenter = new THREE.Vector3(-450,-100,50);
    var envRadius = 3000;
    var scene = new THREE.Scene();
    var camera = this.state.camera;
    //Camera
    camera.position.set(...this.state.cameraPosition);
    camera.up.set(0,0,1 );
   
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.gammaOutput = true;
    scene.fog = new THREE.FogExp2(0x001010, 0.0001);
    // renderer.setClearColor(scene.fog.color);
    var scene2 = new THREE.Scene();
    scene2.fog = new THREE.FogExp2(0x000508, 0.00025);
    this.mount.appendChild( renderer.domElement );

    //Lighting
    var ambient = new THREE.AmbientLight(0x566778,0.007);
    scene.add(ambient);

    //Geometry
    var envSphere = new THREE.SphereBufferGeometry( envRadius, 32, 32 );
    envSphere.scale( - 1, 1, 1 );
    var sphereTexture = new THREE.TextureLoader().load( './3d_scene/universe.jpg' );
    var sphereMaterial = new THREE.MeshBasicMaterial( { map: sphereTexture } );
    var sphereMesh = new THREE.Mesh( envSphere, sphereMaterial );
    sphereMesh.position.set(-450,-100,50);
    scene2.add( sphereMesh );
    
    // const loader = new THREE.TextureLoader();
    // var textArr = {};
    // for(let i = 1;i<=6;i++){
    //   var screenTexture = loader.load(`./3d_scene/screen${i}.jpg`);
    //   textArr[`screen${i}`] = screenTexture;
    // }
  
    //gltf loader
    var gltfLoader = new GLTFLoader(loadingManager);
    gltfLoader.load("./3d_scene/0803.gltf",function(gltf){
      var test = gltf.scene;
      scene.add(test);
      animate();
    })
    
    //bloom
    var params = {
      exposure:1.2,
      bloomStrength:0.8,
      bloomThreshold:0.1,
      bloomRadius:1,
    }
    let clearPass = new ClearPass();
    var renderPass1 = new RenderPass( scene, camera );
    var renderPass2 = new RenderPass( scene2, camera );
    renderPass1.clear = false;
    renderPass2.clear = false;
    var bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    var composer = new EffectComposer( renderer );
    composer.setSize( window.innerWidth, window.innerHeight );

    let outputPass = new ShaderPass(
      new THREE.ShaderMaterial( {
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: composer.renderTarget2.texture }
        },
        vertexShader: document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        defines: {}
      } ), "baseTexture"
    );
    outputPass.renderToScreen = true
      
    composer.addPass(clearPass)
    composer.addPass(renderPass1)
    composer.addPass(bloomPass)  
    composer.addPass(renderPass2)
    composer.addPass(outputPass)
    
    //window setup
    window.onresize = function () {
      var width = window.innerWidth;
      var height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize( width, height );
      composer.setSize( width, height );
    };
  
    //Control
    var controls = new OrbitControls(camera,renderer.domElement);
    controls.minDistance = 50;
		controls.maxDistance = envRadius;
    controls.screenSpacePanning = true;    
    
    //raycaster

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'click', onMouseUp, false );

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var INTERSECTED = null;
    var CLICKED = false;
    var toLookAt = envCenter.clone();

    function onMouseMove( event ) {
      event.preventDefault();
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }
    function onMouseUp( event ) {
      event.preventDefault();
      CLICKED = true;
    }
    
    // var mouseHover = function(){
    //   var intersects = raycaster.intersectObjects( scene.children[1].children );
    //   if ( intersects.length > 0 ) {
    //     var current = intersects[0].object;
    //       if(!INTERSECTED){
    //         if(current.name.search('screen')>=0){
    //           INTERSECTED = current;
    //           INTERSECTED.currentTex = INTERSECTED.material.map;
    //           INTERSECTED.material.map = textArr[current.name];
    //           INTERSECTED.material.emissiveMap = textArr[current.name];
    //         }
    //       }
    //       else{
    //         if(INTERSECTED.name!==current.name && current.name.search('screen')>=0){
    //           INTERSECTED.material.map = INTERSECTED.currentTex;
    //           INTERSECTED.material.emissiveMap = INTERSECTED.currentTex;
    //           INTERSECTED= current;
    //           INTERSECTED.currentTex = INTERSECTED.material.map;
    //           INTERSECTED.material.map = textArr[current.name];
    //           INTERSECTED.material.emissiveMap = textArr[current.name];
    //         } 
    //         else if(current.name.search('screen')<0){
    //           INTERSECTED.material.map = INTERSECTED.currentTex;
    //           INTERSECTED.material.emissiveMap = INTERSECTED.currentTex;
    //           INTERSECTED = null;
    //         } 
    //       }  
    //   }
    // }

    var cameraMove = ()=>{
      var intersects = raycaster.intersectObjects( scene.children[1].children );
      if ( intersects.length > 0 ) {
        var current = intersects[0].object;
        if(CLICKED && current.name.search('screen')>=0){
          camera.position.set(current.position.x,current.position.y-100,current.position.z);
          camera.rotation.set(current.rotation)
          camera.lookAt(current.position.x,current.position.y-20,current.position.z)
          toLookAt = current.position;
          
        }
      }
      CLICKED = false;
    }
    //Animation
    var animate = function () { 
      requestAnimationFrame( animate );
      raycaster.setFromCamera( mouse, camera );
      // mouseHover();
      cameraMove();
      camera.lookAt(toLookAt);
      composer.render();
    };
    
  }

  render() {
    
    return (
      <div ref={ref => (this.mount = ref)} />
    )
  }
}
export default HomeScene;