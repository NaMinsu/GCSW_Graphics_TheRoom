

/**
 * ObjectRecognition
 * 
 * @param {Object3D} model init Model
 * @param {InteractionFunction} interactionFunction ActivationObject interaction function
 * @param {ObjectInventory} ActivationObject object that interaction with environment
 * @param {ObjectInventory} objectRecoger  object that invertory object
 * @param {Scene} scene
 */


 ObjectRecognition = function(model, interactionFunction, objectRecoger, room, distance = 20, ActivationObject = null)
{
    ObjectInteract.call(this, model, interactionFunction, room, ActivationObject);

    this.objectRecoger = objectRecoger;
    this.distance = distance;

};

ObjectRecognition.prototype = Object.create(ObjectInteract.prototype);
ObjectRecognition.prototype.constructor = ObjectRecognition;

ObjectRecognition.prototype.interact = function(mode, SelectObject)
{
    var result = false;

    result = ObjectInteract.prototype.interact.call(this, mode, SelectObject);
    
    if ((this.ActivationObject === null || SelectObject === this.ActivationObject) && 
                (mode === Scene.Mode.INVESTIGANDO || mode === Scene.Mode.EXAMINANDO))
    {
        this.scene.getNewItem(this.objectRecoger);
        this.parent.remove(this);
        this.scene.ObjectVisualize(this.model, this.distance);
        //Jeugo 메소드에 맞춰서 변경하기  33 ~ 37 
    }

    return result;
};
