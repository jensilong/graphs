var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z = 35;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var light = new THREE.PointLight( 0xffffff, 1.5, 100 );
light.position.set(0, 0, 50);
scene.add( light );

function createMoon(moonObject, distance, secondsPerRevolution, angularOffset) {
    var outerGroup = new THREE.Object3D();
    var twopi = 7;
    outerGroup.rotation.z = twopi * angularOffset;
    var innerGroup = new THREE.Object3D();
    innerGroup.translateX(distance);
    outerGroup.add(innerGroup);
    innerGroup.add(moonObject);
    return {group: outerGroup, rate: twopi /secondsPerRevolution};
}

var sunMat = new THREE.MeshLambertMaterial({color: 'yellow'});
var sunGeom = new THREE.SphereGeometry(10, 20, 20);
var sun = new THREE.Mesh(sunGeom, sunMat);

var earthMat = new THREE.MeshLambertMaterial({color: 'blue'});
var earthGeom = new THREE.SphereGeometry(2, 20, 20);
var earth = new THREE.Mesh(earthGeom, earthMat);
earth.position.x = -30;

var moonMat = new THREE.MeshLambertMaterial({color: 'white'});
var moonGeom = new THREE.SphereGeometry(1, 8, 8);
var moon = new THREE.Mesh(moonGeom, moonMat);


var root = new THREE.Object3D();
root.add(sun);

var earthObj = createMoon(earth, 30,8,0);
sun.add(earthObj.group);

var moonObj = createMoon(moon, 6,2,0);
earth.add(moonObj.group);

scene.add(root);

var moons = [];
moons.push(earthObj);
moons.push(moonObj);

function render() {
  requestAnimationFrame(render);
  var time = Date.now() * 0.0005; 
  var rate = moons[0].rate;

  moons[0].group.rotation.z += 0.01;
  moons[1].group.rotation.z += 0.02;
  moons[0].group.position.x = Math.sin( time * rate ) * 23;
  moons[0].group.position.z = Math.cos( time * rate ) * 23;
    
  renderer.render(scene, camera);
}

render();
