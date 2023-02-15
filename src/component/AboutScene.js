import React, { Component } from "react";
import * as THREE from "three";

import OrbitControls from 'three-orbitcontrols';

import {EffectComposer} from '../../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from '../../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import {ClearPass} from '../../node_modules/three/examples/jsm/postprocessing/ClearPass.js';
import {ShaderPass} from '../../node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import {UnrealBloomPass} from '../../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';

import {GLTFLoader} from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from "three";

class AboutScene extends Component {
  
  componentDidMount() {
    
    //init
    var envCenter = new THREE.Vector3(-450,-100,50);
    var envRadius = 3000;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 30, window.innerWidth/window.innerHeight, 0.1, 100000 );
    //Camera
    camera.position.set(-721,-38,63);
    camera.up.set(0,0,1 );
   
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.gammaOutput = true;
    scene.fog = new THREE.FogExp2(0x101010, 0.001);
    // renderer.setClearColor(scene.fog.color);
    var scene2 = new THREE.Scene();
    scene2.fog = new THREE.FogExp2(0x000508, 0.00025);
    this.mount.appendChild( renderer.domElement );
    //Lighting
    var ambient = new THREE.AmbientLight(0x566778,0.007);
    scene.add(ambient);
    
    //gltf loader
    var gltfLoader = new GLTFLoader();
    gltfLoader.load("./3d_scene/enclosure.gltf",function(gltf){
      var test = gltf.scene;
      scene.add(test);
      animate();
    })
    const loader = new THREE.TextureLoader();
    
    //bloom

    var params = {
      exposure:1.2,
      bloomStrength:0.8,
      bloomThreshold:0.1,
      bloomRadius:1,
    }
    let clearPass = new ClearPass();
    var renderPass1 = new RenderPass( scene, camera );
    renderPass1.clear = false;
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

    
    
    //Animation
    var animate = function () {   
      requestAnimationFrame( animate );
      camera.lookAt(envCenter.clone());
      composer.render();
    };

    
  }
  render() {
    return (
      <div ref={ref => (this.mount = ref)} />
    )
  }
}
export default AboutScene;