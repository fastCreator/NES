var container = document.getElementById('canvas');
// scene size
var WIDTH = container.clientWidth;
var HEIGHT = container.clientHeight;
var myId = $('.hiddenmyID').val();
// camera
var VIEW_ANGLE = 45;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 1;
var FAR = 500;
var start = true;
var hasLight = true;
var camera, scene, renderer, raycaster;

var mouse = new THREE.Vector2(), INTERSECTED;

var cameraControls;

var mainLight;

var verticalMirror, groundMirror;
var sphereGroup, smallSphere;

function init() {
    raycaster = new THREE.Raycaster();
    // renderer

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(0, 75, 160);

    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 40, 0);
    cameraControls.maxDistance = 400;
    cameraControls.minDistance = 10;
    cameraControls.update();

    container.appendChild(renderer.domElement);

    container.addEventListener('click', onDocumentMouseClick, false);

}

function onDocumentMouseClick(event) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

}

function fillScene() {
    //加载小球
    var sphereGeometry = new THREE.SphereGeometry(8, 50, 50);
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 100, 0);
    sphere.name = "sphere";
    scene.add(sphere);
    //加载obj

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function (xhr) {
    };


    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

    var loader = new THREE.OBJMTLLoader();
    loader.load('/images/shops/' + myId + '_obj.obj', '/images/shops/' + myId + '_mtl.mtl', function (object) {

        object.position.y = 0;
        scene.add(object);

    }, onProgress, onError);


    //加载其他
    var planeGeo = new THREE.PlaneBufferGeometry(100.1, 100.1);

    // MIRROR planes
    groundMirror = new THREE.Mirror(renderer, camera, { clipBias: 0.003, textureWidth: WIDTH, textureHeight: HEIGHT, color: 0x777777 });

    var mirrorMesh = new THREE.Mesh(planeGeo, groundMirror.material);
    mirrorMesh.add(groundMirror);
    mirrorMesh.rotateX(-Math.PI / 2);
    scene.add(mirrorMesh);

    verticalMirror = new THREE.Mirror(renderer, camera, { clipBias: 0.003, textureWidth: WIDTH, textureHeight: HEIGHT, color: 0x889999 });

    var verticalMirrorMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(60, 60), verticalMirror.material);
    verticalMirrorMesh.add(verticalMirror);
    verticalMirrorMesh.position.y = 35;
    verticalMirrorMesh.position.z = -45;
    scene.add(verticalMirrorMesh);

    sphereGroup = new THREE.Object3D();
    scene.add(sphereGroup);

    var geometry = new THREE.CylinderGeometry(0.1, 15 * Math.cos(Math.PI / 180 * 30), 0.1, 24, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0x444444 });
    var sphereCap = new THREE.Mesh(geometry, material);
    sphereCap.position.y = -15 * Math.sin(Math.PI / 180 * 30) - 0.05;
    sphereCap.rotateX(-Math.PI);

    var geometry = new THREE.SphereGeometry(15, 24, 24, Math.PI / 2, Math.PI * 2, 0, Math.PI / 180 * 120);


    // walls
    var planeTop = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0xffffff }));
    planeTop.position.y = 100;
    planeTop.rotateX(Math.PI / 2);
    scene.add(planeTop);

    var planeBack = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0xffffff }));
    planeBack.position.z = -50;
    planeBack.position.y = 50;
    scene.add(planeBack);

    var planeFront = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0x7f7fff }));
    planeFront.position.z = 50;
    planeFront.position.y = 50;
    planeFront.rotateY(Math.PI);
    scene.add(planeFront);

    var planeRight = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
    planeRight.position.x = 50;
    planeRight.position.y = 50;
    planeRight.rotateY(-Math.PI / 2);
    scene.add(planeRight);

    var planeLeft = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0xff0000 }));
    planeLeft.position.x = -50;
    planeLeft.position.y = 50;
    planeLeft.rotateY(Math.PI / 2);
    scene.add(planeLeft);

    // lights
//    var light = new THREE.AmbientLight(0xFFFFFF);
//    scene.add(light);

    mainLight = new THREE.PointLight(0xcccccc, 2.0, 250);
    mainLight.position.y = 45;
    scene.add(mainLight);

    var light = new THREE.DirectionalLight(0xFFFFFF);

    light.position.set(0, 50, 1);

    scene.add(light);

    light = new THREE.DirectionalLight(0xFFFFFF);

    light.position.set(0, 20, 20);

    scene.add(light);

    var greenLight = new THREE.PointLight(0x00ff00, 0.25, 1000);
    greenLight.position.set(550, 50, 0);
    scene.add(greenLight);

    var redLight = new THREE.PointLight(0xff0000, 0.25, 1000);
    redLight.position.set(-550, 50, 0);
    scene.add(redLight);

    var blueLight = new THREE.PointLight(0x7f7fff, 0.25, 1000);
    blueLight.position.set(0, 50, 550);
    scene.add(blueLight);

}

function render() {

    // render (update) the mirrors
    groundMirror.renderWithMirror(verticalMirror);
    verticalMirror.renderWithMirror(groundMirror);
    // find intersections

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[ 0 ].object) {
            if (intersects[ 0 ].object.name == "sphere") {
                if (hasLight) {
                    intersects[ 0 ].object.material.color = {r: 1, g: 1, b: 1};
                    mouse.x = null;
                    mouse.y = null;
                    mainLight.intensity = 2.0;
                    hasLight = false;
                }
                else {
                    intersects[ 0 ].object.material.color = {r: 0, g: 0, b: 0};
                    mainLight.intensity = 0.7;
                    mouse.x = null;
                    mouse.y = null;
                    hasLight = true;
                }
            }
        }

    } else {

        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

        INTERSECTED = null;

    }
    //
    renderer.render(scene, camera);

}

function update() {
    if (start) {
        requestAnimationFrame(update);


        cameraControls.update();

        render();
    }
}
function stop() {
    $(window).bind('click', function (e) {
        if (e.target.tagName != 'CANVAS') {
            start = false;
            document.getElementById("canvas").removeChild(renderer.domElement);
            $(window).unbind('click');
        }
    })
}

function init1() {
    $('#canvas').css('height', $(window).height() + "px")
    $('html,body').animate({scrollTop: $('#canvas').offset().top}, 800);
    stop();
    init();
    fillScene();
    update();
}

init1();