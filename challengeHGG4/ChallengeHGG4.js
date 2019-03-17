// Create scene
var scene = new THREE.Scene();

// Create Perspective Camera
var camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1500);
camera.position.set(0, 4, 8);

function createKnottedCylinder(n, heights, scales, isCappedBottom, isCappedTop) {
    if (isCappedBottom === undefined) isCappedBottom = false;
    if (isCappedTop === undefined) isCappedTop = false;

    var geom = new THREE.Geometry();
    // push 2*n + 1 vertices per segment boundary
    var inc = 2 * Math.PI / n;
    var nbrSegments = heights.length - 1;
    for (var s = 0 ; s <= nbrSegments;  s++) {
        var ht = heights[s];
        var scale = scales[s];

        for (var i = 0, a = 0; i <= n; i++, a += inc) {
            var cos = Math.cos(a);
            var sin = Math.sin(a);
            var v = new THREE.Vector3(scale * cos, ht, scale * sin);
            geom.vertices.push(v);
        }
    }

    // push 2*n side faces for each segment
    for (var s = 0, b = 0; s < nbrSegments; s++, b += n + 1) {
        for (var i = b; i < b + n; i++) {
            geom.faces.push(new THREE.Face3(i, n+1 + i, i+1));
            geom.faces.push(new THREE.Face3(n+1 + i , i+1, n+2+i));

        }

    }

    if (isCappedBottom) {
        for (var i = 2; i < 2*n; i += 2) {
            geom.faces.push(new THREE.Face3(0, i, i+2));
        }
    }

    if (isCappedTop) {
        for (var i = 2; i < 2*n; i += 2) {
            geom.faces.push(new THREE.Face3(1, i+1, i+3));
        }
    }


    //Set colors for each segment
    var colors = [
        new THREE.Color("red"),
        new THREE.Color("green"),
        new THREE.Color("blue"),
        new THREE.Color("yellow"),
        new THREE.Color("cyan"),
        new THREE.Color("magenta")
    ]

    var facesPerSegmentThreshold = 2 * n;
    var facesPerSegmentThresholdInc = facesPerSegmentThreshold;
    var counter = 0;
    var index = 0;

    geom.faces.forEach(function (face) {

            //Choose a color randomly from colors array for each face's vertex
            if(counter == 0 || (facesPerSegmentThresholdInc/counter == 1)) {
                index = Math.floor(Math.random() * 6);
                if(counter > 0) {
                    facesPerSegmentThresholdInc = facesPerSegmentThresholdInc + facesPerSegmentThreshold;
                }
            }

            face.vertexColors.push(colors);
            face.vertexColors[0] = colors[index];
            face.vertexColors[1] = colors[index];
            face.vertexColors[2] = colors[index];

            counter++;

        });

    geom.computeFaceNormals();

    return geom;

}


//LIGHTS
var light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(-2,5,15);
scene.add(light);

var heights = [0.0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2, 3.6, 4.0, 4.1, 4.2, 4.3, 4.3];
var scales = [1.8, 1.95, 2.0, 1.95, 1.8, 1.5, 1.2, 1.05, 1.0, 1.05, 1.15, 1.25, 1.35, 1.45, 1.5];
var n = 12;

var geometry = createKnottedCylinder(n,heights, scales,true);

var material = new THREE.MeshLambertMaterial({side:THREE.DoubleSide, vertexColors: THREE.VertexColors});
var cylinder = new THREE.Mesh(geometry, material);
scene.add( cylinder);



var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

var SPEED = 0.01;


function rotateCube() {
    cylinder.rotation.x -= SPEED * 3;
}


function render() {
    requestAnimationFrame(render);
    rotateCube();
    renderer.render(scene, camera);
}

render();



