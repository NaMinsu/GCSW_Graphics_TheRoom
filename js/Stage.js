Stage = function(scene)
{
	// super 호출
	THREE.Object3D.call(this);

	// static objects
	var fondo = null; //bottom = 밑바닥

	// interactive objectss
	this.objects = new THREE.Object3D();

	var light; // 빛
	/** create las luces */ //조명 만들기
	var createLights = function(self) //불키는거
	{
		ambientLight = new THREE.AmbientLight(0x161616);
		light = new THREE.PointLight(0xffffff, 0.1, 400, 1);
		light.position.set(50, 45, 30);
		self.add(ambientLight);
		self.add(light);
	};

	/** create los objects decorativos */ //장식품 만들기
	var createRoom = function() //밑바닥 만들기
	{
		var decoration = new THREE.Object3D(); //데코레이션

		var wall= new THREE.BoxGeometry(300, 100, 300); //상자 벽
		var materialWalls = new THREE.MeshLambertMaterial({
			color: 0xffffff
		});
		var walls = new THREE.Mesh(wall, materialWalls); //벽
		walls.material.side = THREE.BackSide;

		walls.translateY(50);
		decoration.add(walls);

		return decoration;
	};
		
	/** Functiones de los objects interactuables */ //상호작용 가능한 객체 함수
	var lightInterrupt = function() //인터럽트 생성
	{
		var lightOn = false; //점화? 불키는건듯
		var functionInterruptor = function(object,mode, selectedObject) //인터럽트 함수
		{
			if (!lightOn)
			{
				// Encender la light y terminar tutorial
				light.intensity = 1;
				object.scene.terminateTutorial();
				lightOn = true;
				object.scene.initialDialog([
					"¡Y se hizo la light!", //와! 불켜짐!
				]);
			}{
				object.scene.initialDialog([
					"Aun a riesgo de que haya algún puzle que use pintura fosforescente, la light se queda encendida.",
					"JAJAJAJAJA. Pintura fosforescente. Como si los desarrolladores supieran hacer eso..."
				]);
			}
		}

		var buttonInterruptor = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 2), //인터럽터 버튼?
											   new THREE.MeshLambertMaterial({color: 0xd1d1d1}));
		var lightInterruptor = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 2), //빛 인터럽터
											new THREE.MeshLambertMaterial({color: 0x000000, emissive: 0xffaa0d}));
		lightInterruptor.position.z = 0.1;
		lightInterruptor.position.y = -3;
		buttonInterruptor.add(lightInterruptor);
		var interruptor = new ObjectInteract(buttonInterruptor, functionInterruptor, scene);
		interruptor.rotation.y = Math.PI;
		interruptor.position.x = 60;
		interruptor.position.y = 50;
		interruptor.position.z = 148;

		return interruptor;
	}

	var createPoster = function() //포스터 생성
	{
		var functionPoster = function(object, mode, objectseleccionado)
		{
			if (mode !== Scene.Mode.TUTORIAL)
			{
				object.scene.initialDialog([
					"Es un poster del universo.", //대충 우주 포스터 설명하는 내용
					"Me encantaría que hubiera unos planetas orbitando alrededor, en este bottom.",
					"Me gustaría tanto, que lo pondría en todos los sitios en los que pudiera.",
					"Como en una página web de noticias de videojuegos o en la web de un hotel.",
					"Por poner ejemplos así al azar."
				]);
			}else{
				object.scene.initialDialog([
					"No sé qué está más oscuro, si esta habitación o el poster."//방과 포스터중 뭐가 더 어두운지 모르겠다는 내용같음
				]);
			}
		}

		var posterTexture = new THREE.TextureLoader(); //충전기 텍스처??
		this.textureImage = posterTexture.load("imgs/fondo.jpg");

		var _Poster = new THREE.Mesh(new THREE.BoxGeometry(70, 45, 0.5),
											   new THREE.MeshLambertMaterial({color: 0xd1d1d1, 
												   map: this.textureImage
												})
											   );
		var pointCamera = new THREE.Object3D(); //카메라 포인트
		pointCamera.position.z = 50;


		var poster = new ObjectCheck(_Poster, functionPoster, pointCamera, scene);

		poster.position.x = -50;
		poster.position.y = 50;
		poster.position.z = -149.5;

		return poster;
	}

	var createDoor = function(keyInventory) // 문 생성
	{
		var modelDoor = new THREE.Object3D(); //문 모델
		var mobilePart = new THREE.Object3D(); //모빌 파트?
		var wood = new THREE.Mesh(new THREE.BoxGeometry(50, 85, 2), //목재
										new THREE.MeshLambertMaterial({color: 0x6c4226}));
		
		var frame1 = new THREE.Mesh(new THREE.BoxGeometry(5, 85, 2), //액자
									new THREE.MeshLambertMaterial({color: 0x4f311c}));
		var frame2 = new THREE.Mesh(new THREE.BoxGeometry(5, 85, 2),
									new THREE.MeshLambertMaterial({color: 0x4f311c}));
		var frame3 = new THREE.Mesh(new THREE.BoxGeometry(60, 5, 2),
									new THREE.MeshLambertMaterial({color: 0x4f311c}));
		var grip = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 2), //손잡이
								  new THREE.MeshLambertMaterial({color: 0xcca00b}));

		wood.position.x = 50/2;

		frame1.position.x = 50/2 + 5/2;
		frame2.position.x = -(50/2 + 5/2);
		frame3.position.y = 85/2 + 5/2;

		grip.rotation.x = Math.PI / 2;
		grip.position.x = 20 + 50/2;
		grip.position.z = 1;

		modelDoor.add(mobilePart);
		mobilePart.add(grip);
		mobilePart.add(wood);
		modelDoor.add(frame1);
		modelDoor.add(frame2);
		modelDoor.add(frame3);

		mobilePart.translateX(-50/2);

		var opened = false; //문 열렸는지 여부

		var functionDoor = function(object, mode, selectedObject) //문 생성
		{

			if(mode !== Scene.Mode.TUTORIAL){ //modo = 방법

				if(object.ActivationObject === selectedObject){ //objectsActivation, objectsSelected
					//Suponiendo que hemos conseguido la key
					if(!opened){
						opened = true;
						var initalRotation = {angle: 0}; //initial rotation
						var FinalRotation = {angle:- Math.PI/2}; //final rotation

						this.interpolater = new TWEEN.Tween(initalRotation).to(FinalRotation, 500)
							.onUpdate(function(){ //삽입이라는데 열쇠 넣는건가봄
								mobilePart.rotation.y = initalRotation.angle;
							})
							.start()

						object.scene.initialDialogFinal([ //엔딩인듯
						"Tú: ¿¡CÓMO!?",
						"Tú: ¡PERO DETRÁS DE LA DOOR HAY MÁS WALL!",
						"Tú: ¿Cómo quieren que salga de algo que no tiene salida?",
						"Y te moriste FIN."
					]);

					}
				}else{
					object.scene.initialDialog([
						"Es una door. Está cerrada.",
						"¿Qué gracia tendría un juego de Escape Room que tuviera la door opened?",
						"Ah, pues ahora que caigo, no son pocos los juegos que dejan la door opened.",
						"...",
						"Mi contradicción no ha dejado a la door DESCOLOCADA.",
						"*badumtss*"
					]);
				}

			}else{
				object.scene.initialDialog([
					"Huy... ¡Casi! Las doors no encienden la light, pero oye, tú a tu ritmo."
				]);
			}
		}
		
		var door = new ObjectInteract(modelDoor, functionDoor, scene, keyInventory);//문
		door.rotation.y = Math.PI;
		door.position.x = 100;
		door.position.y = 85/2;
		door.position.z = 148;

		return door;
	}

	var createSafeBox = function(InventoryCombination) //금고
	{
		var SafeBox = new THREE.Object3D(); //금고 모델
		var door = new THREE.Object3D(); //금고 문
		// 25 20 10
		var bottom = new THREE.Mesh(new THREE.BoxGeometry(25, 20, 2),//밑바닥
								   new THREE.MeshLambertMaterial({color: 0xcfcfcf}));
		var left_wall = new THREE.Mesh(new THREE.BoxGeometry(2, 20, 8),
									  new THREE.MeshLambertMaterial({color: 0xcfcfcf}));//벽 왼쪽
		var right_wall = new THREE.Mesh(new THREE.BoxGeometry(2, 20, 8),
									  new THREE.MeshLambertMaterial({color: 0xcfcfcf}));//얘는 오른쪽인듯
		var top = new THREE.Mesh(new THREE.BoxGeometry(25, 2, 8), //천장
								   new THREE.MeshLambertMaterial({color: 0xcfcfcf}));
		var under = new THREE.Mesh(new THREE.BoxGeometry(25, 2, 8),//땅바닥
								   new THREE.MeshLambertMaterial({color: 0xcfcfcf}));
		var modelDoor = new THREE.Mesh(new THREE.BoxGeometry(21, 16, 2),//문 모델
								  		  new THREE.MeshLambertMaterial({color: 0xe9e9e9}));
		var dial = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 1),//다이얼
								  new THREE.MeshLambertMaterial({color: 0x5c5c5c}));

		bottom.position.z = -10/2 + 1;
		left_wall.position.x = -25/2 + 1;
		right_wall.position.x = 25/2 - 1;
		top.position.y = 20/2 - 1;
		under.position.y = -20/2 + 1;
		modelDoor.position.x = 23/2;
		dial.position.x = 7;
		dial.position.z = 1;
		dial.rotation.x = Math.PI/2;

		modelDoor.add(dial);
		door.add(modelDoor);

		SafeBox.add(bottom);
		SafeBox.add(left_wall);
		SafeBox.add(right_wall);
		SafeBox.add(top);
		SafeBox.add(under);
		SafeBox.add(door);

		door.translateX(-23/2);
		door.translateZ(3);
		
		var opened = false; //금고문 열렸는지 여부
		var functionSafeBox = function(object, mode, selectedObject)
		{
			var throwing = false; //던지다, 떨어트리다?
			if(object.ActivationObject === selectedObject)
			{
				if(!opened){
						opened = true;
						var initalRotation = {angle: 0};
						var FinalRotation = {angle:- Math.PI/2};

						this.interpolater = new TWEEN.Tween(initalRotation).to(FinalRotation, 500)
							.onUpdate(function(){
								door.rotation.y = initalRotation.angle;
							})
							.start()

						
					object.scene.initialDialog([
						"He introducido la combinación de la caja fuerte.",
						"En vista de que no hay papelera, throwingé la combinación al limbo gráfico."
					]);
					throwing = true;
				}
			}
			else
			{
				if(!opened){
					object.scene.initialDialog([
						"Es una caja fuerte. Hace falta una combinación para abrirla.",
						"O también podemos optar por mucha dinamita."
					]);
				}else{
					object.scene.initialDialog([
					"La caja fuerte ha sido abrida.",
					"Me ha apetecido hablar en conjugación no válida."
					]);
				}
			}

			return throwing;
		}

		var _SafeBox = new ObjectInteract(SafeBox, functionSafeBox, scene, InventoryCombination);

		return _SafeBox;
	}

	var createKey = function(keyInventory)//열쇠 생성
	{
		var functionKey = function(object, mode, selectedObject)
		{
			object.scene.initialDialog([
				"He encontrado una key.",
				"Sorprendentemente, se parece a una key.",
				"Aún no me creo lo bien hecha que está la key después de ver la camera.",
				"Me quedo con la key. Pocos días se pueden ver algo tan bello."
			]);
		}

		var ring = new THREE.Mesh( //고리부분
			new THREE.TorusGeometry(1, 0.4, 8, 10),
			new THREE.MeshLambertMaterial({color: 0xf2e437})
		);
		var tube = new THREE.Mesh( //원통부분
			new THREE.CylinderGeometry(0.4, 0.4, 4),
			new THREE.MeshLambertMaterial({color: 0xf2e437})
		);
		var tooth1 = new THREE.Mesh( //열쇠 튀어나온부분 1
			new THREE.CylinderGeometry(0.4, 0.4, 0.5),
			new THREE.MeshLambertMaterial({color: 0xf2e437})
		);
		var tooth2 = new THREE.Mesh( //열쇠 튀어나온부분 2
			new THREE.CylinderGeometry(0.4, 0.4, 0.4),
			new THREE.MeshLambertMaterial({color: 0xf2e437})
		);

		tube.rotation.z = Math.PI / 2;
		tube.position.x = 3.2;

		tooth1.position.y = -0.45;
		tooth1.position.x = 4.6;
		tooth2.position.y = -0.4;
		tooth2.position.x = 3.8;

		ring.add(tube);
		ring.add(tooth1);
		ring.add(tooth2);

		var key = new ObjectRecognition(ring, functionKey, keyInventory, scene);

		return key;
	}

	var createDesk = function(objects, keyInventory, InventoryCombination)//책상 생성
	{
		var functionDesk = function(object, mode, objectseleccionado)
		{
			if(mode !== Scene.Mode.TUTORIAL){ //modo = 방법
				if(objectseleccionado === keyInventory){
					object.scene.initialDialog([
					"Lo de la key del tiempo era una metáfora. No se van a abrir."
					]);
				}else{
					object.scene.initialDialog([
						"Es un desk. Tiene una caja fuerte y cajones que no se abren.",
						"No se abren porque están cerrados con la key de la falta de tiempo."
					]);
				}

			}else{
				object.scene.initialDialog([ //불 안키고 상호작용 할때
					"Eso es un desk, no un interruptor.",
					"Ya sé que no debería ver nada porque está oscuro, pero yo lo veo perfectamente.",
					"Quizás debería usar el desk como fuente de light.",
					"Es broma."
				]);
			}
		}

		var deskMTL = new THREE.MTLLoader(); //충전기 MTL
		deskMTL.setPath("models/Desk/");

		deskMTL.load("Desk.mtl", function(materials)
		{
			materials.preload(); //material
			
			var deskobjects = new THREE.OBJLoader();
			deskobjects.setMaterials(materials);
			deskobjects.setPath("models/Desk/");

			deskobjects.load("Desk.obj", function(modelDesk)
			{
				modelDesk.scale.set(25, 22, 25);

				var pointCamera = new THREE.Object3D(); //카메라포인트
				pointCamera.position.x = -50;
				pointCamera.position.y = 60;
				pointCamera.position.z = 50;
				pointCamera.rotation.y = -Math.PI / 4;

				var desk = new ObjectCheck(modelDesk, functionDesk, pointCamera, scene);//책상
				desk.position.x = 100;
				desk.position.z = -100;
				
				var safeBox = createSafeBox(InventoryCombination);//금고
				safeBox.rotation.y = -Math.PI/2;
				safeBox.position.x = 20;
				safeBox.position.y = 50;
				safeBox.position.z = 30;
				desk.insertChild(safeBox);

				var key = createKey(keyInventory);//열쇠
				key.rotateY(-Math.PI/2);
				key.position.x = 20;
				key.position.y = 43.5;
				key.position.z = 30;
				desk.insertChild(key);

				objects.add(desk);
			});
		});
	}

	var createCombination = function(InventoryCombination)//combination 생성
	{
		var functionCombination = function(object, modo, objectseleccionado)
		{
			object.scene.initialDialog([
				"Es una nota con los números '1031' escritos en ella.",
				"Me pregunto para qué me podrá servir...",
				"SARCASMO: THE RETURN."
			]);
		}

		var imageTexture = new THREE.TextureLoader();
		this.textureImage = imageTexture.load("imgs/1031.png");

		var noteModel = new THREE.Mesh( //노트모델
			new THREE.BoxGeometry(4, 4, 0.01),
			new THREE.MeshLambertMaterial({color: 0xffffff, map:this.textureImage})
		);

		var note = new ObjectRecognition(noteModel, functionCombination, InventoryCombination, scene);
			//노트
		return note;
	}


	var createBed = function(InventoryCombination) //침대생성
	{
		var cameraModel = new THREE.Object3D();

		// 25 20 10
		var camera = new THREE.Mesh(new THREE.BoxGeometry(100, 10, 40),
								   new THREE.MeshLambertMaterial({color: 0xe60026}));
		var bedFrontLeft = new THREE.Mesh(new THREE.BoxGeometry(5, 20, 5),//침대다리 왼쪽 앞
									  new THREE.MeshLambertMaterial({color: 0x8d4925}));
		var bedFrontRight = new THREE.Mesh(new THREE.BoxGeometry(5, 20, 5),//오른쪽 앞
									  new THREE.MeshLambertMaterial({color: 0x8d4925}));
		var bedRearLeft = new THREE.Mesh(new THREE.BoxGeometry(5, 20, 5),//왼쪽  뒤
								   new THREE.MeshLambertMaterial({color: 0x8d4925}));
		var bedRearRight = new THREE.Mesh(new THREE.BoxGeometry(5, 20, 5),//오른쪽 뒤
								   new THREE.MeshLambertMaterial({color: 0x8d4925}));
					
		var pillow = new THREE.Mesh(new THREE.BoxGeometry(7, 4, 30),//베개
								  		  new THREE.MeshLambertMaterial({color: 0xffffff}));

		camera.position.y = 10;
		
		bedFrontLeft.position.x = 40;
		bedFrontLeft.position.z = 15;

		bedFrontRight.position.x = 40;
		bedFrontRight.position.z = -15;

		bedRearLeft.position.x = -40;
		bedRearLeft.position.z = 15;

		bedRearRight.position.x = -40;
		bedRearRight.position.z = -15;

		pillow.position.y = 15;
		pillow.position.x = -45;
		
		

		cameraModel.add(camera);
		cameraModel.add(bedFrontLeft);
		cameraModel.add(bedFrontRight);
		cameraModel.add(bedRearLeft);
		cameraModel.add(bedRearRight);
		cameraModel.add(pillow);

		
		var functionBed = function(object, mode, selectedObject)
		{
			if(mode !== Scene.Mode.TUTORIAL)
			{	
				if(selectedObject == InventoryCombination){
					object.scene.initialDialog([
					"¿Deshacerme de la nota que tanto tiempo he tardado en localizar?",
					"Po' va a ser que no."
				]);
				}else{
					object.scene.initialDialog([
						"Es una camera. O mejor dicho, se parece a una camera.",
						"Tengo la sensación de que si me tumbo me romperé cuatro costillas."
					]);
				}
					
			}else{
				object.scene.initialDialog([
					"Desde luego, las condiciones son las óptimas para tumbarme.",
					"Pero ya he dormido suficiente, gracias."			
				]);
			}

		}

		var pointCamera = new THREE.Object3D();
		pointCamera.position.z = 50;


		var trueCamera = new ObjectCheck(cameraModel, functionBed, pointCamera, scene);
		//이불인가 교환인가
		trueCamera.position.x = -90;
		trueCamera.position.y = 10;
		trueCamera.rotation.y = Math.PI/2;

		var note = createCombination(InventoryCombination);
		note.position.y = -10;
		note.position.z = -10;
		note.rotateX(-Math.PI/2);

		trueCamera.insertChild(note);

		return trueCamera;
	}

	/** create los objects interactuables */
	var createObjects = function() //오브젝트 생성
	{
		var objects = new THREE.Object3D();

		// objects inventory
		var keyInventory = new ObjectInventory("Key", "imgs/inventory/key.png");
		var passwordInventory = new ObjectInventory("Password", "imgs/1031.png");

		// Interruptor de la light
		objects.add(lightInterrupt());

		//Poster
		objects.add(createPoster());

		// Door
		objects.add(createDoor(keyInventory));

		//Camera
		objects.add(createBed(passwordInventory));

		// Desk
		createDesk(objects, keyInventory, passwordInventory);

		return objects;
	};

	var init = function(self, scene)
	{
		createLights(self);
		self.room = createRoom();
		self.objects = createObjects();
		self.add(self.room);
		self.add(self.objects);
	};

	init(this, scene);
};

Stage.prototype = Object.create(THREE.Object3D.prototype);
Stage.prototype.constructor = Stage;