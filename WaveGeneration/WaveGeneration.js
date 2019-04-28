var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();

var squares;
var projector = new THREE.Projector();
var theSelectedSquares = [];
var theObjects = [];
var canvasWidth, canvasHeight;

var m = 60, n = 60;
var offset = 2.4;
var waveRate = 8.0;
//var curWave = null;
var waveLimit = 30;

var plainColor = null;
var nbrColors = 201;
var colors;

var raycaster = new THREE.Raycaster();

var controls = new function() {
               
                this.radius = 10;
                this.radialSegments = 3;
                this.tubularSegments = 16;
                this.arc = 2 * Math.PI;
                this.wireframe = false;

                this.redraw = function() {
                    // remove the old plane
                    scene.remove(torus);
                    // create a new one
                    torus = createTorus(controls);
                    // add it to the scene.
                    scene.add(torus);
                };

                this.go = function() {
                    this.redraw();
                };
};


function squareGeom() {
    var geom = new THREE.Geometry();
    var vertices = [new THREE.Vector3(1, 1, 0), new THREE.Vector3(1, -1, 0),
        new THREE.Vector3(-1, -1, 0), new THREE.Vector3(-1, 1, 0)];
    for (var i = 0; i < vertices.length; i++)
        geom.vertices.push(vertices[i]);
    var faces = [[0, 1, 3], [3, 1, 2]];
    var normal = new THREE.Vector3(0, 0, 1);
    for (var i = 0; i < faces.length; i++)
        geom.faces.push(new THREE.Face3(faces[i][0], faces[i][1], faces[i][2], normal));
    return geom;
}

function createMatrixOfSquares(m, n, offset) {
    // fit into 10x10 square
    var root = new THREE.Object3D();
    root.scale.x = 10 / m*offset;
    root.scale.y = 10 / n*offset;

    // array of square meshes
    squares = new Array(m);
    for (var i = 0; i < m; i++) {
        squares[i] = new Array(n);
    }

    offset = offset !== undefined ? offset : 2.0;
    var geom = squareGeom();
    var xMin = -offset * ((m-1) / 2.0);
    var yMin = -offset * ((n-1) / 2.0);
    var mn = m * n;
    for (var i = 0, x = xMin; i < m; i++, x += offset) {
        for (var j = 0, y = yMin; j < n; j++, y += offset) {
            var mat = new THREE.MeshBasicMaterial({color: plainColor, shading: THREE.FlatShading, side: THREE.DoubleSide});
            var square = new THREE.Mesh(geom, mat);
            square.position.x = x;
            square.position.y = y;
            square.i = i;
            square.j = j;
            root.add(square);
            theObjects.push(square);
            squares[i][j] = square;
        }
    }
    scene.add(root);
}

var maxHeight = 1.5;
var minHeight = -1.5;
var heightRange = maxHeight - minHeight;

function heightFunction(delta, dist) {
        return maxHeight * Math.sin(0.5*delta);
}

function colorFunction(ht, delta, dist) {
    var colorIndex = Math.floor(((ht - minHeight) / heightRange) * nbrColors);
    return colors[colorIndex];
} 


function updateSquares(selectedSquareObj) {
    var changed = false;
    for (var i = 0; i < theObjects.length; i++) {
        var obj = theObjects[i];
        dist = distance(selectedSquareObj.object, obj);
        delta = selectedSquareObj.curWave - dist;
        if (delta > waveLimit) {
            obj.position.z = 0;
            obj.material.color = plainColor;
        } else if (delta > 0) {
            var ht = heightFunction(delta, dist);
            obj.position.z = ht;
            obj.material.color = colorFunction(ht, delta, dist);
            changed = true;
        }
    }
    if (!changed) {
        selectedSquareObj.curWave = null;
        selectedSquareObj.object.material.color = plainColor;
        selectedSquareObj.object = null;
        initializeColors();
    }
}

function distance(sq1, sq2) {
    dx = sq1.i - sq2.i;
    dy = sq1.j - sq2.j;
    return Math.sqrt(dx*dx + dy*dy);
}


function createScene() {
    initializeColors();
    var matrixOfSquares = createMatrixOfSquares(m, n, offset);
    scene.add(matrixOfSquares);
}

function initializeColors() {
    if (nbrColors % 2 == 0) {
        nbrColors++;
    }
    colors = new Array(nbrColors);    
    nbrColors2 = (nbrColors - 1) / 2;
    var hues = [Math.random(), Math.random()];
    for (var j = 0; j < nbrColors2; j++) {
        var sat = 1 - j/nbrColors2;
        colors[j] = new THREE.Color().setHSL(hues[0], sat, 0.5);
        colors[nbrColors-j-1] = new THREE.Color().setHSL(hues[1], sat, 0.5);
    }
    plainColor = colors[nbrColors2] = new THREE.Color().setHSL(0, 0, 0.5);
}


function onDocumentMouseDown(event) {
    var mouse = new THREE.Vector2(
        2*(event.clientX/canvasWidth)-1,
        1-2*(event.clientY/canvasHeight));
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(theObjects);
    if ((intersects.length > 0)) {
      
      for(var i = 0 ; i < intersects.length ; i++){
        var theSelectedSquare = intersects[i].object;
        theSelectedSquare.material.color = new THREE.Color(0xff0000);
        var curWave = 0;
        
        var selectedSquareObj = {};
        selectedSquareObj.object = theSelectedSquare;
        selectedSquareObj.curWave = curWave;
        
        theSelectedSquares.push(selectedSquareObj);
      }
        
    }
}

document.addEventListener('mousedown', onDocumentMouseDown, false);


function animate() {
    window.requestAnimationFrame(animate);
    render();
}


function render() {
    var delta = clock.getDelta();
    if (theSelectedSquares) {
        
        for(var i = 0 ; i < theSelectedSquares.length ; i++){
            
            var selectedSquareObj = theSelectedSquares[i];
            var curwave = selectedSquareObj.curWave;
            curwave += (waveRate * delta);
            selectedSquareObj.curWave = curwave;
            updateSquares(selectedSquareObj);
        }
    
    }

    cameraControls.update(delta);
    renderer.render(scene, camera);
}


function init() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 1.0);

    camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
    camera.position.set(0, -40, 30);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
}


function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length>0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild( renderer.domElement );
}

    init();
    createScene();
    addToDOM();
    render();
    animate();

