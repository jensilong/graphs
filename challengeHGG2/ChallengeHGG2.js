function createCylinder(n, len, rad, isCappedBottom, isCappedTop) {
    if (isCappedBottom === undefined) isCappedBottom = false;
    if (isCappedTop === undefined) isCappedTop = false;
    var len2 = len / 2;
    var geom = new THREE.Geometry();
    // push 2*n + 2 vertices
    var inc = 2 * Math.PI / n;
    for (var i = 0, a = 0; i <= n; i++, a += inc) {
        var cos = Math.cos(a);
        var sin = Math.sin(a);
        bottomVertex = new THREE.Vector3(rad * cos, -len2, rad * sin);
        topVertex = new THREE.Vector3(rad * cos, len2, rad * sin);
        geom.vertices.push(bottomVertex, topVertex);
    }
    // push 2*n side faces (each of the n rectangular side faces
    // is constructed from 2 triangles)
    for (var i = 0; i < 2*n; i += 2) {
        geom.faces.push(new THREE.Face3(i, i+1, i+2));
        geom.faces.push(new THREE.Face3(i+1, i+2, i+3));
    }
    // push n-2 bottom faces
    //   fan of triangles based at vertex 0
    if (isCappedBottom) {
        for (var i = 2; i < 2*n; i += 2) {
           geom.faces.push(new THREE.Face3(0, i, i+2));
        }
    }
    // push n-2 top faces
    //   fan of triangles based at vertex 1
    if (isCappedTop) {
        for (var i = 2; i < 2*n; i += 2) {
            geom.faces.push(new THREE.Face3(1, i+1, i+3));
        }
    }

    geom.computeFaceNormals();
    return geom;
}

//CAMERA

var camera = new THREE.PerspectiveCamera(90, window.innerWidth/ window.innerHeight, 0.001, 10000);
camera.position.set(3, 3, 13);

//SCENE
var scene = new THREE.Scene();

scene.add(camera);

//LIGHTS
var light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(-3,-2,18);
scene.add(light);

//GEOMETRY
var cylinder = createCylinder(12,6,2,true);

var material = new THREE.MeshLambertMaterial({
    color: 'blue',
    side: THREE.DoubleSide
});

var mesh = new THREE.Mesh(cylinder, material);

scene.add(mesh);


//RENDER
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

var SPEED = 0.01;

mesh.rotation.y = 2;

function rotateCube() {
     mesh.rotation.z -= SPEED * 3;
}



function render() {
    requestAnimationFrame(render);
    rotateCube();
    renderer.render(scene, camera);
}

render();