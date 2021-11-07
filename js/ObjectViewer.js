/**
 * work with visualizer
 * 
 * @param {Object3D} visualizer visualizer object
 * @param {Number} distance_camera_object 카메라와 물체 사이의 거리
 */
ObjectViewer = function(renderer, model, distance = 20)
{
    THREE.Scene.call(this);

	var camera = null;
	var orbitControls = null;
    var object = model;

    /**
	 * create camera
	 * 
	 * @param {*} self 
	 * @param {Renderer} renderer show image and user eventhandler renderer
	 */
	var createCamera = function(self, renderer)
	{
		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000000);
		camera.position.set(0, 0, distance);
		var look = new THREE.Vector3(0, 0, 0);
		camera.lookAt(look);

		orbitControls = new THREE.OrbitControls(camera, renderer, false);
		orbitControls.rotateSpeed = 0.4;
		orbitControls.zoomSpeed = -2;
		orbitControls.panSpeed = 0.5;
		orbitControls.target = look;
		orbitControls.maxZoom = 0;
		orbitControls.enableZoom = false;
		orbitControls.enablePan = false;
	};

    var createLight = function(self)
    {
        ambientLight = new THREE.AmbientLight(0x282828);
		pointLight = new THREE.PointLight(0xffffff, 1, 400, 1);
		pointLight.position.set(50, 50, 50);
		self.add(ambientLight);
		self.add(pointLight);
    }

    var init = function(self, renderer)
	{
		createCamera(self, renderer);
        createLight(self);
		self.add(object);
	};

	this.getCamera = function()
	{
		return camera;
	};

	this.getCameraControls = function()
	{
		return orbitControls;
	};

	/** 
	 * define view aspect
	 * 
	 * @param {Número} aspect 가로 세로 비율, 0과 1 사이
	 */
	this.setCameraAspect = function(aspect)
	{
		camera.aspect = aspect;
		camera.updateProjectionMatrix();
	};

    init(this, renderer);
}

ObjectViewer.prototype = Object.create(THREE.Scene.prototype);
ObjectViewer.prototype.constructor = ObjectViewer;