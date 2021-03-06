/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var TagEditor = __webpack_require__(2);
var Manager = {

    editorsList: {},

    build: function build(elem) {

        if (elem.id) this.editorsList[elem.id] = new TagEditor(elem);else if (elem.name) this.editorsList[elem.name] = new TagEditor(elem);else {
            this.editorsList["editor-num-" + Object.keys(this.editorsList).length] = new TagEditor(elem);
        }
        return this;
    },
    getAllInstances: function getAllInstances() {

        return this.editorsList;
    }
};

module.exports = Manager;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function DOMGenerator() {

    this.elem = null;
    return this;
}

DOMGenerator.prototype.constructor = DOMGenerator;

DOMGenerator.prototype.INSERT_ELEMENT_BEFORE_BEGIN = "beforebegin";
DOMGenerator.prototype.INSERT_ELEMENT_AFTER_BEGIN = "afterbegin";
DOMGenerator.prototype.INSERT_ELEMENT_BEFORE_END = "beforeend";
DOMGenerator.prototype.INSERT_ELEMENT_AFTER_END = "afterend";

DOMGenerator.prototype.getElement = function () {

    return this.elem;
};

DOMGenerator.prototype.createElement = function (el) {

    this.elem = document.createElement(el);
    return this;
};

DOMGenerator.prototype.addClass = function (clas) {

    this.elem.className += " " + clas;
    return this;
};

DOMGenerator.prototype.removeClass = function (clas) {

    var classes = this.elem.className.split(" ");
    var i = 0,
        notFound = true;
    for (; notFound && i < classes.length; i++) {

        if (classes[i] === clas) {
            notFound = false;
            classes.splice(i, 1);
        }
    }
    this.elem.className = classes.join(" ");
    return this;
};

DOMGenerator.prototype.html = function (data) {

    if (typeof data === "string") {

        this.elem.innerHTML = data;
        return this;
    } else {
        return this.elem.innerHTML;
    }
};

DOMGenerator.prototype.text = function (data) {

    if (typeof data === "string") {

        this.elem.innerText = data;
        return this;
    } else {
        return this.elem.innerText;
    }
};

DOMGenerator.prototype.attr = function (attr, value) {

    if (typeof value === "undefined") {

        return this.elem.getAttribute(attr);
    } else {
        this.elem.setAttribute(attr, value);
        return this;
    }
};

DOMGenerator.prototype.id = function (data) {

    if (typeof data === "string" || typeof data === "number") {

        this.elem.id = data;
        return this;
    } else {
        return this.elem.id;
    }
};

DOMGenerator.prototype.on = function (evtName, callback) {

    this.elem.addEventListener(evtName, callback);
    return this;
};

module.exports = new DOMGenerator();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DOMGenerator = __webpack_require__(1);
var Tool = __webpack_require__(4);
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

    var initTools = [new Tool({
        internalName: "bold",
        icon: "fa-bold",
        code: function () {

            var string = this.internalElement.value;
            var newString = "";
            var start = string.indexOf(this.getSelectedText());

            if (string && start > -1) {

                var end = start + this.getSelectedText().length;
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
    }), new Tool({
        internalName: "italic",
        icon: "fa-italic"
    }), new Tool({
        internalName: "underline",
        icon: "fa-underline"
    }), new Tool({
        internalName: "align-left",
        icon: "fa-align-left"
    }), new Tool({
        internalName: "align-center",
        icon: "fa-align-center"
    }), new Tool({
        internalName: "align-right",
        icon: "fa-align-right"
    }), new Tool({
        internalName: "align-justify",
        icon: "fa-align-justify"
    }), new Tool({
        internalName: "link",
        icon: "fa-link"
    }), new Tool({
        internalName: "list",
        icon: "fa-list"
    }), new Tool({
        internalName: "list-ol",
        icon: "fa-list-ol"
    })];
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

    outercontainer: function outercontainer() {
        return DOMGenerator.createElement("div").addClass("tageditor-outercontainer").getElement();
    },
    header: function header() {
        return DOMGenerator.createElement("div").addClass("tageditor-header").getElement();
    },
    content: function content() {
        return DOMGenerator.createElement("div").addClass("tageditor-content").attr("contenteditable", true).getElement();
    },
    footer: function footer() {
        return DOMGenerator.createElement("div").addClass("tageditor-footer").text("Here some usefull displays like number of chars etc").getElement();
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
    var editor = this.getEditorPart("outercontainer");
    var toolbar = this.getEditorPart("header");

    // Put the tools
    for (var toolId in this.tools) {

        var tool = this.tools[toolId];
        tool = DOMGenerator.createElement("span").addClass("tool").html('<i class="fa ' + tool.icon + '"></i>').on("click", tool.code).getElement();
        toolbar.appendChild(tool);
    }

    editor.appendChild(toolbar);
    editor.appendChild(this.getEditorPart("content"));
    editor.appendChild(this.getEditorPart("footer"));

    console.info(editor);
    // Then insert at elem position
    elem.insertAdjacentElement(DOMGenerator.INSERT_ELEMENT_BEFORE_BEGIN, editor);

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

        var _tool = this.tools[tool.internalName];
        if (!_tool) this.tools[tool.internalName] = tool;else throw Error("The tool [{tool.internalName}] is already loaded!");
    }
    return this;
};

/**
 *@description Load a TagEditor tools through a tool array and append to toolbar
 */
TagEditor.prototype.loadTools = function (toolArray) {

    if (Array.isArray(toolArray)) {

        for (var i = 0; i < toolArray.length; i++) {

            this.loadTool(toolArray[i]);
        }
    }

    return this;
};

/**
 *@description Sets the internal selectedText variable and returns the self instance of editor
 */
TagEditor.prototype.onSelectedText = function () {
    var text = !!document.getSelection ? document.getSelection().toString() : !!window.getSelection ? window.getSelection().toString() : document.selection.createRange().text;

    this.selectedText = text;
    return this;
};

/**
 *@description Returns the selected text
 */
TagEditor.prototype.getSelectedText = function () {

    return this.selectedText;
};

/**
 *@description Get the HTML code and transform any tag to plain tag
 */
TagEditor.prototype.parseHTMLAsText = function (htmlString) {

    return htmlString.replace(/(<([^>]+)>)/g, function (match, tag, tagName, offset, string) {

        var newTxt = "<div class='tag";
        if (tagName.charAt(0) === "/") newTxt += "-end";
        return newTxt + "'>&lt;" + tagName + "&gt;</div>";
    });
};

TagEditor.prototype.registerEvents = function () {

    // Register the selection event
    this.htmlEditor.addEventListener("mouseup", this.onSelectedText.bind(this));
};

module.exports = TagEditor;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var TagEditorManager = __webpack_require__(0);
window.onload = function () {
    // Find all elements with data-tageditor and instantiate it
    var elements = document.querySelectorAll("[data-tageditor]");
    var i = 0;
    for (; i < elements.length; i++) {

        // Generate
        TagEditorManager.build(elements[i]);
    }
};
window.TagEditorManager = TagEditorManager;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Tool(opts) {

    // Initialize Tool by opts
    for (var prop in this) {

        if (opts[prop]) this[prop] = opts[prop];
    }
    return this;
}

Tool.prototype.constructor = Tool;
/**
 *@var internalName
 *@description An internal name that indentificates the tageditor tool
 */
Tool.prototype.internalName = "";

/**
 *@var icon
 *@description A fontawesome class icon
 */
Tool.prototype.icon = "";

Tool.prototype.code = function () {

    // Execution tool code
};

module.exports = Tool;

/***/ })
/******/ ]);