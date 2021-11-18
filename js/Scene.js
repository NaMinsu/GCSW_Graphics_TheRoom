Scene = function(renderer)
{
	THREE.Scene.call(this);

	// private variables
	var camera = null;
	var orbitControls = null;

	var stage = null;  // stage
	var currenetMode = Scene.Mode.TUTORIAL;  // current mode
	var objectCheck = null;  // object examining
	var InitalCameraPosition = null;  // initial camera position

	var interactionActivate = true;  // interaction activated

	// create player inventory
	var inventory = new Inventory();

	// create object viewer
	var viewer = null;
	var showViewer = false;  // showViewer
	var pendingView = null;  // pendingView

	// create dialog manager
	var previousMode;  // previousMode
	var dialog = new Dialog();  // dialog

	/**
	 * create camera
	 * 
	 * @param {*} self 
	 * @param {Renderer} renderer 이미지 표시 및 사용자 입력을 받는 renderer
	 */
	var createCamera = function(self, renderer)
	{
		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000000);
		camera.position.set(0, 50, 1);
		var look = new THREE.Vector3(0, 50, 0);
		camera.lookAt(look);

		orbitControls = new THREE.OrbitControls(camera, renderer);
		orbitControls.rotateSpeed = 0.4;
		orbitControls.zoomSpeed = -2;
		orbitControls.panSpeed = 0.5;
		orbitControls.target = look;
		orbitControls.maxZoom = 0;
		orbitControls.enableZoom = false;
		orbitControls.enablePan = false;
	};

	/** create scene */
	var createStage = function(self)  // createLevel
	{
        var stage = new Stage(self);  // create stage object
        return stage;
	};

	var init = function(self, renderer)
	{
		createCamera(self, renderer);
		stage = createStage(self);
		self.add(stage);
	};

	// public method
	/** getCamera */
	this.getCamera = function()
	{
		return camera;
	};

	/** getCameraControls */
	this.getCameraControls = function()
	{
		return orbitControls;
	};

	/** 
	 * Define the aspect ratio
	 * 
	 * @param {Numeric} aspect Aspect ratio, between 0 and 1
	 */
	this.setCameraAspect = function(aspect)
	{
		camera.aspect = aspect;
		camera.updateProjectionMatrix();
	};

	/**
	 * select object under the mouse cursor
	 * to interaction method
	 * 
	 * @param {Vector2} mouse location
	 */
	this.interact = function(mouse)  // interaction
	{
		if (interactionActivate)  // if interaction is activated
		{
			var raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(mouse, camera);

		    selectedObject = raycaster.intersectObjects(stage.objects.children, true);
            console.log("selectedObject" ,selectedObject)
			if (selectedObject.length > 0)
			{
				/**
				 * find selected object
				 * if object is subobject, find by object tree
				 */ 
				var object = selectedObject[0].object;
                console.log("object ", object)
				while (object.parent !== stage && !('objectInteract' in object.userData))
				{
					object = object.parent;
				}
                console.log("object 2", object.userData)
				if ('objectInteract' in object.userData)
				{
					while (object !== null 
						&& (object.userData.objectParent !== objectCheck
							&& object.userData.objectInteract !== objectCheck))
					{
						object = object.userData.objectParent;
					}

					if (objectCheck == null 
						|| (object !== null && (object.userData.objectParent == objectCheck
							|| object.userData.objectInteract === objectCheck)))
					{
						// object interaction with item
						var delete_flag = object.userData.objectInteract.interact(currenetMode, inventory.objectSelected());
                        console.log(delete_flag)
						if (delete_flag)
							inventory.deleteItem(inventory.objectSelected());
					}
				}
			}
		}
	}

	/**
	 * move camera to selected object if it is specific object
	 * 
	 * @param {ObjectCheck} object can make camera move
	 */
	this.objectCheck = function(object)
	{
		if (objectCheck === null)
		{
			// save current camera position
			InitalCameraPosition = {
				position: {
					x: camera.position.x,
					y: camera.position.y,
					z: camera.position.z
				},
				rotation: {
					x: camera.rotation.x,
					y: camera.rotation.y,
					z: camera.rotation.z
				}
			};
		}

		// disable control
		orbitControls.enabled = false;
		interactionActivate = false;

		var pointCameraInital = {
			x: camera.position.x,
			y: camera.position.y,
			z: camera.position.z,

			rx: camera.rotation.x,
			ry: camera.rotation.y,
			rz: camera.rotation.z
		};

		var pointCamera = object.getCameraPoint();

		var posFinal = new THREE.Vector3();
		posFinal.setFromMatrixPosition(pointCamera.matrixWorld);
		var rotFinal = new THREE.Euler();
		rotFinal.setFromRotationMatrix(pointCamera.matrixWorld);
		var pointCameraFinal = {
			x: posFinal.x,
			y: posFinal.y,
			z: posFinal.z,

			rx: rotFinal.x,
			ry: rotFinal.y,
			rz: rotFinal.z
		};

		var timeInterpolation = 1000;

		this.interpolationCamera = new TWEEN.Tween(pointCameraInital).to(pointCameraFinal, timeInterpolation)
			.onUpdate(function(){
				camera.position.set(pointCameraInital.x, pointCameraInital.y, pointCameraInital.z);
				camera.rotation.set(pointCameraInital.rx, pointCameraInital.ry, pointCameraInital.rz);
			})
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onComplete(function(){
				interactionActivate = true;

				currenetMode = Scene.Mode.EXAMINATION;
				objectCheck = object;

				// fade-in 돌아가기 button
				$("#object-crop").fadeIn(400);
			})
			.start();
	}

	this.Exit = function()
	{
		if (interactionActivate)
		{
			// disabel control
			interactionActivate = false;

			var pointCameraInital = {
				x: camera.position.x,
				y: camera.position.y,
				z: camera.position.z,

				rx: camera.rotation.x,
				ry: camera.rotation.y,
				rz: camera.rotation.z
			};

			var pointCameraFinal = {
				x: InitalCameraPosition.position.x,
				y: InitalCameraPosition.position.y,
				z: InitalCameraPosition.position.z,

				rx: InitalCameraPosition.rotation.x,
				ry: InitalCameraPosition.rotation.y,
				rz: InitalCameraPosition.rotation.z
			};

			var timeInterpolation = 1000;

			this.interpolationCamera = new TWEEN.Tween(pointCameraInital).to(pointCameraFinal, timeInterpolation)
				.onUpdate(function(){
					camera.position.set(pointCameraInital.x, pointCameraInital.y, pointCameraInital.z);
					camera.rotation.set(pointCameraInital.rx, pointCameraInital.ry, pointCameraInital.rz);
				})
				.easing(TWEEN.Easing.Quadratic.InOut)
				.onComplete(function(){
					// Activate interaction
					orbitControls.enabled = true;
					interactionActivate = true;

					currenetMode = Scene.Mode.INVESTIGATION;
					objectCheck = null;
				})
				.start();

			// fade-out 돌아가기 button
			$("#object-crop").fadeOut(400);
		}
	}

	// inventory
	/**
	 * Add item to inventory
	 * 
	 * @param {InventoryObject} item to add
	 */
	this.getNewItem = function(object)
	{
		inventory.getNewItem(object);
		this.InventoryUpdate();
	};

	/**
	 * delete item from inventory
	 * 
	 * @param {ObjectInventory} item to delete
	 */
	this.deleteItem = function(object)
	{
		inventory.deleteItem(object);
		this.InventoryUpdate();
	};

	this.selectNext = function()
	{
		inventory.selectNext();
		this.InventoryUpdate();
	}

	this.selectPrev = function()
	{
		inventory.selectPrev();
		this.InventoryUpdate();
	}

	/**
	 * update inventory interface
	 */
	this.InventoryUpdate = function()
	{
		if (inventory.itemListEmpty())
			$("#inventory").fadeOut(400);
		else
			document.getElementById("object-selected").src = inventory.objectSelected().getImage();
	};

	/**
	 * return showViewer
	 */
	this.getShowViewer = function()
	{
		return showViewer
	}

	/**
	 * return viewer
	 */
	this.getViewer = function()
	{
		return viewer;
	}

	/**
	 * activate object viewer
	 */
	this.ObjectVisualize = function(object, distacne = 20)
	{
		if (currenetMode !== Scene.Mode.DIALOG)
		{
			viewer = new ObjectViewer(renderer, object, distacne);
			showViewer = true;

			// disable control
			interactionActivate = false;
			orbitControls.enabled = false;

			$("#accept-button").fadeIn(400);

			if (currenetMode == Scene.Mode.EXAMINATION)
				$("#object-crop").fadeOut(400);

			$("#inventory").fadeOut(400);
		}
		else
			pendingView = {object: object, distacne: distacne};
	}

	/**
	 * inactivate object viewer
	 */
	this.hideViewerObject = function()
	{
		viewer = null;
		showViewer = false;

		// activate control
		orbitControls.enabled = currenetMode == Scene.Mode.INVESTIGATION;
		interactionActivate = true;

		$("#accept-button").fadeOut(400);

		if (currenetMode == Scene.Mode.EXAMINATION)
			$("#object-crop").fadeIn(400);

		if (!inventory.itemListEmpty())
			$("#inventory").fadeIn(400);
	}

	// dialog manager
	/**
	 * initiate dialog
	 * 
	 * @param {Array} Array of dialog strings
	 */
	this.initialDialog = function(text)
	{
		if (currenetMode !== Scene.Mode.DIALOG)
		{
			// fade-out game interface
			$("#object-crop").fadeOut(400);
			$("#inventory").fadeOut(400);

			// change dialog mode
			previousMode = currenetMode;
			currenetMode = Scene.Mode.DIALOG;

			// disable control
			interactionActivate = false;
			orbitControls.enabled = false;

			// start dialog
			dialog.createDialog(text);
			document.getElementById("text-dialog").innerHTML = dialog.text();

			// enable dialog interface
			$("#darkness").fadeIn(400);
			$("#dialog").fadeIn(400);
		}
	}

	/**
	 * show final dialog
	 * 
	 * @param {Array} Array of final dialog
	 */
	this.initialDialogFinal = function(text)
	{
		this.initialDialog(text);
		previousMode = Scene.Mode.FIN;
	}

	/**
	 * move next dialog
	 */
	this.passDialog = function()
	{
		if (currenetMode === Scene.Mode.DIALOG)
		{
			var fin = dialog.passText();

			if (fin)
			{
				// change previous mode
				currenetMode = previousMode;

				if (currenetMode === Scene.Mode.FIN)
				{
					this.terminateScene();
				}
				else
				{
					// activate interaction
					orbitControls.enabled = currenetMode == Scene.Mode.INVESTIGATION || currenetMode == Scene.Mode.TUTORIAL;
					interactionActivate = true;

					// fade-out dialog interface
					$("#darkness").fadeOut(400);
					$("#dialog").fadeOut(400);

					if (pendingView === null)
					{
						// fade-in game interfacae
						if (currenetMode == Scene.Mode.EXAMINATION)
							$("#object-crop").fadeIn(400);
						
						if (!inventory.itemListEmpty())
							$("#inventory").fadeIn(400);
					}

					// visualize object
					if (pendingView !== null)
					{
						this.ObjectVisualize(pendingView.object, pendingView.distance);
						pendingView = null;
					}
				}
			}
			else
			{
				document.getElementById("text-dialog").innerHTML = dialog.text();
			}
		}
	}

	/**
	 * load fin scene
	 */
	this.terminateScene = function()
	{
		$("#fin").fadeIn(400);
	}

	/**
	 * return current mode
	 */
	this.getCurrentMode = function()
	{
		return currenetMode;
	}

	/**
	 * terminate tutorial mode
	 */
	this.terminateTutorial = function()
	{
		currenetMode = Scene.Mode.INVESTIGATION;
	}

	init(this, renderer);
};

Scene.prototype = Object.create(THREE.Scene.prototype);
Scene.prototype.constructor = Scene;


Scene.Mode = {
	INVESTIGATION : 0,
	EXAMINATION : 1,
	DIALOG : 2,
	TUTORIAL : 3, // Init
	FIN : 4
}
