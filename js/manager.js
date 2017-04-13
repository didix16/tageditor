var TagEditor = require("./core");
var Manager = {

    editorsList: {

    },

    build: function (elem) {
        
        if(elem.id) this.editorsList[elem.id] = new TagEditor(elem);
        else if (elem.name) this.editorsList[elem.name] = new TagEditor(elem);
        else {
            this.editorsList["editor-num-"+Object.keys(this.editorsList).length] = new TagEditor(elem);
        }
        return this;
    },
    getAllInstances: function () {
        
        return this.editorsList;
    }
}

module.exports = Manager;