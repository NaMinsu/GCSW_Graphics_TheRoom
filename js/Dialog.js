Dialog = function()
{
    var textBox = null;
    var textSequence = 0;

    this.createDialog = function(text)
    {
        textBox = text;
        textSequence = 0;
    }

    this.passText = function()
    {
        textSequence += 1;

        return textSequence > textBox.length-1;
    }

    this.text = function()
    {
        return textBox[textSequence];
    }
}

Dialog.prototype.constructor = Dialog;