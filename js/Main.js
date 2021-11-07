renderer = null;
scene = null;  // play(main scene)
mouse_location = new THREE.Vector2(); // mouse location vector

// render function
function render()
{
	requestAnimationFrame(render);

	// update camera position
	if (scene.getCameraControls().enabled)
		scene.getCameraControls().update();

	// drawing scene
	renderer.clear();
	renderer.render(scene, scene.getCamera());

	// drawing object if necessary
	if (scene.getShowViewer())  // play.showViewerObject
	{
		var view = scene.getViewer();  // play.getViewerObjects

		view.getCameraControls().update();
		renderer.clearDepth();
		renderer.render(view, view.getCamera());
	}

	// update Animation
	TWEEN.update();
}

/** create basic renderer */
function createRenderer()
{
	var renderer = new THREE.WebGLRenderer();
	renderer.autoClear = false;
	renderer.setClearColor(new THREE.Color(0x000000), 1.0);
	renderer.setSize(window.innerWidth, window.innerHeight);
	return renderer;
}

/** resize window size */
function onWindowResize()
{
	// allocate new width and height
	scene.setCameraAspect(window.innerWidth / window.innerHeight);

	if (scene.getShowViewer())  // play.showViewerObject
		scene.getViewer().setCameraAspect(window.innerWidth / window.innerHeight);  // play.getViewerObjects.setCameraAspect

	renderer.setSize(window.innerWidth, window.innerHeight);
}

/** mouse event functions */
function onMouseDown(event)
{
	mouse_location.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse_location.y = 1 - 2 * (event.clientY / window.innerHeight);
}

function onMouseUp(event)
{
	var location = new THREE.Vector2();  // mouse
	location.x = (event.clientX / window.innerWidth) * 2 - 1;
	location.y = 1 - 2 * (event.clientY / window.innerHeight);  // load new position of mouse

	// check if it is click or drag
	if (location.x == mouse_location.x && location.y == mouse_location.y)
	{
		scene.getCameraControls().onMouseUp(event);
		scene.interact(location);
	}
}

function onMouseDownDialog(event)
{
	if (scene.getCurrentMode() === Scene.Mode.DIALOG)  // getCurrentMode == Mode.Dialog
		scene.passDialog();  // pass dialog
}

/** main code */
$(function(){
	// Create renderer
	renderer = createRenderer();

	// add renderer to HTML code
	$("#WebGL-output").append(renderer.domElement);

	// configure resize window event function
	window.addEventListener("resize", onWindowResize);

	// configure mouse event function
	document.getElementById("WebGL-output").addEventListener("mousedown", onMouseDown);
	document.getElementById("WebGL-output").addEventListener("mouseup", onMouseUp);

	// create scene
	scene = new Scene(renderer.domElement);

	// initial rendering
	render();

	// remove loading scene after finishing initialization
	var manager = THREE.DefaultLoadingManager;
	manager.onLoad = function()
	{
		$("#loading").fadeOut(400);
	}

	// hide pre-load data
	$("#features").hide();

	// initial dialog
	scene.initialDialog([
		"나: 아... 머리가 핑핑 도는데...",
		"나: 뭐야, 대체 이 방은 어디지? 내 방은 아닌데?",
		"어제 친구들과 밤새 진탕 마신 것까지는 기억 나는데, 정신 차려보니 여기다.",
		"방을 샅샅이 찾아보면 나갈 수 있는 방법이 있을 것이다.",
		"하지만 방이 너무 어둡다. 방의 전등을 킬 수 있는 방법부터 찾아보자.",
		"(한숨)"
	]);
});
