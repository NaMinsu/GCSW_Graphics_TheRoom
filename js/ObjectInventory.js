/**
 * ObjectInventory
 * 
 * @param {String} name object name
 * @param {String} image Image Url
 
 */


 ObjectInventory = function(name, image)
{
    this.name = name;
    this.image = image;

};

ObjectInventory.prototype.constructor = ObjectInventory;

ObjectInventory.prototype.getName = function()
{
    return this.name;
};

ObjectInventory.prototype.getImage = function()
{
    return this.image;
};

ObjectInventory.prototype.setName = function(name)
{
    this.name = name;
};

ObjectInventory.prototype.setImage = function(image)
{
    this.image = image;
};