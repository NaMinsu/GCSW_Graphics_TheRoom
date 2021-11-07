Inventory = function()
{
    this.selected = -1;
    this.itemList = [];

    this.selectNext = function()
    {
        if(this.selected != -1)
        {
            var total = this.itemList.length;
            this.selected = (this.selected+1)%total;
        }
    };

    this.selectPrev = function()
    {
        if(this.selected != -1)
        {
            var total = this.itemList.length;
            this.selected = (this.selected-1 + total) % total;
        }
    };

    this.objectSelected = function()
    {
        var object = null;
        if(this.selected!=-1)
        {
            object = this.itemList[this.selected];
        }
        return object;
    };

    this.getNewItem = function(object)
    {
        this.itemList.push(object);
        this.selected = this.itemList.length - 1;
    };

    this.deleteItem = function(object)
    {
        var position = this.itemList.indexOf(object);
        this.itemList.splice(position,1);

        if (this.selected >= this.itemList.length)
            this.selected = this.itemList.length - 1;
    };

    this.itemListEmpty = function()
    {
        return this.itemList.length == 0;
    }
};

Inventory.prototype.constructor = Inventory;
