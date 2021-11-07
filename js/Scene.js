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
	this.setCameraAspect = function(aspecto)
	{
		camera.aspect = aspecto;
		camera.updateProjectionMatrix();
	};

	/**
	 * select object undet the mouse cursor
	 * to interaction method
	 * 
	 * @param {Vector2} mouse location
	 */
	this.interact = function(raton)  // interaction
	{
		if (interactionActivate)  // if interaction is activated
		{
			var raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(raton, camera);

		    selectedObject = raycaster.intersectObjects(stage.objects.children, true);
            console.log("selectedObject" ,selectedObject)
			// Seleccionar el más cercano
			if (selectedObject.length > 0)
			{
				/**
				 * Subir en el árbol hasta encontrar el ObjetoInteractuable correspondiente:
				 * un objeto de primer nivel si el jugador no está examinando nada,
				 * un subobjeto del objeto que está examinando,
				 * o el propio objeto que está examinando
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
						// Llamar a su método de interacción
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
	 * Mueve la cámara al puntoCamara del ObjetoExaminable proporcionado
	 * También entra en modo examinando
	 * 
	 * @param {ObjectCheck} El objeto al que acercar la cámara
	 */
	this.objectCheck = function(object)
	{
		if (objectCheck === null)
		{
			// Almacenar la posición actual de la cámara
			InitalCameraPosition = {
				posicion: {
					x: camera.position.x,
					y: camera.position.y,
					z: camera.position.z
				},
				rotacion: {
					x: camera.rotation.x,
					y: camera.rotation.y,
					z: camera.rotation.z
				}
			};
		}

		// Desactivar controles
		orbitControls.enabled = false;
		interactionActivate = false;

		// Interpolar 
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

				currenetMode = Scene.Mode.EXAMINANDO;
				objectCheck = object;

				// Mostrar botón para salir
				$("#object-crop").fadeIn(400);
			})
			.start();
	}

	this.Exit = function()
	{
		if (interactionActivate)
		{
			// Desactivar controles
			interactionActivate = false;

			// Interpolar 
			var pointCameraInital = {
				x: camera.position.x,
				y: camera.position.y,
				z: camera.position.z,

				rx: camera.rotation.x,
				ry: camera.rotation.y,
				rz: camera.rotation.z
			};

			var pointCameraFinal = {
				x: InitalCameraPosition.posicion.x,
				y: InitalCameraPosition.posicion.y,
				z: InitalCameraPosition.posicion.z,

				rx: InitalCameraPosition.rotacion.x,
				ry: InitalCameraPosition.rotacion.y,
				rz: InitalCameraPosition.rotacion.z
			};

			var timeInterpolation = 1000;

			this.interpolationCamera = new TWEEN.Tween(pointCameraInital).to(pointCameraFinal, timeInterpolation)
				.onUpdate(function(){
					camera.position.set(pointCameraInital.x, pointCameraInital.y, pointCameraInital.z);
					camera.rotation.set(pointCameraInital.rx, pointCameraInital.ry, pointCameraInital.rz);
				})
				.easing(TWEEN.Easing.Quadratic.InOut)
				.onComplete(function(){
					// Activar interaccion
					orbitControls.enabled = true;
					interactionActivate = true;

					currenetMode = Scene.Mode.INVESTIGANDO;
					objectCheck = null;
				})
				.start();

			// Ocultar botón para salir
			$("#object-crop").fadeOut(400);
		}
	}

	// inventory
	/**
	 * Añade un objeto al inventory del jugador
	 * 
	 * @param {InventoryObject} El objeto a añadir
	 */
	this.getNewItem = function(object)
	{
		inventory.getNewItem(object);
		this.InventoryUpdate();
	};

	/**
	 * Eliminar un objeto del inventory del jugador
	 * 
	 * @param {ObjectInventory} El objeto a eliminar
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
	 * Actualizar los elementos de la interfaz
	 */
	this.InventoryUpdate = function()
	{
		if (inventory.itemListEmpty())
			$("#inventory").fadeOut(400);
		else
			document.getElementById("object-selected").src = inventory.objectSelected().getImage();
	};

	/**
	 * Devuelve si es necesario mostrar el visor de objetos
	 */
	this.getShowViewer = function()
	{
		return showViewer
	}

	/**
	 * Devuelve el visor de objetos activo
	 */
	this.getViewer = function()
	{
		return viewer;
	}

	/**
	 * Activa el visor de objetos para un objeto
	 */
	this.ObjectVisualize = function(object, distacne = 20)
	{
		if (currenetMode !== Scene.Mode.DIALOG)
		{
			viewer = new ObjectViewer(renderer, object, distacne);
			showViewer = true;

			// Desactivar control
			interactionActivate = false;
			orbitControls.enabled = false;

			$("#accept-button").fadeIn(400);

			if (currenetMode == Scene.Mode.EXAMINANDO)
				$("#object-crop").fadeOut(400);

			$("#inventory").fadeOut(400);
		}
		else
			pendingView = {object: object, distacne: distacne};
	}

	/**
	 * Desactiva el visor de objetos
	 */
	this.hideViewerObject = function()
	{
		viewer = null;
		showViewer = false;

		// Activar control
		orbitControls.enabled = currenetMode == Scene.Mode.INVESTIGANDO;
		interactionActivate = true;

		$("#accept-button").fadeOut(400);

		if (currenetMode == Scene.Mode.EXAMINANDO)
			$("#object-crop").fadeIn(400);

		if (!inventory.itemListEmpty())
			$("#inventory").fadeIn(400);
	}

	// Gestor de diálogos
	/**
	 * Inicia un diálogo
	 * 
	 * @param {Array} Array con las líneas del diálogo
	 */
	this.initialDialog = function(text)
	{
		if (currenetMode !== Scene.Mode.DIALOG)
		{
			// Ocultar otros elementos
			$("#object-crop").fadeOut(400);
			$("#inventory").fadeOut(400);

			// Cambiar a modo diálogo
			previousMode = currenetMode;
			currenetMode = Scene.Mode.DIALOG;

			// Desactivar los controles
			interactionActivate = false;
			orbitControls.enabled = false;

			// Iniciar el diálogo
			dialog.createDialog(text);
			document.getElementById("text-dialog").innerHTML = dialog.text();

			// Mostrar la interfaz
			$("#darkness").fadeIn(400);
			$("#dialog").fadeIn(400);
		}
	}

	/**
	 * Inicia un diálogo que finalizará el Scene
	 * 
	 * @param {Array} Array con las líneas del diálogo
	 */
	this.initialDialogFinal = function(text)
	{
		this.initialDialog(text);
		previousMode = Scene.Mode.FIN;
	}

	/**
	 * Avanza el diálogo a la siguiente línea
	 */
	this.passDialog = function()
	{
		if (currenetMode === Scene.Mode.DIALOG)
		{
			var fin = dialog.passText();

			if (fin)
			{
				// Cambiar al modo anterior
				currenetMode = previousMode;

				if (currenetMode === Scene.Mode.FIN)
				{
					this.terminateScene();
				}
				else
				{
					// Activar la interacción
					orbitControls.enabled = currenetMode == Scene.Mode.INVESTIGANDO || currenetMode == Scene.Mode.TUTORIAL;
					interactionActivate = true;

					// Ocultar el diálogo
					$("#darkness").fadeOut(400);
					$("#dialog").fadeOut(400);

					if (pendingView === null)
					{
						// Mostrar el botón de salir si es necesario
						if (currenetMode == Scene.Mode.EXAMINANDO)
							$("#object-crop").fadeIn(400);
						
						// Mostrar el inventory si es necesario
						if (!inventory.itemListEmpty())
							$("#inventory").fadeIn(400);
					}

					// Visualizar objeto pendiente
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
	 * Muestra una pantalla de fin
	 */
	this.terminateScene = function()
	{
		$("#fin").fadeIn(400);
	}

	/**
	 * Devuelve el modo actual
	 */
	this.getCurrentMode = function()
	{
		return currenetMode;
	}

	/**
	 * Terminar tutorial
	 */
	this.terminateTutorial = function()
	{
		currenetMode = Scene.Mode.INVESTIGANDO;
	}

	init(this, renderer);
};

Scene.prototype = Object.create(THREE.Scene.prototype);
Scene.prototype.constructor = Scene;


Scene.Mode = {
	INVESTIGANDO : 0,
	EXAMINANDO : 1,
	DIALOG : 2,
	TUTORIAL : 3, // Init
	FIN : 4
}
