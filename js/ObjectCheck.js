/**
 * ObjectCheck
 * 
 * @param {Object3D} model init model
 * @param {InteractionFunction} interactionFunction 
 * @param {ObjectInventory} ActivationObject 
 * @param {Object3D} CameraPoint Detail Camera Point
 * @param {Scene} scene 
 */


ObjectCheck = function(model, interactionFunction, CameraPoint, room, ActivationObject = null)
{
    ObjectInteract.call(this, model, interactionFunction, room, ActivationObject);

    // Variables
    this.CameraPoint = CameraPoint;
    this.intermediate.add(CameraPoint);
};

ObjectCheck.prototype = Object.create(ObjectInteract.prototype);
ObjectCheck.prototype.constructor = ObjectCheck;

ObjectCheck.prototype.interact = function(mode, ObjectSelection)
{
    var result = false;

    if (mode === Scene.Mode.TUTORIAL){
        result = ObjectInteract.prototype.interact.call(this, mode,ObjectSelection);
    }else if (mode === Scene.Mode.INVESTIGATION)
        this.scene.objectCheck(this);
    else if (mode === Scene.Mode.EXAMINATION)
    result = ObjectInteract.prototype.interact.call(this, mode,ObjectSelection);

    return result;
};

ObjectCheck.prototype.getCameraPoint = function()
{
    return this.CameraPoint;
}
