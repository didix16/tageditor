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
     *@var selectedText
     *@description The selected text inside the editor without HTML tags
     */
    this.selectedText = "";
    
    /**
     *@var tools
     *@description A HashMap that contains al loaded tools
     */
    this.tools = {};

    // Schema

    let initTools = [
        new Tool({
            internalName: "bold",
            icon: "fa-bold",
            code: function () {
                
                let string = this.internalElement.value;
                let newString = "";
                let start = string.indexOf(this.getSelectedText());
                
                if (string && start > -1) {
                    
                    let end = start + this.getSelectedText().length;
                    newString = string.substring(0, start) + "<strong>";
                    newString += this.getSelectedText() + "</strong>" + string.substring(end);
                    this.internalElement.value = newString;
                    // children[1] will be the content
                    console.log(start, string, this.parseHTMLAsText("<b>hola</b>"));
                    this.htmlEditor.children[1].innerHTML = this.parseHTMLAsText("<strong>hola</strong>");
                }
                this.htmlEditor.children[1].innerHTML = this.parseHTMLAsText("<strong>hola q hay!</strong>");

                return this;

            }.bind(this)
        }),
        new Tool({
            internalName: "italic",
            icon: "fa-italic"
        }),
        new Tool({
            internalName: "underline",
            icon: "fa-underline"
        }),
        new Tool({
            internalName: "align-left",
            icon: "fa-align-left"
        }),
        new Tool({
            internalName: "align-center",
            icon: "fa-align-center"
        }),
        new Tool({
            internalName: "align-right",
            icon: "fa-align-right"
        }),
        new Tool({
            internalName: "align-justify",
            icon: "fa-align-justify"
        }),
        new Tool({
            internalName: "link",
            icon: "fa-link"
        }),
        new Tool({
            internalName: "list",
            icon: "fa-list"
        }),
        new Tool({
            internalName: "list-ol",
            icon: "fa-list-ol"
        })
    ];
    //1. Load tools - Init with default tools
    this.loadTools(initTools);

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
        return DOMGenerator.createElement("div").addClass("tageditor-content").attr("contenteditable",true).getElement()
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
        tool = DOMGenerator
            .createElement("span").addClass("tool")
            .html('<i class="fa ' + tool.icon + '"></i>')
            .on("click",tool.code)
            .getElement();
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
 *@description Load a single TagEditor tool and append to toolbar
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

/**
 *@description Load a TagEditor tools through a tool array and append to toolbar
 */
TagEditor.prototype.loadTools = function (toolArray) {
    
    if (Array.isArray(toolArray)) {
        
        for (let i = 0; i < toolArray.length; i++){
            
            this.loadTool(toolArray[i]);
        }
    }

    return this;
}

/**
 *@description Sets the internal selectedText variable and returns the self instance of editor
 */
TagEditor.prototype.onSelectedText = function() {
     let text = (!!document.getSelection) ? document.getSelection().toString() :
    (!!window.getSelection)   ? window.getSelection().toString() :
            document.selection.createRange().text;
    
     this.selectedText = text;
     return this;
}

/**
 *@description Returns the selected text
 */
TagEditor.prototype.getSelectedText = function () {
    
    return this.selectedText;
}

/**
 *@description Get the HTML code and transform any tag to plain tag
 */
TagEditor.prototype.parseHTMLAsText = function (htmlString) {
    
    return htmlString.replace(/(<([^>]+)>)/g, function (match,tag,tagName,offset,string) {
        
        let newTxt = "<div class='tag";
        if (tagName.charAt(0) === "/") newTxt += "-end";
        return newTxt+"'>&lt;"+tagName+"&gt;</div>"
    });
}

TagEditor.prototype.registerEvents = function () {
    
    // Register the selection event
    this.htmlEditor.addEventListener("mouseup", this.onSelectedText.bind(this));
};

module.exports = TagEditor;