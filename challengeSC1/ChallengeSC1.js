function createCubeGeometry() {

    var geometry = new THREE.BoxGeometry(10, 10, 10);

    var colors = [
        new THREE.Color("red"),
        new THREE.Color("green"),
        new THREE.Color("blue"),
        new THREE.Color("yellow"),
        new THREE.Color("cyan"),
        new THREE.Color("magenta")
    ]

    geometry.faces.forEach(function(face){

        //Choose a color randomly from colors array for each face's vertex
        var index = Math.floor(Math.random() * 2);
        var index2 = index + 1;
        var index3 = index2 + 1;

        face.vertexColors.push(colors);
        face.vertexColors[0] = colors[index];
        face.vertexColors[1] = colors[index2];
        face.vertexColors[2] = colors[index3];
    });


    return geometry;
}


// Create scene
var scene = new THREE.Scene();

// Create Perspective Camera
var camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1500);
camera.position.set(0, 0, 25);

//Define Material
var material = new THREE.MeshBasicMaterial({
    vertexColors: THREE.VertexColors,
    side: THREE.DoubleSide
});

//Create cube geometry
var geometry = createCubeGeometry();

//Create mesh
var cube = new THREE.Mesh(geometry,material);
cube.rotation.y = 10;
cube.rotation.x = 0.9;

scene.add(cube);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

//Render scene
renderer.render(scene,camera);

