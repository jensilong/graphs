
function createStep(y, z, riser, tread, width) {

    var width2 = width / 2;
    var geom = new THREE.Geometry();
    var vertices = [new THREE.Vector3(width2, y, z), new THREE.Vector3(-width2, y, z),
        new THREE.Vector3(width2, riser + y , z), new THREE.Vector3(-width2, riser + y, z),
        new THREE.Vector3(width2, riser + y , z - tread), new THREE.Vector3(-width2, riser + y , z - tread)];

    for (var i = 0; i < vertices.length; i++)
        geom.vertices.push(vertices[i]);

    var faces = [[1, 0, 2], [1, 2, 3], [3, 2, 4], [3, 4, 5]];

    var normals = [new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0)];

    for (var i = 0; i < faces.length; i++)
        geom.faces.push(new THREE.Face3(faces[i][0], faces[i][1], faces[i][2], normals[Math.floor(i/2)]));

    geom.computeFaceNormals();
    return geom;
}


//CAMERA

var camera = new THREE.PerspectiveCamera(85, window.innerWidth/ window.innerHeight, 0.001, 10000);
camera.position.set(5, 7, 10);

//SCENE
var scene = new THREE.Scene();

scene.add(camera);

//LIGHTS
var light = new THREE.AmbientLight(0xffffff,0.5);
scene.add(light);

var light2 = new THREE.PointLight(0xffffff,0.5);
scene.add(light2);

function createStairs(riser,tread,width,nbrSteps) {

    var step = null;
    var y = 0;
    var z = 0;
    var steps = [];

    var material = new THREE.MeshLambertMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide
    });

    for (var i = 0; i < nbrSteps; i++) {

        if (step != null) {
            y = step.vertices[4].y;
            z = step.vertices[4].z;
        }

        step = createStep(y, z, riser, tread, width);
        var mesh = new THREE.Mesh(step, material);
        steps.push(mesh);

    }

    return steps;
}


var stairs = createStairs(1,2,4,5);

stairs.forEach(function(step){
   scene.add(step);
});


//RENDER
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

renderer.render(scene, camera);

var SPEED = 0.01;

function rotateCube() {
   // mesh.rotation.x -= SPEED * 2;

    stairs.forEach(function(step){
        step.rotation.y -= SPEED;
        console.log(step.rotation.y);
    });
   // mesh.rotation.y -= SPEED;
   // mesh.rotation.z -= SPEED * 3;
}



function render() {
    requestAnimationFrame(render);
    //rotateCube();
    renderer.render(scene, camera);
}

render();