/**
 * ObjectInteract
 * 
 * @param {Object3D} model 
 * @param {InteractionFunction} interactionFunction 
 * @param {ObjectInventory} ActivationObject 
 */
ObjectInteract = function(model, interactionFunction, room, ActivationObject = null)
{
	THREE.Object3D.call(this);
    
	this.intermediate = new THREE.Object3D();
    this.model = model;
	this.interactionFunction = interactionFunction;
    this.scene = room;
    this.ActivationObject = ActivationObject;
    this.state = {};

    this.intermediate.add(model);
    this.add(this.intermediate);

    // 픽업을 허용하기 위해 대상에 데이터를 추가합니다.
    this.userData.objectInteract = this;
    this.userData.objectParent = null;
};

ObjectInteract.prototype = Object.create(THREE.Object3D.prototype);
ObjectInteract.prototype.constructor = ObjectInteract;

ObjectInteract.prototype.getState = function()
{
    return this.state;
};

ObjectInteract.prototype.insertChild = function(obejct)
{
    this.intermediate.add(obejct);

    // 픽업을 허용하기 위해 대상에 데이터를 추가합니다.
    obejct.userData.objectParent = this;
}

ObjectInteract.prototype.interact = function(mode, ObjectSelection)
{
    var result = false;
    result = this.interactionFunction(this, mode, ObjectSelection);
    return result;
}
