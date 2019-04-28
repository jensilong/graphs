var scene = new THREE.Scene();

let container = document.getElementById('container'), 
    loader = new THREE.TextureLoader(), 
    renderer, 
    camera,
    maxParticles = 2000,
    firstLayerSpeed = 0.008,
    secondLayerSpeed = 0.015,
    thirdLayerSpeed = 0.030,
    fourthLayerSpeed = 0.045,
    radius = 10,
    sphereGeometry, 
    sphere,
    sphereGeometry2,
    sphere2,
    sphereGeometry3,
    sphere3,
    sphereGeometry4,
    sphere4,
    guiControls; 
  

function init() {

    let vw = window.innerWidth, 
        vh = window.innerHeight;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(vw, vh);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera = new THREE.PerspectiveCamera(45, vw / vh, 1, 1000);
    camera.position.z = 200;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.lookAt(scene.position);
    scene.add(camera);
    
    let controls = new THREE.OrbitControls(camera, renderer.domElement);

    guiControls = new function() {
                
                this.radius = 10;
                this.firstLayerSpeed = 0.008;
                this.secondLayerSpeed = 0.015;
                this.thirdLayerSpeed = 0.030;
                this.fourthLayerSpeed = 0.045;
                this.numberOfParticles = 2000;
            
                this.redraw = function() {
                   
                    scene.remove(sphere);
                    scene.remove(sphere2);
                    scene.remove(sphere3);
                    scene.remove(sphere4);
                    
                    draw();
                  
                };

                this.update = function() {
                    this.redraw();
                };
                
            };
    
    var gui = new dat.GUI();
            gui.add(guiControls, 'radius' , 5, 15);
            gui.add(guiControls, 'firstLayerSpeed', 0, 2);
            gui.add(guiControls, 'secondLayerSpeed', 0, 2);
            gui.add(guiControls, 'thirdLayerSpeed', 0, 2);
            gui.add(guiControls, 'fourthLayerSpeed', 0, 2);
            gui.add(guiControls, 'numberOfParticles', 0, 2000);
            gui.add(guiControls, 'update').name('update');
           
    container.appendChild(renderer.domElement);

}

function onResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);    

}


function draw() {
  
  radius = guiControls.radius;
  firstLayerSpeed = guiControls.firstLayerSpeed;
  secondLayerSpeed = guiControls.secondLayerSpeed;
  thirdLayerSpeed = guiControls.thirdLayerSpeed;
  fourthLayerSpeed = guiControls.fourthLayerSpeed;
  
  // Sun (spotlight).
  var sun = new THREE.SphereGeometry(1, 50, 50);
  var sunLight = new THREE.PointLight(0xffffff, 0.5, 100); 
  sunLight.position.set(0, 0, 0); 
  sunLight.castShadow = true; 
  sunLight.shadowMapWidth = 1024; 
  sunLight.shadowMapHeight = 1024; 
  sunLight.shadowCameraNear = 500; 
  sunLight.shadowCameraFar = 4000;
  sunLight.add(new THREE.Mesh(sun, new THREE.MeshBasicMaterial({ color: 0xffa500 })));
  sunLight.shadowCameraFov = 30;
  scene.add(sunLight);

  loader.crossOrigin = true;

    let particleTexture = loader.load('https://threejs.org/examples/textures/particle2.png'), 
        material = new THREE.PointsMaterial({
            color: 0xffffff, 
            size: 1.2, 
            transparent: true, 
            blending: THREE.AdditiveBlending, 
            map: particleTexture, 
            depthWrite: false
        });
        
        var fibonacciDistance = [1,2,3,5];
        
        sphereGeometry = createStars(fibonacciDistance[0]);
  
        sphere = new THREE.Points(sphereGeometry, material);
        scene.add(sphere);
        
        sphereGeometry2 = createStars(fibonacciDistance[1]);
  
        sphere2 = new THREE.Points(sphereGeometry2, material);
        scene.add(sphere2);
        
        sphereGeometry3 = createStars(fibonacciDistance[2]);
  
        sphere3 = new THREE.Points(sphereGeometry3, material);
        scene.add(sphere3);
        
        sphereGeometry4 = createStars(fibonacciDistance[3]);
  
        sphere4 = new THREE.Points(sphereGeometry4, material);
        scene.add(sphere4);
        
}

function createStars(fibonacciDistance){

    var sphereGeometry = new THREE.Geometry();
    
    maxParticles = guiControls.numberOfParticles;
    
       for ( let i = 0; i < maxParticles; i++ ) {
            
            var theta = Math.random() * 2.0* Math.PI;
            var phi = Math.random() * Math.PI;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);
            var x = radius * fibonacciDistance * sinPhi * cosTheta;
            var y = radius * fibonacciDistance *  sinPhi * sinTheta;
            var z = radius * fibonacciDistance * cosPhi;
            
            vertex = new THREE.Vector3(x, y , z );  

            vertex.rotationAxis = new THREE.Vector3(0, 0.5, 0);
            vertex.rotationAxis.normalize();
            sphereGeometry.vertices.push(vertex);

        }
    
    return sphereGeometry;
}

function update() {
    
   
    for( var i = 0 ; i < maxParticles; i++){
      
        let particle = sphereGeometry.vertices[i];
        
        particle.applyAxisAngle(particle.rotationAxis, firstLayerSpeed);
       
        let particle2 = sphereGeometry2.vertices[i];
        
        particle2.applyAxisAngle(particle2.rotationAxis, secondLayerSpeed);
        
        let particle3 = sphereGeometry3.vertices[i];
        
        particle3.applyAxisAngle(particle3.rotationAxis, thirdLayerSpeed);
        
        let particle4 = sphereGeometry4.vertices[i];
        
        particle4.applyAxisAngle(particle4.rotationAxis, fourthLayerSpeed);
        
            
    }
    
    sphere.geometry.verticesNeedUpdate = true;
    sphere2.geometry.verticesNeedUpdate = true;
    sphere3.geometry.verticesNeedUpdate = true;
    sphere4.geometry.verticesNeedUpdate = true;

}

function render() {
    update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);

}

init();
draw();
render();