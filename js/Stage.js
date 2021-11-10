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

		var posterTexture = new THREE.TextureLoader(); //충전기 텍스처??
		this.textureImage = posterTexture.load("imgs/brick.jpg");

		var wall= new THREE.BoxGeometry(300, 100, 300); //상자 벽
		var materialWalls = new THREE.MeshLambertMaterial({
			color: 0xffffff, map: this.textureImage
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
					"전등이 켜졌다!", //와! 불켜짐!
				]);
			}{
				object.scene.initialDialog([
					"전등이 켜졌으니 더 이상 스위치를 건드릴 일은 없다.",
					"서둘러 방을 나갈 방법을 찾아보자."
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

	var createFrame = function(objects, keyInventory, InventoryCombination)
		{
			var functionFrame = function(object, mode, objectseleccionado)
			{
				if (mode !== Scene.Mode.TUTORIAL)
				{
					object.scene.initialDialog([
						"벽에는 그림이 그려진 액자가 걸려있다.",
						"그림 속에는 기괴한 얼굴의 노파가 아기를 안고 있는 모습이 보인다.",
						"계속 보다보니 기분이 나쁘다. 다른 곳을 둘러보자."
					]);
				}else{
					object.scene.initialDialog([
						"벽에 무언가 걸려있지만 어두워서 잘 보이지 않는다."
					]);
				}
			}
		var frameMTL = new THREE.MTLLoader(); 
		frameMTL.setPath("models/Frame/");

		frameMTL.load("frame.mtl", function(materials)
				{
					materials.preload(); //material
					
					var frameObjects = new THREE.OBJLoader();
					frameObjects.setMaterials(materials);
					frameObjects.setPath("models/Frame/");

					frameObjects.load("frame.obj", function(modelFrame)
					{
						modelFrame.scale.set(0.25, 0.3, 0.2);

						var pointCamera = new THREE.Object3D(); //카메라포인트
						pointCamera.position.z = 50;

						var frame = new ObjectCheck(modelFrame, functionFrame, pointCamera, scene);//책상
						frame.position.x = -50;
						frame.position.y = 50;
						frame.position.z = -149.5;
						

						

						objects.add(frame);
					});
				});
		}


		var createBookshelf = function(objects, keyInventory, InventoryCombination)
		{
			var functionBookshelf = function(object, mode, objectseleccionado)
			{
				if (mode !== Scene.Mode.TUTORIAL)
				{
					object.scene.initialDialog([
						"불켜질 때 책장대사",
					]);
				}else{
					object.scene.initialDialog([
						"불꺼질 때 책장대사"
					]);
				}
			}
		var bookshelfMTL = new THREE.MTLLoader(); 
		bookshelfMTL.setPath("models/Bookshelf/");

		bookshelfMTL.load("bookshelf.mtl", function(materials)
				{
					materials.preload(); //material
					
					var bookshelfObjects = new THREE.OBJLoader();
					bookshelfObjects.setMaterials(materials);
					bookshelfObjects.setPath("models/Bookshelf/");

					bookshelfObjects.load("bookshelf.obj", function(modelBookshelf)
					{
						modelBookshelf.scale.set(1.3, 1.3, 1.2);

						var pointCamera = new THREE.Object3D(); //카메라포인트
						pointCamera.position.x = -10;
						pointCamera.position.y = 50;
						pointCamera.position.z = -80;


						pointCamera.rotation.y = -Math.PI/1;


						var bookshelf = new ObjectCheck(modelBookshelf, functionBookshelf, pointCamera, scene);//책상
						bookshelf.position.x = -120;
						bookshelf.position.z = 137;
						

						

						objects.add(bookshelf);
					});
				});
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
						"나: 응?",
						"나: 문을 열었는데 왜 벽이 나오는거야?!",
						"나: 그럼 대체 어떻게 빠져나가야 하지?",
						"Game Over."
					]);

					}
				}else{
					object.scene.initialDialog([
						"문이다. 잠겨 있는 문.",
						"아무래도 문을 열어야 나갈 수 있는 것 같다.",
						"하지만 문을 열 수 있는 도구 같은 것은 찾지 못했다.",
						"...",
						"주변을 더 둘러보자."
					]);
				}

			}else{
				object.scene.initialDialog([
					"문이 잠겨있다. 일단 전등을 켜서 열쇠부터 찾아야 할 것 같다."
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
						"번호를 누르자 금고가 열렸다.",
						"금고 안에는 열쇠가 있다. 어디에 쓰는 열쇠일까?"
					]);
					throwing = true;
				}
			}
			else
			{
				if(!opened){
					object.scene.initialDialog([
						"금고가 있다. 다이얼로 비밀번호를 입력하면 열리는 것 같다.",
						"하지만 비밀번호를 알 방법이 있을까?"
					]);
				}else{
					object.scene.initialDialog([
					"금고가 열려 있다."
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
				"나는 금고 안에 있는 열쇠를 집어들었다.",
				"이걸로 어딘가를 열 수 있지 않을까?",
				"시스템: 열쇠를 획득했습니다."
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

	var createComputer = function(objects, keyInventory, InventoryCombination)
		{
		var functionComputer = function(object, mode, objectseleccionado)
		{
			if(mode !== Scene.Mode.TUTORIAL){ //modo = 방법
							if (objectselected === InventoryCombination) {
							object.scene.initialDialog([
								"비밀번호를 입력해봤지만 틀렸다는 메시지가 뜬다.",
								"아무래도 여기에 쓰는 번호가 아닌 듯 하다."
							]);
						}
						else {
							object.scene.initialDialog([
								"책상 다른 한쪽에 컴퓨터가 놓여 있다.",
								"모니터에 비밀번호를 입력하는 창이 떠있다."
							]);
						}

						}else{
							object.scene.initialDialog([ //불 안키고 상호작용 할때
								"책상이 하나 놓여있다.",
								"무언가 커다란 게 놓여져 있지만 어두워서 알아볼 수 없다.",
								"아무래도 전등을 켤 수 있는 건 없을 것 같다."
							]);
						}
			}
		var computerMTL = new THREE.MTLLoader(); 
		computerMTL.setPath("models/desktop_computer/");

		computerMTL.load("desktop_computer.mtl", function(materials)
				{
					materials.preload(); //material
					
					var computerObjects = new THREE.OBJLoader();
					computerObjects.setMaterials(materials);
					computerObjects.setPath("models/desktop_computer/");

					computerObjects.load("desktop_computer.obj", function(modelComputer)
					{
						modelComputer.scale.set(15, 12, 15);

						var pointCamera = new THREE.Object3D(); //카메라포인트
						pointCamera.position.x = 0;
						pointCamera.position.y = 0;
						pointCamera.position.z = 20;

						var computer = new ObjectCheck(modelComputer, functionComputer, pointCamera, scene);//책상
						computer.position.x = 100;
						computer.position.z = -100;
						computer.translateX(-32);
						computer.translateY(48);
						computer.translateZ(-25);
						

						objects.add(computer);
					});
				});
		}


	var createDesk = function(objects, keyInventory, InventoryCombination)//책상 생성
	{
		var functionDesk = function(object, mode, objectseleccionado)
		{
			if(mode !== Scene.Mode.TUTORIAL){ //modo = 방법
				if(objectseleccionado === keyInventory){
					object.scene.initialDialog([
					"서랍에 열쇠를 끼워보려 했지만, 맞는 열쇠가 아닌 것 같다."
					]);
				}else{
					object.scene.initialDialog([
						"책상이다. 책상 위에 금고가 있고, 서랍은 열리지 않는 것 같다.",
						"서랍이나 금고를 열 방법을 찾으면 무언가 얻을 수 있을지도 모른다."
					]);
				}

			}else{
				object.scene.initialDialog([ //불 안키고 상호작용 할때
					"책상이 하나 놓여있다.",
					"무언가 커다란 게 놓여져 있지만 어두워서 알아볼 수 없다.",
					"아무래도 전등을 켤 수 있는 건 없을 것 같다."
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
				"침대 밑을 보니 '1031'이라고 적힌 쪽지가 있다.",
				"대체 이 번호는 무슨 의미지?",
				"시스템: '1031' 쪽지를 획득했습니다."
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
		var bedModel = new THREE.Object3D();

		// 25 20 10
		var bed = new THREE.Mesh(new THREE.BoxGeometry(100, 10, 40),
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

		bed.position.y = 10;
		
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
		
		

		bedModel.add(bed);
		bedModel.add(bedFrontLeft);
		bedModel.add(bedFrontRight);
		bedModel.add(bedRearLeft);
		bedModel.add(bedRearRight);
		bedModel.add(pillow);

		
		var functionBed = function(object, mode, selectedObject)
		{
			if(mode !== Scene.Mode.TUTORIAL)
			{	
				if(selectedObject == InventoryCombination){
					object.scene.initialDialog([
					"더 누워 있고 싶지만 이러고 있을 시간이 없다.",
					"다른 곳을 찾아보자."
				]);
				}else{
					object.scene.initialDialog([
						"침대 자체에는 별로 특별한 건 없어보인다.",
						"대신 침대 바닥에 뭔가 있는거 같은데..."
					]);
				}
					
			}else{
				object.scene.initialDialog([
					"내가 누워있던 침대다.",
					"더 이상 자고 있을 수 없다. 탈출할 방법을 찾아보자."				
				]);
			}

		}

		var pointCamera = new THREE.Object3D();
		pointCamera.position.z = 50;


		var trueBed = new ObjectCheck(bedModel, functionBed, pointCamera, scene);
		//이불인가 교환인가
		trueBed.position.x = -90;
		trueBed.position.y = 10;
		trueBed.rotation.y = Math.PI/2;

		var note = createCombination(InventoryCombination);
		note.position.y = -10;
		note.position.z = -10;
		note.rotateX(-Math.PI/2);

		trueBed.insertChild(note);

		return trueBed;
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

		//Frame
		createFrame(objects, keyInventory, passwordInventory);

		//Bookshelf
		createBookshelf(objects, keyInventory, passwordInventory);

		// Door
		objects.add(createDoor(keyInventory));

		//Camera
		objects.add(createBed(passwordInventory));

		// Desk
		createDesk(objects, keyInventory, passwordInventory);

		createComputer(objects, keyInventory, passwordInventory);

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
