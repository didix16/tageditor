var DOMGenerator = require("./DOMGenerator");
var Tool = require("./tool");
function TagEditor(elem) {

    // Interval vars
    this.tags = null;
    /**
     *@var htmlEditor
     *@description The HTML Node Element which contain the whole editor
     */
    this.htmlEditor = null;

    /**
     *@var internalElement
     *@description The Node Element that was replaced by the editor and contains the real data
     */
    this.internalElement = null;

    /**
     *@var tools
     *@description A HashMap that contains al loaded tools
     */
    this.tools = {};

    // Schema

    //1. Load tools - Init with default tools
    this.loadTool(new Tool({
        internalName: "bold",
        icon: "fa-bold"
    }));

    //2. Replace elem and instert itself
    this.build(elem);

    //3. Register events ?
    this.registerEvents();

}

/**
 * @constant {Object} templateEditor
 * @description This field contains the HTML Node Elements to build the editor
 */
TagEditor.prototype.templateEditor = {

    outercontainer: function () {
        return DOMGenerator.createElement("div").addClass("tageditor-outercontainer").getElement()
    },
    header: function () {
        return DOMGenerator.createElement("div").addClass("tageditor-header").getElement()
    },
    content: function () {
        return DOMGenerator.createElement("div").addClass("tageditor-content").attr("contenteditable",true).text("Here the content like text and tags").getElement()
    },
    footer: function () {
        return DOMGenerator.createElement("div").addClass("tageditor-footer").text("Here some usefull displays like number of chars etc").getElement()
    }
};

/**
 * @description Just return the Node part of the editor to be used at build process
 */
TagEditor.prototype.getEditorPart = function (part) {
    
    return this.templateEditor[part]();
};

/**
 *@description Build the editor at the elem position
 */
TagEditor.prototype.build = function (elem) {
    
    //First assemble the editor...
    let editor = this.getEditorPart("outercontainer");
    let toolbar = this.getEditorPart("header");

    // Put the tools
    for (let toolId in this.tools) {
        
        let tool = this.tools[toolId];
        tool = DOMGenerator.createElement("span").addClass("tool").html('<i class="fa '+tool.icon+'"></i>').getElement();
        toolbar.appendChild(tool);
    }

    editor.appendChild(toolbar);
    editor.appendChild(this.getEditorPart("content"));
    editor.appendChild(this.getEditorPart("footer"));

    console.info(editor);
    // Then insert at elem position
    elem.insertAdjacentElement(DOMGenerator.INSERT_ELEMENT_BEFORE_BEGIN,editor);

    // And finally, transform elem into input hidden
    this.internalElement = DOMGenerator.createElement("input").attr("type", "hidden");
    if (elem.name) this.internalElement.attr("name", elem.name);
    if (elem.id) this.internalElement.attr("name", elem.id);

    this.internalElement = this.internalElement.getElement();
    editor.insertAdjacentElement(DOMGenerator.INSERT_ELEMENT_AFTER_END, this.internalElement);
    
    this.htmlEditor = editor;
    elem.remove();
    return this;

};

/**
 *@description Load a TagEditor tool and append to toolbar
 */
TagEditor.prototype.loadTool = function (tool) {
    
    if (tool instanceof Tool) {
        
        let _tool = this.tools[tool.internalName];
        if (!_tool)
             this.tools[tool.internalName] = tool;
        else throw Error(`The tool [{tool.internalName}] is already loaded!`);
    }
    return this;
};

TagEditor.prototype.registerEvents = function () {
    
};

module.exports = TagEditor;