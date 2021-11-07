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
		"Tú: Agh.... Ay... Todo me da vueltas... con el ratón...",
		"Tú: ¿Se puede saber en qué clase de habitación mal diseñada estoy?",
		"Tras una noche de desenfreno y borrachera (con Nestea), he aparecido aquí.",
		"Estoy seguro de que si investigo encontraré la forma de salir... ",
		"No obstante, esto está muy oscuro como para ver nada. Me pregunto si habrá alguna forma de encender las luces...",
		"(SARCASMO)"
	]);
});
